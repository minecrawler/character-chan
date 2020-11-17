import {TPoint} from "./draw-point-service.spec";
import {TGroupData} from "./group-service.spec";
import {TTemplateInfo} from "./template-service.spec";

export enum EEventTypes {
    DPChangePoint,
    DPNewPoint,
    DPRemovePoint,
    GroupChangeActive,
    GroupNewGroup,
    GroupUpdate,
    HistoryBack,
    HistoryStep,
    TemplateChange,
}

export interface IEventDataMap {
    [EEventTypes.DPChangePoint]: TPoint
    [EEventTypes.DPNewPoint]: TPoint
    [EEventTypes.DPRemovePoint]: TPoint
    [EEventTypes.GroupChangeActive]: { old: TGroupData, new: TGroupData }
    [EEventTypes.GroupNewGroup]: TGroupData
    [EEventTypes.GroupUpdate]: TGroupData
    [EEventTypes.HistoryBack]: void
    [EEventTypes.HistoryStep]: void
    [EEventTypes.TemplateChange]: TTemplateInfo
}
