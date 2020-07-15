import LinkedList from "ts-linked-list";
import {IHistoryService, THistoryHandler} from "./history-service.spec";


export * from './history-service.spec';

export class HistoryService implements IHistoryService {
    protected _index = -1;
    protected listeners4Back: Set<Function> = new Set();
    protected listeners4Step: Set<Function> = new Set();
    protected namedListeners4Back: Map<string, Function> = new Map();
    protected namedListeners4Step: Map<string, Function> = new Map();
    protected steps: LinkedList<{do: THistoryHandler, undo: THistoryHandler}> = new LinkedList();

    get index(): number {
        return this._index;
    }

    get length(): number {
        return this.steps.length;
    }

    addListener4Back(handler: Function, name?: string) {
        if (name) {
            this.namedListeners4Back.set(name, handler);
        }
        else {
            this.listeners4Back.add(handler);
        }
    }

    addListener4Step(handler: Function, name?: string) {
        if (name) {
            this.namedListeners4Step.set(name, handler);
        }
        else {
            this.listeners4Step.add(handler);
        }
    }

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

    removeListener4Back(name: string) {
        if (!this.namedListeners4Back.delete(name)) {
            throw new Error(`No named back-listener called "${name}" could be found`);
        }
    }

    removeListener4Step(name: string) {
        if (!this.namedListeners4Step.delete(name)) {
            throw new Error(`No named step-listener called "${name}" could be found`);
        }
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
        for (const listener of this.namedListeners4Back.values()) {
            listener();
        }

        for(const listener of this.listeners4Back) {
            listener();
        }
    }

    protected updateListeners4Step() {
        for (const listener of this.namedListeners4Step.values()) {
            listener();
        }

        for(const listener of this.listeners4Step) {
            listener();
        }
    }
}
