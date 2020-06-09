import {SlimFit} from 'slim-fit';
import * as template from './group-menu.pug';
import * as css from './group-menu.scss';

export class GroupMenu extends SlimFit {
    static get observedAttributes(): string[] { return []; }

    protected render(): void {
        this.draw(template(), css);
    }
}

GroupMenu.registerTag('cs-group-menu');
