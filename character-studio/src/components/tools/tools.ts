import * as template from './tools.pug';
import * as css from './tools.scss';
import { SlimFit } from 'slim-fit';

export class Tools extends SlimFit {
    static get observedAttributes(): string[] { return []; }

    protected render(): void {
        this.draw(template(), css);
    }
}

Tools.registerTag('cs-tools');
