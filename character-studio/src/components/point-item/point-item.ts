import { SlimFit } from 'slim-fit';
import * as template from './point-item.pug';
import * as css from './point-item.scss';

export class PointItem extends SlimFit {
    get x(): number {
        return parseFloat(this.getAttribute('x') || '-1');
    }

    get y(): number {
        return parseFloat(this.getAttribute('y') || '-1');
    }

    render() {
        this.draw(template({
            x: this.x,
            y: this.y,
        }), css);
    }
}

PointItem.registerTag('cs-point-item');
