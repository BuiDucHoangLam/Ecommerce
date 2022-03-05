import React,{useEffect,lazy,Suspense} from 'react'
import {Switch,Route} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import {auth} from './component/firebase'
import { useDispatch } from 'react-redux';
import { currentUser } from './functions/auth';
import { LoadingOutlined } from '@ant-design/icons';

// import Home from './pages/Home'
// import Login from './pages/Authorization/Login'
// import Register from './pages/Authorization/Register'
// import Header from './component/nav/Header'
// import SideDrawer from './component/drawer/SideDrawer';

// import RegisterComplete from './pages/Authorization/RegisterComplete';
// import ForgotPassword from './pages/Authorization/ForgotPassword';
// import History from './pages/user/History';
// import UserRoute from './component/routes/UserRoute';
// import AdminRoute from './component/routes/AdminRoute';
// import Password from './pages/user/Password';
// import Wishlist from './pages/user/Wishlist';
// import AdminDashboard from './pages/admin/AdminDashboard';
// import CategoryCreate from './pages/admin/category/CategoryCreate';
// import CategoryUpdate from './pages/admin/category/CategoryUpdate';
// import SubCreate from './pages/admin/sub/SubCreate';
// import SubUpdate from './pages/admin/sub/SubUpdate';
// import ProductCreate from './pages/product/ProductCreate';
// import AllProducts from './pages/product/AllProducts';
// import ProductUpdate from './pages/product/ProductUpdate';
// import Product from './pages/Product';
// import CategoryHome from './pages/category/CategoryHome';
// import SubHome from './pages/sub/SubHome';
// import Shop from './pages/Shop';
// import Cart from './pages/Cart';
// import Checkout from './pages/Checkout';
// import CreateCouponPage from './pages/admin/coupon/CreateCouponPage';
// import Payment from './pages/Payment';

// Using lazy
const Home = lazy(()=> import ('./pages/Home'))
const Login = lazy(() => import ('./pages/Authorization/Login'))
const Register = lazy(() => import ('./pages/Authorization/Register'))
const Header = lazy(() => import ('./component/nav/Header'))
const SideDrawer = lazy(() => import ('./component/drawer/SideDrawer'))

const RegisterComplete = lazy(() => import ('./pages/Authorization/RegisterComplete'))
const ForgotPassword = lazy(() => import ('./pages/Authorization/ForgotPassword'))
const History = lazy(() => import ('./pages/user/History'))
const UserRoute = lazy(() => import ('./component/routes/UserRoute'))
const AdminRoute = lazy(() => import ('./component/routes/AdminRoute'))
const Password = lazy(() => import ('./pages/user/Password'))
const Wishlist = lazy(() => import ('./pages/user/Wishlist'))
const AdminDashboard = lazy(() => import ('./pages/admin/AdminDashboard'))
const CategoryCreate = lazy(() => import ('./pages/admin/category/CategoryCreate'))
const CategoryUpdate = lazy(() => import ('./pages/admin/category/CategoryUpdate'))
const SubCreate = lazy(() => import ('./pages/admin/sub/SubCreate'))
const SubUpdate = lazy(() => import ('./pages/admin/sub/SubUpdate'))
const ProductCreate = lazy(() => import ('./pages/product/ProductCreate'))
const AllProducts = lazy(() => import ('./pages/product/AllProducts'))
const ProductUpdate = lazy(() => import ('./pages/product/ProductUpdate'))
const Product = lazy(() => import ('./pages/Product'))
const CategoryHome = lazy(() => import ('./pages/category/CategoryHome'))
const SubHome = lazy(() => import ('./pages/sub/SubHome'))
const Shop = lazy(() => import ('./pages/Shop'))
const Cart = lazy(() => import ('./pages/Cart'))
const Checkout = lazy(() => import ('./pages/Checkout'))
const CreateCouponPage = lazy(() => import ('./pages/admin/coupon/CreateCouponPage'))
const Payment = lazy(() => import ('./pages/Payment'))




const App =() => {
  const dispatch = useDispatch()

  // To check firebase auth state
  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged(async (user)=> {
      
      if(user) {
        // console.log(user);
        const idTokenResult = await user.getIdTokenResult()

        // Use current instead of createOrUpdate to prevent losing info
        currentUser(idTokenResult.token)
        .then(res=>{
          dispatch({
            type:'LOGGED_IN_USER',
            payload:{
              name:res.data.name,
              email:res.data.email,
              token:idTokenResult.token,
              role:res.data.role,
              _id:res.data._id,
            }
          })
        })
        .catch(err => console.log(err))
      }
    })

    return () => unsubscribe()
  },[dispatch])

  return (
    <Suspense fallback={
      <div className ='col text-center p-5'>
        __ KK <LoadingOutlined /> Shop __
      </div>
    }>
      <Header />
      <SideDrawer/>
      <ToastContainer />
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/register" component={Register}/>
        <Route exact path="/register/complete" component={RegisterComplete}/>
        <Route exact path="/forgot/password" component={ForgotPassword} />
        <UserRoute exact path="/user/history" component ={History} />
        <UserRoute exact path="/user/password" component ={Password} />
        <UserRoute exact path="/user/wishlist" component ={Wishlist} />
        <AdminRoute exact path ="/admin/dashboard" component = {AdminDashboard} />
        <AdminRoute exact path ="/admin/category" component = {CategoryCreate} />
        <AdminRoute exact path ="/admin/category/:slug" component = {CategoryUpdate} />
        <AdminRoute exact path ="/admin/sub" component = {SubCreate} />
        <AdminRoute exact path ="/admin/sub/:slug" component = {SubUpdate} />
        <AdminRoute exact path ="/admin/product" component = {ProductCreate} />
        <AdminRoute exact path = '/admin/products' component={AllProducts} />
        <AdminRoute exact path = '/admin/product/:slug' component={ProductUpdate} />
        <Route exact path = '/product/:slug' component = {Product} />
        <Route exact path = '/category/:slug' component = {CategoryHome} />
        <Route exact path = '/sub/:slug' component = {SubHome} />
        <Route exact path = '/shop' component = {Shop} />
        <Route exact path = '/cart' component = {Cart} />
        <UserRoute exact path = '/checkout' component = {Checkout} />
        <AdminRoute exact path ='/admin/coupon' component = {CreateCouponPage} />
        <UserRoute exact path = '/payment' component ={Payment} />
      </Switch>
    </Suspense>
  )
}

export default App

