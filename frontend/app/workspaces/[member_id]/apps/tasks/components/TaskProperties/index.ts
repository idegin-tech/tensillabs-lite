export { default as TaskStatusProperty } from './TaskStatusProperty'
export { default as TaskPriorityProperty } from './TaskPriorityProperty'
export { default as TaskTimeframeProperty } from './TaskTimeframeProperty'

export type TaskPropertyProps = {
    value?: any;
    onChange?: (value:any) => void;
}
