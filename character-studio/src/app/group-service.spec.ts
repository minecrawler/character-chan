export type TGroupData = {
    active?: boolean
    color: string
    name: string
    segmentCount: number
    tension: number
};

export enum EServiceEventTypes {
    GroupChangeActive,
    GroupNewGroup,
    GroupUpdate,
}

export interface IGroupService {
    activeGroup: TGroupData
    readonly groupCount: number

    addGroup(group: TGroupData): void

    newGroup(name: string): TGroupData

    getGroup(name: string): TGroupData | undefined

    getGroups(): IterableIterator<TGroupData>

    getGroupNames(): IterableIterator<string>

    updateGroup(group: TGroupData): void
}
