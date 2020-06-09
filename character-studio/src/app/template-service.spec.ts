export type TChangeHandler = (data?: string) => void;

export interface ITemplateService {
    registerChangeListener(handler: TChangeHandler): void
    setData(data?: string): void
}
