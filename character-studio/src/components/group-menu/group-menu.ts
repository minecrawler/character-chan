import {SlimFit} from 'slim-fit';
import * as template from './group-menu.pug';
import * as css from './group-menu.scss';
import {drawPointService} from "../../app/app";

export class GroupMenu extends SlimFit {
    static get observedAttributes(): string[] { return []; }

    protected render(): void {
        this.draw(template({
            activeGroup: drawPointService.activeGroup,
            groups: Array.from(drawPointService.getGroups()),
        }), css);
    }
}

GroupMenu.registerTag('cs-group-menu');
