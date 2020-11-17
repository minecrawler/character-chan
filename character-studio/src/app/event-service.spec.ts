export type TEventHandler<K> = (data?: K) => Promise<void> | void;

export interface IEventService<DataMap> {
    addListener<K extends keyof DataMap>(event: K, handler: TEventHandler<DataMap[K]>): void
    dispatch<K extends keyof DataMap>(event: K, data: DataMap[K]): Promise<void>
    removeListener<K extends keyof DataMap>(event: K, handler: TEventHandler<DataMap[K]>): void
}
