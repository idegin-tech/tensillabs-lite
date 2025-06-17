import React from 'react'
import EachTaskDetailsProperty from './EachTaskDetailsProperty'
import { TbUsers } from 'react-icons/tb'
import TaskDetailsTabs from './TaskDetailsTabs'

export default function TaskDetails() {
    return (
        <div className='bg-popover select-none shadow-lg w-[800px] border-l z-[100] fixed right-0 bottom-0 h-app-body grid grid-cols-1 space-y-6 md:mb-[8px]'>
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

                            <div className='grid grid-cols-2 gap-3'>
                                <EachTaskDetailsProperty
                                    Icon={<TbUsers />}
                                    label='Assignees'
                                >
                                    HOw va na
                                </EachTaskDetailsProperty>
                                <EachTaskDetailsProperty
                                    Icon={<TbUsers />}
                                    label='Assignees'
                                >
                                    HOw va na
                                </EachTaskDetailsProperty>
                                <EachTaskDetailsProperty
                                    Icon={<TbUsers />}
                                    label='Assignees'
                                >
                                    HOw va na
                                </EachTaskDetailsProperty>
                                <EachTaskDetailsProperty
                                    Icon={<TbUsers />}
                                    label='Assignees'
                                >
                                    HOw va na
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

