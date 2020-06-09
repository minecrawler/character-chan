import {SlimFit} from 'slim-fit';
import * as template from './toolbar.pug';
import * as css from './toolbar.scss';

export class Toolbar extends SlimFit {
    static get observedAttributes(): string[] { return []; }

    protected render(): void {
        this.draw(template(), css);
    }
}

Toolbar.registerTag('cs-toolbar');
