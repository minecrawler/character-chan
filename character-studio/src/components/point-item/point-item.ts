import { SlimFit } from 'slim-fit';
import * as template from './point-item.pug';
import * as css from './point-item.scss';
import {drawPointService, EEventTypes, eventService} from "../../app/app";

export class PointItem extends SlimFit {
    protected pointId!: string;

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
            this.fireError(new Error('Missing attribute: id'));
            return;
        }

        this.pointId = this.getAttribute('id')!;
        eventService.addListener(EEventTypes.DPChangePoint, point => {
            if (point?.id != this.pointId) return;

            this.dirty = true;
            this.tryRender();
        });
    }

    render() {
        const point = drawPointService.getPointById(this.pointId);

        this.draw(template({
            x: point.coords[0],
            y: point.coords[1],
        }), css);
    }
}

PointItem.registerTag('cs-point-item');
