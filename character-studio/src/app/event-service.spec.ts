import {EEventTypes} from "./event-types";

export type TEventData = { [key: string]: any };
export type TEventHandler = (data?: TEventData) => Promise<void> | void;

export enum EServiceEventTypes {
    //...
}

export interface IEventService {
    addListener(event: EEventTypes, handler: TEventHandler): void
    dispatch(event: EEventTypes, data?: TEventData): Promise<void>
    removeListener(event: EEventTypes, handler: TEventHandler): void
}
