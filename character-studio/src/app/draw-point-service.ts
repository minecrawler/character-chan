import {IDrawPointService, TPoint, TPointCoords, TPointListener1, TPointListener2} from "./draw-point-service.spec";
import {uuid} from "./util";
import LinkedList from "ts-linked-list";
import {groupService, historyService} from "./app";

export * from './draw-point-service.spec';


export class DrawPointService implements IDrawPointService {
    protected groupPoints: Map<string, LinkedList<string>> = new Map();
    protected listeners4ChangePoint: Set<TPointListener1> = new Set();
    protected listeners4NewPoint: Set<TPointListener1> = new Set();
    protected listeners4RemovePoint: Set<TPointListener1> = new Set();
    protected points: Map<string, TPoint> = new Map();

    addListener4ChangePoint(handler: TPointListener1) {
        this.listeners4ChangePoint.add(handler);
    }

    addListener4NewPoint(handler: TPointListener1) {
        this.listeners4NewPoint.add(handler);
    }

    addListener4RemovePoint(handler: TPointListener1) {
        this.listeners4RemovePoint.add(handler);
    }

    addPoint(coords: TPointCoords): TPoint {
        const activeGroupName = groupService.activeGroup.name;
        const point: TPoint = {
            coords: Array.from(coords) as TPointCoords,
            id: uuid(),
        };

        const doer = () => {
            this.points.set(point.id, point);

            {
                let groupPoints = this.groupPoints.get(activeGroupName);

                if (!groupPoints) {
                    groupPoints = new LinkedList();
                    this.groupPoints.set(activeGroupName, groupPoints);
                }

                groupPoints.append(point.id);
            }

            this.updateListeners4NewPoint(point);
        }

        const undoer = () => {
            const pointGroup = this.groupPoints.get(activeGroupName);
            const pointGroupIndex = pointGroup?.findIndex(pointId => pointId == point.id) ?? -1;

            this.points.delete(point.id);
            pointGroup?.removeAt(pointGroupIndex);

            this.updateListeners4RemovePoint(point);
        }

        historyService.setNextStep(doer, undoer);
        // todo: error handler
        historyService.step();

        return point;
    }

    *getPoints(group: string): IterableIterator<TPoint> {
        const groupPoints = this.groupPoints.get(group);
        if (!groupPoints) return;

        for (const pointId of groupPoints) {
            const point = this.points.get(pointId);
            if (!point) throw new Error(`Point ${pointId} is missing!`);

            yield {
                coords: Array.from(point.coords) as TPointCoords,
                id: point.id,
            };
        }
    }

    protected updateListeners4ChangePoint(newPoint: TPoint) {
        for (const listener of this.listeners4ChangePoint) {
            listener(Object.assign({}, newPoint));
        }
    }

    protected updateListeners4NewPoint(newPoint: TPoint) {
        for (const listener of this.listeners4NewPoint) {
            listener(Object.assign({}, newPoint));
        }
    }

    protected updateListeners4RemovePoint(removedPoint: TPoint) {
        for (const listener of this.listeners4RemovePoint) {
            listener(Object.assign({}, removedPoint));
        }
    }

    updatePoint(point: TPoint) {
        const p = this.points.get(point.id);
        if (!p) throw new Error('Point not found: ' + point.id);

        const oldPoint = Object.assign({}, p);
        const newPoint = Object.assign({}, p);

        newPoint.coords = Array.from(point.coords) as TPointCoords;
        historyService.setNextStep(() => {
            p.coords = newPoint.coords;
            this.updateListeners4ChangePoint(p);
        }, () => {
            p.coords = oldPoint.coords;
            this.updateListeners4ChangePoint(p);
        });
        historyService.step();
    }
}
