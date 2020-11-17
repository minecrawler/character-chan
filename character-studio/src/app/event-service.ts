import {IEventService, TEventHandler} from "./event-service.spec";

export * from './event-service.spec';

export class EventService<DataMap> implements IEventService<DataMap> {
    // todo: improve typing
    private listeners: Map<keyof DataMap, Set<TEventHandler<any>>> = new Map();

    addListener<K extends keyof DataMap>(event: K, handler: TEventHandler<DataMap[K]>): void {
        let handlers = this.listeners.get(event);

        if (!handlers) {
            handlers = new Set();
            this.listeners.set(event, handlers);
        }

        handlers.add(handler);
    }

    async dispatch<K extends keyof DataMap>(event: K, data: DataMap[K]): Promise<void> {
        const proms: (Promise<void> | void)[] = [];

        this.listeners.get(event)?.forEach(handler => proms.push(handler(Object.assign({}, data))));
        await Promise.all(proms);
    }

    removeListener<K extends keyof DataMap>(event: K, handler: TEventHandler<DataMap[K]>): void {
        this.listeners.get(event)?.delete(handler);
    }
}
