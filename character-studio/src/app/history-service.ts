import LinkedList from "ts-linked-list";
import {IHistoryService, THistoryHandler} from "./history-service.spec";


export * from './history-service.spec';

export class HistoryService implements IHistoryService {
    protected _index = 0;
    protected listeners4Back: Set<Function> = new Set();
    protected listeners4Step: Set<Function> = new Set();
    protected steps: LinkedList<{do: THistoryHandler, undo: THistoryHandler}> = new LinkedList();

    get index(): number {
        return this._index;
    }

    get length(): number {
        return this.steps.length;
    }

    addListener4Back(handler: Function) {
        this.listeners4Back.add(handler);
    }

    addListener4Step(handler: Function) {
        this.listeners4Step.add(handler);
    }

    async back(): Promise<void> {
        if (this._index == 0) return;
        await this.steps.get(this._index--)?.undo();
        this.updateListeners4Back();
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
        for(const listener of this.listeners4Back) {
            listener();
        }
    }

    protected updateListeners4Step() {
        for(const listener of this.listeners4Step) {
            listener();
        }
    }
}
