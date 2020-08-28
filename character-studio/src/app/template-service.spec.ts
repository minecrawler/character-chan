export type TTemplateInfo = {
    data?: string,
    scaleFactor: number,
};

export enum EServiceEventTypes {
    TemplateChange,
}

export interface ITemplateService {
    hasData(): boolean

    setData(data?: string): void

    setScaleFactor(factor: number): void
}
