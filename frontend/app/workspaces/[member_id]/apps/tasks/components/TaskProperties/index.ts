export { default as TaskStatusProperty } from './TaskStatusProperty'
export { default as TaskPriorityProperty } from './TaskPriorityProperty'
export { default as TaskTimeframeProperty } from './TaskTimeframeProperty'
export { default as TaskAssigneeProperty } from './TaskAssigneeProperty'

export type TaskPropertyProps = {
    value?: any;
    onChange?: (value:any) => void;
}
