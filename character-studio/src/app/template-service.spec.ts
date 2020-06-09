export type TChangeHandler = (info: TTemplateInfo) => void;
export type TTemplateInfo = {
    data?: string,
    scaleFactor: number,
};

export interface ITemplateService {
    registerChangeListener(handler: TChangeHandler): void
    hasData(): boolean
    setData(data?: string): void
    setScaleFactor(factor: number): void
}
