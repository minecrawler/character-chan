import {SlimFit} from 'slim-fit';
import {drawPointService, EEventTypes, eventService, groupService} from "../../app/app";
import * as template from './group-item.pug';
import * as css from './group-item.scss';


export class GroupItem extends SlimFit {
    constructor() {
        super();

        const update = () => {
            this.dirty = true;
            this.tryRender();
        };

        eventService.addListener(EEventTypes.GroupChangeActive, data => {
            if (!data) return;

            const name = this.name;

            if (data.old.name == name || data.new.name == name) {
                update();
            }
        });

        eventService.addListener(EEventTypes.DPNewPoint, update);
        //eventService.addListener(EEventTypes.DPChangePoint, update);
        eventService.addListener(EEventTypes.DPRemovePoint, update);
    }

    public get active(): boolean {
        return groupService.activeGroup.name == this.name;
    }

    public get color(): string {
        const group = groupService.getGroup(this.name);
        if (!group) throw new Error(`Group ${this.name} does not exist!`);

        return group.color;
    }

    public get name(): string {
        const name = this.getAttribute('name');
        if (!name) throw new Error('Missing name attribute!');

        return name;
    }

    public set name(name: string) {
        this.setAttribute('name', name);
    }

    protected render(): void {
        const group = groupService.getGroup(this.name);
        if (!group) throw new Error('Could not find group!');

        this.draw(template(Object.assign({
            points: Array.from(drawPointService.getPoints(group.name)),
        }, group)), css);

        {// Activate
            const nameEle = this.$<HTMLDivElement>('#name');
            if (!nameEle) throw new Error('Missing internal element!');

            nameEle.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('activate'));
            });
        }

        {// Change Segment Count
            const segmentCountInputEle = this.$<HTMLInputElement>('#segment-count');
            if (!segmentCountInputEle) throw new Error('Missing internal element!');

            const update = () => {
                const group = groupService.getGroup(this.name);
                if (!group) throw new Error('Could not find group!');

                group.segmentCount = parseInt(segmentCountInputEle.value) || 1;
                groupService.updateGroup(group);
            };

            segmentCountInputEle.addEventListener('change', update);
            segmentCountInputEle.addEventListener('keydown', update);
            segmentCountInputEle.addEventListener('keyup', update);
        }

        {// Change Tension
            const tensionInputEle = this.$<HTMLInputElement>('#tension');
            if (!tensionInputEle) throw new Error('Missing internal element!');

            const update = () => {
                const group = groupService.getGroup(this.name);
                if (!group) throw new Error('Could not find group!');

                group.tension = parseFloat(tensionInputEle.value) || 0;
                groupService.updateGroup(group);
            };

            tensionInputEle.addEventListener('change', update);
            tensionInputEle.addEventListener('keydown', update);
            tensionInputEle.addEventListener('keyup', update);
        }
    }
}

GroupItem.registerTag('cs-group-item');
