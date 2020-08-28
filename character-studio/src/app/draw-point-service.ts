import {IDrawPointService, TPoint, TPointCoords} from "./draw-point-service.spec";
import {uuid} from "./util";
import LinkedList from "ts-linked-list";
import {eventService, groupService, historyService} from "./app";
import {EEventTypes} from "./event-types";

export * from './draw-point-service.spec';


export class DrawPointService implements IDrawPointService {
    protected groupPoints: Map<string, LinkedList<string>> = new Map();
    protected points: Map<string, TPoint> = new Map();

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

    protected updateListeners4ChangePoint(point: TPoint) {
        eventService.dispatch(EEventTypes.DPChangePoint, Object.assign({}, Object.assign({}, point)));
    }

    protected updateListeners4NewPoint(point: TPoint) {
        eventService.dispatch(EEventTypes.DPNewPoint, Object.assign({}, Object.assign({}, point)));
    }

    protected updateListeners4RemovePoint(point: TPoint) {
        eventService.dispatch(EEventTypes.DPRemovePoint, Object.assign({}, Object.assign({}, point)));
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
