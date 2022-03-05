import React from 'react'
import { Card,Skeleton } from 'antd'

const LoadingCard = ({count}) => {
  let i = 0
  const cards = () => {
    let totalCards = []
    for(i;i<count;i++) {
      totalCards.push(
        <Card key={i} className ='col-md-4'>
          <Skeleton active></Skeleton>
        </Card>
      )
    }
    return totalCards
  }
  return (
    <div className="row pb-5">
      {cards()}
    </div>
  )
}

export default LoadingCard
