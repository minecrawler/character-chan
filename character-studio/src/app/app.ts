import {DrawPointService, IDrawPointService} from "./draw-point-service";
import {ITemplateService} from "./template-service.spec";
import {TemplateService} from "./template-service";

export const drawPointService: IDrawPointService = new DrawPointService();
export const templateService: ITemplateService = new TemplateService();
