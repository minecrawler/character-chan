import {SlimFit} from 'slim-fit';
import * as template from './group-menu.pug';
import * as css from './group-menu.scss';
import {groupService} from "../../app/app";
import { TinyColor } from '@ctrl/tinycolor';
import {GroupItem} from "../group-item/group-item";
import { TGroupData } from '../../app/group-service';

export class GroupMenu extends SlimFit {
    static get observedAttributes(): string[] { return []; }

    protected lastGroupCount = 0;

    constructor() {
        super();

        groupService.addListener4NewGroup(group => {
            const groupListEle = this.$('.groups');
            if (!groupListEle) throw new Error('Missing internal group list element!');

            const liEle = document.createElement('li');
            const groupItemEle = document.createElement('cs-group-item') as GroupItem;

            groupItemEle.name = group.name;
            groupListEle.appendChild(liEle);
            liEle.appendChild(groupItemEle);

            groupItemEle.addEventListener('activate', () => {
                groupService.activeGroup = groupService.getGroup(group.name) as TGroupData;
            });
        });
    }

    protected render(): void {
        this.draw(template({
            groups: Array.from(groupService.getGroups()),
        }), css);

        this.$<HTMLButtonElement>('button#add')?.addEventListener('click', () => {
            const name = 'default_' + groupService.groupCount;
            const newGroup: TGroupData = groupService.newGroup(name);

            newGroup.color = new TinyColor('red').spin(groupService.groupCount * 66.666).toHexString();
            groupService.addGroup(newGroup);
            groupService.activeGroup = newGroup;
        });

        this.$$<GroupItem>('ul.groups > li > cs-group-item').forEach(groupEle => {
            groupEle.addEventListener('activate', () => {
                groupService.activeGroup = groupService.getGroup(groupEle.name) as TGroupData;
            });
        });
    }
}

GroupMenu.registerTag('cs-group-menu');
