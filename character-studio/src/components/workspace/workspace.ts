import {SlimFit} from 'slim-fit';
import * as template from './workspace.pug';
import * as css from './workspace.scss';
import * as wasm from "character-chan";
import {drawPointService, templateService} from "../../app/app";
import {TPoint, TPointCoords} from "../../app/draw-point-service.spec";
import {TTemplateInfo} from "../../app/template-service";

export class Workspace extends SlimFit {
    static get observedAttributes(): string[] { return []; }

    protected ctx?: CanvasRenderingContext2D;

    constructor() {
        super(false);
        this.addEventListener('error', console.error);

        drawPointService.registerChangeListener(groups => {
            this.drawCharacter();
            this.drawPoints();
        });

        templateService.registerChangeListener(info => {
            this.updateTemplate(info);
        });
    }

    protected async render(): Promise<void> {
        this.draw(template(), css);

        {
            const canvasEle = this.$<HTMLCanvasElement>('canvas');
            if (!canvasEle) throw new Error('Internal canvas element missing!');

            {
                const context = canvasEle.getContext('2d');
                if (!context) throw new Error('Could not get rendering context!');

                this.ctx = context;
            }

            canvasEle.addEventListener('click', eve => {
                drawPointService.addPoint([eve.offsetX, eve.offsetY]);
            });
        }

        {
            const bodyEle = this.$('#body');
            if (!bodyEle) throw new Error('Internal body element missing!');

            const updateAll = (eve: any) => {
                if (!eve.dataTransfer) return false;

                eve.preventDefault();

                const boundingRect = bodyEle.getBoundingClientRect();
                const point: TPoint = JSON.parse(eve.dataTransfer.getData("text/plain"));

                point.coords = [
                    (eve as DragEvent).clientX - boundingRect.x,
                    (eve as DragEvent).clientY - boundingRect.y,
                ];

                drawPointService.updatePoint(point);
            };

            bodyEle.addEventListener('dragover', updateAll);
            bodyEle.addEventListener('drop', updateAll);
        }

        this.update();
    }

    public clearCharacter() {
        this.drawCharacter();
    }

    public clearPoints() {
        if (!this.ctx) throw new Error('Canvas has not been initialized, yet!');

        const points = this.queryInternalElements<HTMLDivElement>('.point');

        for (const point of Array.from(points)) {
            point.parentElement?.removeChild(point);
        }
    }

    public drawCharacter() {
        if (!this.ctx) throw new Error('Canvas has not been initialized, yet!');

        const canvasEle = this.ctx.canvas;
        if (!canvasEle) throw new Error('Internal canvas element missing!');

        this.ctx.clearRect(0, 0, canvasEle.width, canvasEle.height);
        for (const group of drawPointService.getGroups()) {
            if (group.points.length < 2) continue;

            const linePoints = wasm.test(group.points.toArray().map(p => p.coords));

            this.ctx.beginPath();
            this.ctx.moveTo(linePoints[0].x, linePoints[0].y);

            for (let i = 1; i < linePoints.length; i++) {
                this.ctx.lineTo(linePoints[i].x, linePoints[i].y);
            }

            this.ctx.strokeStyle = group.color;
            this.ctx.stroke();
        }
    }

    public drawPoints(points?: TPoint[]) {
        if (!this.ctx) throw new Error('Canvas has not been initialized, yet!');

        const bodyEle = this.queryInternalElement<HTMLDivElement>('#body');
        if (!bodyEle) throw new Error('Internal body element missing!');

        const canvasEle = this.ctx.canvas;
        if (!canvasEle) throw new Error('Internal canvas element missing!');

        const group = drawPointService.getGroup(drawPointService.activeGroup);
        if (!group) throw new Error('Active group does not exist');

        if (!points) {
            points = group.points.toArray();
        }

        this.clearPoints();
        for (const point of points) {
            const pointEle = document.createElement('div');

            pointEle.id = point.id;
            pointEle.classList.add('point');
            pointEle.draggable = true;
            pointEle.style.left = point.coords[0] + 'px';
            pointEle.style.top = point.coords[1] + 'px';
            pointEle.style.backgroundColor = group.color;
            bodyEle.appendChild(pointEle);

            pointEle.addEventListener('dragstart', eve => {
                if (!eve.dataTransfer) return;

                eve.dataTransfer.setData("text/plain", JSON.stringify(point));
                eve.dataTransfer.dropEffect = 'move';
            });
        }
    }


    public resize() {
        const canvasEle = this.ctx?.canvas;
        if (!canvasEle) throw new Error('Internal canvas element missing!');

        const canvasBoundingRect = canvasEle.getBoundingClientRect();
        canvasEle.width = canvasBoundingRect.width;
        canvasEle.height = canvasBoundingRect.height;
    }

    public update() {
        this.resize();
        this.drawCharacter();
    }

    protected updateTemplate(info: TTemplateInfo) {
        const templateEle = this.queryInternalElement<HTMLImageElement>('#template');
        if (!templateEle) throw new Error('Internal img-template element missing!');

        const factor = 100 * info.scaleFactor + '%';

        templateEle.src = info.data ?? '';
        templateEle.style.maxWidth = factor;
        templateEle.style.maxHeight = factor;
    }
}

Workspace.registerTag('cs-workspace');
