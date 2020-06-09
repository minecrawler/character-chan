import {SlimFit} from 'slim-fit';
import * as template from './template-menu.pug';
import * as css from './template-menu.scss';
import {templateService} from "../../app/app";

export class TemplateMenu extends SlimFit {
    static get observedAttributes(): string[] { return []; }

    protected render(): void {
        this.draw(template(), css);

        {
            const inputELe = this.$<HTMLInputElement>('#template-file');
            if (!inputELe) throw new Error('Internal input element missing!');

            inputELe.addEventListener('change', () => {
                if (!inputELe.files || inputELe.files?.length == 0) return;

                const reader = new FileReader();

                reader.onload = result => {
                    templateService.setData(result.target?.result?.toString() || undefined);
                };

                reader.readAsDataURL(inputELe.files[0]);
            });
        }

        {
            const scaleEle = this.$<HTMLInputElement>('input#scale');
            if (!scaleEle) throw new Error('Internal input element missing!');

            scaleEle.addEventListener('change', () => {
                templateService.setScaleFactor(parseFloat(scaleEle.value));
            });
        }
    }
}

TemplateMenu.registerTag('cs-template-menu');
