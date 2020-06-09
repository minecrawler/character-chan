import {SlimFit} from 'slim-fit';
import * as template from './main-menu.pug';
import * as css from './main-menu.scss';

export class MainMenu extends SlimFit {
    static get observedAttributes(): string[] { return []; }

    protected render(): void {
        this.draw(template(), css);
    }
}

MainMenu.registerTag('cs-main-menu');
