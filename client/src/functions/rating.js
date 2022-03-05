import React from 'react'
import StarRating from 'react-star-ratings'

export const showAverage = p => {
  if(p && p.ratings) {
    let ratingsArray = p && p.ratings
    let total = []
    let length = ratingsArray.length

    ratingsArray.map(r => total.push(r.star))
    let totalReduced = total.reduce((p,n) => {
      return p + n
    },0)
    // console.log(totalReduced);
    let highest = length * 5
    // console.log('highest',highest);
    let result = (totalReduced * 5) / highest
    // console.log('result',result);

    return (
      <div className ="text-center pt-1 pb-3"  >
        <span style ={{verticalAlign:'text-bottom'}}>
          <StarRating 
            starDimension = '20px' 
            starSpacing = '2px' 
            starRatedColor = 'red' 
            rating = {result} 
            editing = {false} 
          /> {' '}
        </span>
          <span style ={{verticalAlign: 'unset',fontSize: '0.8rem'}}>
          ({p.ratings.length})
          </span>
      </div>
    )
  }
}