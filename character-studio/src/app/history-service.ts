import LinkedList from "ts-linked-list";
import {IHistoryService, THistoryHandler} from "./history-service.spec";
import {EEventTypes, TEventService} from "./app";


export * from './history-service.spec';

export class HistoryService implements IHistoryService {
    protected _index = -1;
    protected steps: LinkedList<{do: THistoryHandler, undo: THistoryHandler}> = new LinkedList();

    get index(): number {
        return this._index;
    }

    get length(): number {
        return this.steps.length;
    }

    constructor(
        protected eventService: TEventService
    ) {}

    async back(): Promise<void> {
        if (this._index < 0) return;
        await this.steps.get(this._index)?.undo();
        this._index--;
        this.updateListeners4Back();
    }

    modifyCurrentStep(doer?: THistoryHandler, unDoer?: THistoryHandler): void {
        if (this._index < 0) return;

        const step = this.steps.get(this._index);
        if (!step) throw new Error('Step does not exist');

        if (doer) {
            step.do = doer;
        }

        if (unDoer) {
            step.undo = unDoer;
        }
    }

    removeCurrentStep(): void {
        if (this._index < 0) return;
        this.steps.removeAt(this._index--);
    }

    setNextStep(doer: THistoryHandler, unDoer: THistoryHandler): void {
        while (this.steps.length - 1 > this._index) {
            this.steps.removeAt(this.steps.length - 1)
        }

        this.steps.append({
            do: doer,
            undo: unDoer,
        });
    }

    async step(): Promise<void> {
        if (this._index + 1 == this.steps.length) return;
        await this.steps.get(++this._index)?.do();
        this.updateListeners4Step();
    }

    protected updateListeners4Back() {
        this.eventService.dispatch(EEventTypes.HistoryBack, undefined);
    }

    protected updateListeners4Step() {
        this.eventService.dispatch(EEventTypes.HistoryStep, undefined);
    }
}
