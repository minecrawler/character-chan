export type TPoint = {
    coords: TPointCoords,
    id: string
};
export type TPointCoords = [number, number];

export interface IDrawPointService {
    /**
     * Add a point
     * @param coords
     */
    addPoint(coords: TPointCoords): TPoint

    getPointById(id: string): TPoint

    getPoints(group: string): IterableIterator<TPoint>

    updatePoint(point: TPoint, updateHistory?: boolean): void
}
