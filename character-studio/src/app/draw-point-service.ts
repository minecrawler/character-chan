import {IDrawPointService, TChangeListener, TGroupData, TPoint, TPointCoords} from "./draw-point-service.spec";
import {uuid} from "./util";
import LinkedList from "ts-linked-list";

export * from './draw-point-service.spec';


export class DrawPointService implements IDrawPointService {
    protected _activeGroup = 'default';
    protected changeListeners: TChangeListener[] = [];
    protected groups: Map<string, TGroupData> = new Map();
    protected points: Map<string, TPoint> = new Map();

    constructor() {
        this.groups.set('default', {
            color: '#FF0000',
            name: 'default',
            points: new LinkedList(),
        });
    }

    get activeGroup(): string {
        return this._activeGroup;
    }

    set activeGroup(group: string) {
        if (!Array.from(this.groups.keys()).includes(group)) throw new Error(`Group "${group}" does not exist!`);
        this._activeGroup = group;
        this.updateListeners();
    }

    get groupCount(): number {
        return this.groups.size;
    }

    addGroup(group: TGroupData) {
        this.groups.set(group.name, group);
        this.updateListeners();
    }

    addPoint(coords: TPointCoords): TPoint {
        const point: TPoint = {
            coords,
            id: uuid(),
        };
        this.points.set(point.id, point);
        this.groups.get(this._activeGroup)?.points.append(point);
        this.updateListeners();
        return point;
    }

    getGroup(name: string): TGroupData | undefined {
        return this.groups.get(name);
    }

    getGroups(): IterableIterator<TGroupData> {
        return this.groups.values();
    }

    getGroupNames(): IterableIterator<string> {
        return this.groups.keys();
    }

    registerChangeListener(listener: TChangeListener) {
        this.changeListeners.push(listener);
    }

    protected updateListeners() {
        for (const listener of this.changeListeners) {
            listener(this.groups);
        }
    }

    updatePoint(point: TPoint) {
        const p = this.points.get(point.id);
        if (!p) throw new Error('Point not found: ' + point.id);

        p.coords = point.coords;

        this.updateListeners();
    }
}
