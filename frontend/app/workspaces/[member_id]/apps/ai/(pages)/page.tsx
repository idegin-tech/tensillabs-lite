import AppBody from '@/components/layout/app-layout/AppBody'
import React from 'react'

export default function page() {
  return (
    <AppBody>
      <div>
        {new Array(30).fill(0).map(() => {
          return <h1 className='text-5xl font-bold text-center my-10 text-muted-foreground'>
            AI App
          </h1>
        })}
      </div>
    </AppBody>
  )
}
