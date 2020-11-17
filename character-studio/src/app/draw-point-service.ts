import {IDrawPointService, TPoint, TPointCoords} from "./draw-point-service.spec";
import {uuid} from "./util";
import LinkedList from "ts-linked-list";
import {groupService, historyService, TEventService} from "./app";
import {EEventTypes} from "./event-types";

export * from './draw-point-service.spec';


export class DrawPointService implements IDrawPointService {
    protected groupPoints: Map<string, LinkedList<string>> = new Map();
    protected points: Map<string, TPoint> = new Map();

    constructor(
        protected eventService: TEventService
    ) {}

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

    getPointById(id: string): TPoint {
        return Object.assign({}, this.points.get(id));
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
        this.eventService.dispatch(EEventTypes.DPChangePoint, Object.assign({}, point));
    }

    protected updateListeners4NewPoint(point: TPoint) {
        this.eventService.dispatch(EEventTypes.DPNewPoint, Object.assign({}, point));
    }

    protected updateListeners4RemovePoint(point: TPoint) {
        this.eventService.dispatch(EEventTypes.DPRemovePoint, Object.assign({}, point));
    }

    updatePoint(point: TPoint, updateHistory: boolean = true) {
        const p = this.points.get(point.id);
        if (!p) throw new Error('Point not found: ' + point.id);

        const oldPoint = Object.assign({}, p);
        const newPoint = Object.assign({}, p);

        newPoint.coords = Array.from(point.coords) as TPointCoords;

        if (updateHistory) {
            historyService.setNextStep(() => {
                p.coords = newPoint.coords;
                this.updateListeners4ChangePoint(p);
            }, () => {
                p.coords = oldPoint.coords;
                this.updateListeners4ChangePoint(p);
            });
            historyService.step();
        }
        else {
            p.coords = newPoint.coords;
            this.updateListeners4ChangePoint(p);
        }
    }
}
