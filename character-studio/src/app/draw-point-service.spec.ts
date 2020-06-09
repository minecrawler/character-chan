import LinkedList from "ts-linked-list";

export type TChangeListener = (groups: TPointGroups)=>void;
export type TGroupData = {
    color: string
    name: string
    points: LinkedList<TPoint>
};
export type TPoint = {
    coords: TPointCoords,
    id: string
};
export type TPointCoords = [number, number];
export type TPointGroups = Map<string, TGroupData>;

export interface IDrawPointService {
    activeGroup: string
    readonly groupCount: number

    addGroup(group: TGroupData): void

    /**
     * Add a point
     * @param coords
     */
    addPoint(coords: TPointCoords): TPoint

    getGroup(name: string): TGroupData | undefined

    getGroups(): IterableIterator<TGroupData>

    getGroupNames(): IterableIterator<string>

    registerChangeListener(listener: TChangeListener): void

    updatePoint(point: TPoint): void
}
