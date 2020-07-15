export type TGroupData = {
    active?: boolean
    color: string
    name: string
    segmentCount: number
    tension: number
};

export type TGroupListener1 = (group: TGroupData) => void;
export type TGroupListenerON = (oldGroup: TGroupData, newGroup: TGroupData) => void;

export interface IGroupService {
    activeGroup: TGroupData
    readonly groupCount: number

    addGroup(group: TGroupData): void

    addListener4ChangeActive(handler: TGroupListenerON): void

    addListener4NewGroup(handler: TGroupListener1): void

    addListener4Update(handler: TGroupListener1): void

    newGroup(name: string): TGroupData

    getGroup(name: string): TGroupData | undefined

    getGroups(): IterableIterator<TGroupData>

    getGroupNames(): IterableIterator<string>

    updateGroup(group: TGroupData): void
}
