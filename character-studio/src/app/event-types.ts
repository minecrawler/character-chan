import {EServiceEventTypes as DrawPointService} from './draw-point-service.spec';
import {EServiceEventTypes as EventService} from './event-service.spec';
import {EServiceEventTypes as GroupService} from './group-service.spec';
import {EServiceEventTypes as HistoryService} from './history-service.spec';
import {EServiceEventTypes as TemplateService} from './template-service.spec';

export const EEventTypes = {
    ...DrawPointService,
    ...EventService,
    ...GroupService,
    ...HistoryService,
    ...TemplateService,
};
export type EEventTypes = keyof typeof EEventTypes;
