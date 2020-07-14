export type THistoryHandler = () => Promise<void> | void;

export interface IHistoryService {
    index: number
    length: number

    addListener4Back(handler: Function): void
    addListener4Step(handler: Function): void

    back(): Promise<void>
    setNextStep(doer: THistoryHandler, unDoer: THistoryHandler): void
    step(): Promise<void>
}
