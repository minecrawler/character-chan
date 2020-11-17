import {DrawPointService, IDrawPointService} from "./draw-point-service";
import {ITemplateService, TemplateService} from "./template-service";
import {GroupService, IGroupService} from "./group-service";
import {IHistoryService} from "./history-service.spec";
import {HistoryService} from "./history-service";
import {EventService, IEventService} from "./event-service";
import {EEventTypes, IEventDataMap} from "./event-types";

export {EEventTypes};

export type TEventService = IEventService<IEventDataMap>;

export const eventService: TEventService = new EventService();
export const drawPointService: IDrawPointService = new DrawPointService(eventService);
export const groupService: IGroupService = new GroupService(eventService);
export const historyService: IHistoryService = new HistoryService(eventService);
export const templateService: ITemplateService = new TemplateService(eventService);

export const isDebug = function () {
    return localStorage.getItem('debug') === 'true';
}


if (isDebug()) {
    window.addEventListener('error', console.error);
}
