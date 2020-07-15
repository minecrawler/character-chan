export type THistoryHandler = () => Promise<void> | void;

export interface IHistoryService {
    index: number
    length: number

    addListener4Back(handler: Function, name?: string): void
    addListener4Step(handler: Function, name?: string): void
    back(): Promise<void>
    modifyCurrentStep(doer?: THistoryHandler, unDoer?: THistoryHandler): void
    removeCurrentStep(): void
    removeListener4Back(name: string): void
    removeListener4Step(name: string): void
    setNextStep(doer: THistoryHandler, unDoer: THistoryHandler): void
    step(): Promise<void>
}
