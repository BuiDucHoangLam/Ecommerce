import React from 'react'
import Jumbotron from '../component/card/Jumbotron'
import NewArrivals from '../component/home/NewArrivals'
import BestSellers from '../component/home/BestSellers'
import CategoryList from '../component/category/CategoryList'
import SubList from '../component/sub/SubList'

function Home() {

  return (
    <div>
      <div className="jumbotron text-danger h1 font-weight-bold text-center">
        <Jumbotron text={['Latest Products','New Arrivals','Best Sellers']}/>
        {/* {JSON.stringify(products)} */}
      </div>

      <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
        New Arrivals
      </h4>

      <NewArrivals/>
      
      <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
        Best Sellers
      </h4>

      <BestSellers/>

      <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
        Categories
      </h4>
      <CategoryList/>

      <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
        Sub Categories
      </h4>
      <SubList/>

      <br />
      <br />
    </div>
  )
}

export default Home
