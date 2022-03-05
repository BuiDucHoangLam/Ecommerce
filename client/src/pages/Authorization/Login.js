import React,{useEffect, useState} from 'react'
import {auth,googleAuthProvider} from '../../component/firebase'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'antd'
import {toast} from 'react-toastify'
import {MailOutlined, GoogleOutlined} from '@ant-design/icons';
import { Link } from 'react-router-dom'
import { createOrUpdateUser } from '../../functions/auth'

const Login =  ({history}) => {
  const [email,setEmail] = useState('longcot000@gmail.com')
  const [password,setPassword] = useState('Lam@0982841295')
  const [loading,setLoading] = useState(false)

  const {user} = useSelector(state => ({...state}))

  useEffect(()=>{
    let intended = history.location.state
    if(intended) return
    else {
      if(user && user.token) history.push('/')
    }
    if(user && user.token) history.push('/')
  },[user,history])

  let dispatch = useDispatch()

  const roleBaseRedirect = res => {
    // Check if intended
    let intended = history.location.state

    if(intended) {
      history.push(intended.from)
    } else {
      if(res.data.role === 'admin') {
        history.push('/admin/dashboard')
      } else {
        history.push('/user/history')
      }
    }
    
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // console.table(email,password);
    try {
      const result = await auth.signInWithEmailAndPassword(email,password)
      // console.log(result);
      const {user} = result
      const idTokenResult = await user.getIdTokenResult()

      createOrUpdateUser(idTokenResult.token)
      .then(res => {
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
        roleBaseRedirect(res)
      })
      .catch(err=>console.log(err))

      // history.push('/')
    } catch (error) {
      console.log(error);
      toast.error(error.message)
      setLoading(false)
    }
  }

  const googleSubmit = (e) => {
    e.preventDefault()
    auth.signInWithPopup(googleAuthProvider)
      .then(async (result)=>{
        const {user} = result
        const idTokenResult = await user.getIdTokenResult()
        
        createOrUpdateUser(idTokenResult.token)
        .then(res => {
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
          roleBaseRedirect(res)
        })
        .catch(err=>console.log(err))
        history.push('/')
      })
      .catch(error => {
        console.log(error)
        toast.error(error.message)
      })
  }

  const loginForm = () => {
    return(
      <form onSubmit={handleSubmit}>
      <div className ="form-group">
        <input 
          type='email' 
          className='form-control' 
          value={email} 
          onChange={e=>setEmail(e.target.value)}
          placeholder="Insert your email here!"
          autoFocus
        />
      </div>
      <div className ="form-group">
       <input 
        type='password' 
        className='form-control' 
        value={password} 
        onChange={e=>setPassword(e.target.value)}
        placeholder="Insert your password here!"
        autoFocus
      />
      </div>
      <br/>
      <Button 
        onClick={handleSubmit}
        type='primary'
        className="mb-3"
        block
        shape='round'
        icon={<MailOutlined/>}
        size='large'
        disabled={!email || password.length < 6}
      >
        Login with Email
      </Button>
    </form>
    )
    
  }

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          { !loading ?  <h4 style={{alignItems:'center'}}>Login</h4> : <h4 className="text-danger">Loading...</h4>}
          {loginForm()}

          <Button 
            onClick={googleSubmit}
            type='danger'
            className="mb-3"
            block
            shape='round'
            icon={<GoogleOutlined/>}
            size='large'
          >
            Login with Google
          </Button>

          <Link to="/forgot/password" style ={{float:'right'}} className ="text-danger">
            Forgot Password
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
