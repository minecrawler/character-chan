import { SlimFit } from 'slim-fit';
import {groupService} from "../../app/app";

export class GroupItem extends SlimFit {
    private static ATTR_ACTIVE = 'active';
    private static ATTR_COLOR = 'color';
    private static ATTR_NAME = 'name';

    constructor() {
        super();

        groupService.addListener4ChangeActive((oldGroup, newGroup) => {
            const name = this.name;

            if (oldGroup.name == name || newGroup.name == name) {
                this.dirty = true;
                this.tryRender();
            }
        });
    }

    public get active(): boolean {
        return groupService.activeGroup.name == this.name;
    }

    public get color(): string {
        const group = groupService.getGroup(this.name);
        if (!group) throw new Error(`Group ${this.name} does not exist!`);

        return group.color;
    }

    public get name(): string {
        const name = this.getAttribute(GroupItem.ATTR_NAME);
        if (!name) throw new Error('Missing name attribute!');

        return name;
    }

    public set name(name: string) {
        this.setAttribute(GroupItem.ATTR_NAME, name);
    }

    static get observedAttributes(): string[] { return [
        this.ATTR_ACTIVE,
        this.ATTR_COLOR,
        this.ATTR_NAME,
    ]; }

    protected render(): void {
        this.draw(`<span>${this.name}</span>`, `span{color:${this.color};${this.active ? 'font-weight:bold;' : ''}}`);
    }
}

GroupItem.registerTag('cs-group-item');
