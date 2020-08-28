import {SlimFit} from 'slim-fit';
import * as template from './workspace.pug';
import * as css from './workspace.scss';
import * as wasm from "character-chan";
import {EEventTypes, drawPointService, eventService, groupService, historyService} from "../../app/app";
import {TPoint} from "../../app/draw-point-service.spec";
import {TTemplateInfo} from "../../app/template-service";

export class Workspace extends SlimFit {
    static get observedAttributes(): string[] { return []; }

    protected ctx?: CanvasRenderingContext2D;

    constructor() {
        super(false);

        const changeHandler = () => {
            this.drawCharacter();
            this.drawPoints();
        };

        eventService.addListener(EEventTypes.DPNewPoint, changeHandler);
        eventService.addListener(EEventTypes.DPChangePoint, changeHandler);
        eventService.addListener(EEventTypes.DPRemovePoint, changeHandler);
        eventService.addListener(EEventTypes.GroupNewGroup, changeHandler);
        eventService.addListener(EEventTypes.GroupChangeActive, changeHandler);
        eventService.addListener(EEventTypes.GroupUpdate, changeHandler);
        eventService.addListener(EEventTypes.TemplateChange, info => info && this.updateTemplate(info as TTemplateInfo));
    }

    protected async render(): Promise<void> {
        this.draw(template(), css);

        {// new point
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

        {// drag n drop
            const bodyEle = this.$('#body');
            if (!bodyEle) throw new Error('Internal body element missing!');

            const updateAll = (eve: any, isDrop: boolean = false) => {
                if (!eve.dataTransfer) return false;

                eve.preventDefault();

                const boundingRect = bodyEle.getBoundingClientRect();
                const originalPoint: TPoint = JSON.parse(eve.dataTransfer.getData("text/plain"));
                const point: TPoint = Object.assign({}, originalPoint);

                point.coords = [
                    (eve as DragEvent).clientX - boundingRect.x,
                    (eve as DragEvent).clientY - boundingRect.y,
                ];

                if (isDrop) {
                    // add big step
                    drawPointService.updatePoint(point);

                    const doer = () => drawPointService.updatePoint(point);
                    const undoer = () => {
                        drawPointService.updatePoint(originalPoint);
                        historyService.removeCurrentStep();
                    }

                    historyService.modifyCurrentStep(undefined, undoer);
                }
                else {
                    drawPointService.updatePoint(point);
                    // remove update step, because we don't want the little moves in the history
                    historyService.removeCurrentStep();
                }
            };

            bodyEle.addEventListener('dragover', updateAll);
            bodyEle.addEventListener('drop', eve => updateAll(eve, true));
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
        for (const group of groupService.getGroups()) {
            const points = Array.from(drawPointService.getPoints(group.name));
            if (points.length < 2) continue;

            const linePoints = wasm.test(points.map(p => p.coords), group.segmentCount, group.tension);

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

        const group = groupService.activeGroup;

        if (!points) {
            points = Array.from(drawPointService.getPoints(group.name));
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
