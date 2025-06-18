import React from 'react'
import EachTaskDetailsProperty from './EachTaskDetailsProperty'
import { TbCalendar, TbCircleDashed, TbFlag3, TbUsers } from 'react-icons/tb'
import TaskDetailsTabs from './TaskDetailsTabs'
import { TaskStatusProperty, TaskPriorityProperty, TaskTimeframeProperty } from '../TaskProperties'
import { TaskStatus, TaskPriority } from '@/types/tasks.types'

export default function TaskDetails() {
    return null;
    return (
        <div className='bg-popover select-none shadow-lg w-[700px] border-l z-50 fixed right-0 bottom-0 h-app-body grid grid-cols-1 space-y-6 md:mb-[8px]'>
            <div>
                <header className='border-b h-app-header-sm'></header>
                <div className='flex'>
                    <div className='flex-1'>


                        <div className='p-4 space-y-8'>
                            <div className='p-2 hover:bg-accent rounded-lg' id='task-description'>
                                <h1 className='text-3xl font-bold line-clamp-2'>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam minima at repellendus aut necessitatibus dolorem eaque natus voluptas! Doloribus explicabo quisquam repudiandae optio laudantium earum molestias nobis rem a quos?
                                </h1>
                            </div>

                            <div className='grid grid-cols-2 gap-y-16'>                                <EachTaskDetailsProperty
                                    Icon={<TbCircleDashed />}
                                    label='Status'
                                >
                                    <TaskStatusProperty value={TaskStatus.TODO} />
                                </EachTaskDetailsProperty>
                                <EachTaskDetailsProperty
                                    Icon={<TbFlag3 />}
                                    label='Priority'
                                >
                                    <TaskPriorityProperty value={TaskPriority.HIGH} />
                                </EachTaskDetailsProperty>
                                <EachTaskDetailsProperty
                                    Icon={<TbCalendar />}
                                    label='Timeframe'
                                >
                                    <TaskTimeframeProperty value={{ start: '2024-07-23', end: '2024-07-29' }} />
                                </EachTaskDetailsProperty>
                                <EachTaskDetailsProperty
                                    Icon={<TbUsers />}
                                    label='Assignees'
                                >
                                    <span>No assignees</span>
                                </EachTaskDetailsProperty>
                            </div>
                        </div>


                    </div>
                    <TaskDetailsTabs/>
                </div>
            </div>
        </div>
    )
}

