import AppBody from '@/components/layout/app-layout/AppBody'
import React from 'react'

export default function page() {
  return (
    <AppBody>
      <div>
        {new Array(30).fill(0).map(() => {
          return <h1 className='text-5xl font-bold text-center my-10 text-muted-foreground'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur quod fugit quas harum incidunt, itaque accusamus voluptatem amet culpa atque eligendi porro omnis eveniet voluptas eaque a velit, iure quo?
          </h1>
        })}
      </div>
    </AppBody>
  )
}
