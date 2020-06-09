import {SlimFit} from 'slim-fit';
import * as template from './group-menu.pug';
import * as css from './group-menu.scss';
import {drawPointService} from "../../app/app";
import { TinyColor } from '@ctrl/tinycolor';
import LinkedList from "ts-linked-list";

export class GroupMenu extends SlimFit {
    static get observedAttributes(): string[] { return []; }

    protected lastGroupCount = 0;

    constructor() {
        super();
        drawPointService.registerChangeListener(groups => {
            if (groups.size != this.lastGroupCount) {
                this.dirty = true;
                this.tryRender();
            }
        });
    }

    protected render(): void {
        this.draw(template({
            activeGroup: drawPointService.activeGroup,
            groups: Array.from(drawPointService.getGroups()),
        }), css);

        this.$<HTMLButtonElement>('button#add')?.addEventListener('click', () => {
            const name = 'default_' + drawPointService.groupCount;
            drawPointService.addGroup({
                color: new TinyColor('red').spin(drawPointService.groupCount * 75).toHexString(),
                name,
                points: new LinkedList(),
            });
            drawPointService.activeGroup = name;
        });

        this.$$<HTMLLIElement>('ul.groups > li').forEach(groupEle => {
            groupEle.addEventListener('click', () => {
                drawPointService.activeGroup = groupEle.innerText;
            });
        });
    }
}

GroupMenu.registerTag('cs-group-menu');
