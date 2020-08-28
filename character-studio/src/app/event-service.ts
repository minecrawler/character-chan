import {IEventService, TEventData, TEventHandler} from "./event-service.spec";
import {EEventTypes} from "./event-types";

export * from './event-service.spec';

export class EventService implements IEventService {
    private listeners: Map<EEventTypes, Set<TEventHandler>> = new Map();

    addListener(event: EEventTypes, handler: TEventHandler): void {
        let handlers = this.listeners.get(event);

        if (!handlers) {
            handlers = new Set();
            this.listeners.set(event, handlers);
        }

        handlers.add(handler);
    }

    async dispatch(event: EEventTypes, data: TEventData): Promise<void> {
        const proms: (Promise<void> | void)[] = [];

        this.listeners.get(event)?.forEach(handler => proms.push(handler(Object.assign({}, data))));
        await Promise.all(proms);
    }

    removeListener(event: EEventTypes, handler: TEventHandler): void {
        this.listeners.get(event)?.delete(handler);
    }
}
