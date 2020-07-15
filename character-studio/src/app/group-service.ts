import {IGroupService, TGroupData, TGroupListener1, TGroupListenerON} from "./group-service.spec";


export * from './group-service.spec';

export class GroupService implements IGroupService {
    protected _activeGroup: TGroupData;
    protected groups: Map<string, TGroupData> = new Map();
    protected listeners4ChangeActive: Set<TGroupListenerON> = new Set();
    protected listeners4NewGroup: Set<TGroupListener1> = new Set();
    protected listeners4Update: Set<TGroupListener1> = new Set();

    constructor() {
        const defaultGroup = this.newGroup('default');

        this.groups.set('default', defaultGroup);
        this._activeGroup = defaultGroup;
    }

    get activeGroup(): TGroupData {
        return Object.assign({}, this._activeGroup);
    }

    set activeGroup(activateGroup: TGroupData) {
        if (!Array.from(this.groups.values()).find(group => activateGroup.name == group.name)) {
            throw new Error(`Group "${activateGroup.name}" does not exist!`);
        }

        const oldActive = this._activeGroup;

        for (const group of this.groups.values()) {
            if (group.name != activateGroup.name) {
                group.active = false;
            }
            else {
                group.active = true;
                this._activeGroup = group;
            }
        }

        this.updateListeners4ChangeActive(oldActive, this._activeGroup);
    }

    get groupCount(): number {
        return this.groups.size;
    }

    addGroup(newGroup: TGroupData) {
        const group = Object.assign({}, newGroup);
        this.groups.set(group.name, group);
        this.updateListeners4NewGroup(group);
    }

    addListener4ChangeActive(handler: TGroupListenerON) {
        this.listeners4ChangeActive.add(handler);
    }

    addListener4NewGroup(handler: TGroupListener1) {
        this.listeners4NewGroup.add(handler);
    }

    addListener4Update(handler: TGroupListener1) {
        this.listeners4Update.add(handler);
    }

    getGroup(name: string): TGroupData | undefined {
        return Object.assign({}, this.groups.get(name));
    }

    *getGroups(): IterableIterator<TGroupData> {
        for (const group of this.groups.values()) {
            yield Object.assign({}, group);
        }
    }

    getGroupNames(): IterableIterator<string> {
        return this.groups.keys();
    }

    newGroup(name: string): TGroupData {
        return {
            active: true,
            color: '#FF0000',
            name,
            segmentCount: 16,
            tension: .5,
        };
    }

    updateGroup(group: TGroupData) {
        if (!this.groups.has(group.name)) throw new Error(`Group "${group.name}" does not exist!`);
        this.groups.set(group.name, Object.assign({}, group));
        this.updateListeners4Update(group);
    }

    protected updateListeners4ChangeActive(oldActive: TGroupData, newActive: TGroupData) {
        for (const listener of this.listeners4ChangeActive) {
            listener(
                Object.assign({}, Object.assign({}, oldActive)),
                Object.assign({}, Object.assign({}, newActive))
            );
        }
    }

    protected updateListeners4NewGroup(group: TGroupData) {
        for (const listener of this.listeners4NewGroup) {
            listener(Object.assign({}, Object.assign({}, group)));
        }
    }

    protected updateListeners4Update(group: TGroupData) {
        for (const listener of this.listeners4Update) {
            listener(Object.assign({}, Object.assign({}, group)));
        }
    }
}
