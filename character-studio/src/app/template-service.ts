import {ITemplateService, TTemplateInfo} from "./template-service.spec";
import {EEventTypes, TEventService} from "./app";

export * from './template-service.spec';

export class TemplateService implements ITemplateService {
    protected data?: string;
    protected scaleFactor: number = 1;

    constructor(
        protected eventService: TEventService
    ) {}

    public hasData(): boolean {
        return !!this.data;
    }

    public setData(data?: string): void {
        this.data = data;
        this.updateHandlers();
    }

    public setScaleFactor(factor: number = 1) {
        this.scaleFactor = factor;
        this.updateHandlers();
    }

    protected updateHandlers() {
        this.eventService.dispatch(EEventTypes.TemplateChange, {
            data: this.data,
            scaleFactor: this.scaleFactor,
        } as TTemplateInfo);
    }
}
