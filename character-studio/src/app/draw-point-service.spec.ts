export type TPoint = {
    coords: TPointCoords,
    id: string
};
export type TPointCoords = [number, number];

export enum EServiceEventTypes {
    DPChangePoint,
    DPNewPoint,
    DPRemovePoint,
}

export interface IDrawPointService {
    /**
     * Add a point
     * @param coords
     */
    addPoint(coords: TPointCoords): TPoint

    getPoints(group: string): IterableIterator<TPoint>

    updatePoint(point: TPoint): void
}
