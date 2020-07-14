import {DrawPointService, IDrawPointService} from "./draw-point-service";
import {ITemplateService, TemplateService} from "./template-service";
import {GroupService, IGroupService} from "./group-service";
import {IHistoryService} from "./history-service.spec";
import {HistoryService} from "./history-service";

export const drawPointService: IDrawPointService = new DrawPointService();
export const groupService: IGroupService = new GroupService();
export const historyService: IHistoryService = new HistoryService();
export const templateService: ITemplateService = new TemplateService();
