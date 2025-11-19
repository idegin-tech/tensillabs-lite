export { default as TaskStatusProperty } from './TaskStatusProperty'
export { default as TaskPriorityProperty } from './TaskPriorityProperty'
export { default as TaskTimeframeProperty } from './TaskTimeframeProperty'
export { default as TaskAssigneeProperty } from './TaskAssigneeProperty'
export { default as TaskEstimatedHoursProperty } from './TaskEstimatedHoursProperty'
export { default as TaskProgressProperty } from './TaskProgressProperty'
export { default as TaskTagsProperty } from './TaskTagsProperty'
export { default as TaskBlockedProperty } from './TaskBlockedProperty'
export { default as TaskBlockingProperty } from './TaskBlockingProperty'

export type TaskPropertyProps = {
    value?: any;
    onChange?: (value:any) => void;
}
