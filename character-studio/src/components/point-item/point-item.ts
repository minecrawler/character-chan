import { SlimFit } from 'slim-fit';
import * as template from './point-item.pug';
import * as css from './point-item.scss';
import {drawPointService, EEventTypes, eventService} from "../../app/app";

export class PointItem extends SlimFit {
    protected pointId: string;

    get id(): string {
        return this.pointId;
    }

    get x(): number {
        return drawPointService.getPointById(this.pointId).coords[0];
    }

    get y(): number {
        return drawPointService.getPointById(this.pointId).coords[1];
    }

    constructor() {
        super();

        if (!this.hasAttribute('id')) {
            throw new Error('Missing attribute: id');
        }

        this.pointId = this.getAttribute('id')!;
        eventService.addListener(EEventTypes.DPChangePoint, () => {
            this.dirty = true;
            this.tryRender();
        });
    }

    render() {
        this.draw(template({
            x: this.x,
            y: this.y,
        }), css);
    }
}

PointItem.registerTag('cs-point-item');
