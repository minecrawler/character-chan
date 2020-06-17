import {DrawPointService, IDrawPointService} from "./draw-point-service";
import {ITemplateService, TemplateService} from "./template-service";
import {GroupService, IGroupService} from "./group-service";

export const drawPointService: IDrawPointService = new DrawPointService();
export const groupService: IGroupService = new GroupService();
export const templateService: ITemplateService = new TemplateService();
