export type TPointListener1 = (point: TPoint) => void;
export type TPointListener2 = (oldPoint: TPoint, newPoint: TPoint) => void;
export type TPoint = {
    coords: TPointCoords,
    id: string
};
export type TPointCoords = [number, number];

export interface IDrawPointService {
    addListener4ChangePoint(handler: TPointListener1): void

    addListener4NewPoint(handler: TPointListener1): void

    /**
     * Add a point
     * @param coords
     */
    addPoint(coords: TPointCoords): TPoint

    getPoints(group: string): IterableIterator<TPoint>

    updatePoint(point: TPoint): void
}
