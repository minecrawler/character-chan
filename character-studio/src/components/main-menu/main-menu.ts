import {SlimFit} from 'slim-fit';
import * as template from './main-menu.pug';
import * as css from './main-menu.scss';
import {historyService} from "../../app/app";

export class MainMenu extends SlimFit {
    private initialized = false;

    private initialize() {
        if (this.initialized) return;

        this.initialized = true;

        {// History buttons
            const backBtnEle = this.$<HTMLButtonElement>('#backward');
            if (!backBtnEle) throw new Error('Missing internal button element!');

            const forwardBtnEle = this.$<HTMLButtonElement>('#forward');
            if (!forwardBtnEle) throw new Error('Missing internal button element!');

            historyService.addListener4Step(() => {
                backBtnEle.disabled = historyService.index - 1 <= 0;
                forwardBtnEle.disabled = historyService.index + 1 >= historyService.length;
            });
        }
    }

    protected render(): void {
        this.draw(template(), css);
        this.initialize();

        {// History buttons
            const backBtnEle = this.$<HTMLButtonElement>('#backward');
            if (!backBtnEle) throw new Error('Missing internal button element!');

            const forwardBtnEle = this.$<HTMLButtonElement>('#forward');
            if (!forwardBtnEle) throw new Error('Missing internal button element!');

            backBtnEle.addEventListener('click', () => {
                backBtnEle.disabled = historyService.index - 1 <= 0;
                forwardBtnEle.disabled = false;
                historyService.back();
            });

            forwardBtnEle.addEventListener('click', () => {
                forwardBtnEle.disabled = historyService.index + 1 >= historyService.length;
                backBtnEle.disabled = false;
                historyService.step();
            });
        }
    }
}

MainMenu.registerTag('cs-main-menu');
