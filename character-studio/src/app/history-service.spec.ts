export type THistoryHandler = () => Promise<void> | void;

export interface IHistoryService {
    index: number
    length: number

    back(): Promise<void>

    modifyCurrentStep(doer?: THistoryHandler, unDoer?: THistoryHandler): void

    removeCurrentStep(): void

    setNextStep(doer: THistoryHandler, unDoer: THistoryHandler): void

    step(): Promise<void>
}
