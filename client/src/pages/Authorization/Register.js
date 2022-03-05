import React,{useEffect, useState} from 'react'
import {auth} from '../../component/firebase'

import {toast} from 'react-toastify'
import { useSelector } from 'react-redux'

const Register = ({history}) => {
  const [email,setEmail] = useState('')

  const {user}  = useSelector(state => ({...state}))

  useEffect(()=>{
    if(user && user.token) history.push('/')
  },[user,history])

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(process.env.REACT_APP_REGISTER_REDIRECT_URL);
    const config = {
      url:process.env.REACT_APP_REGISTER_REDIRECT_URL,
      handleCodeInApp: true,
    }

    await auth.sendSignInLinkToEmail(email,config)
    toast.success(`Email is sent to ${email}. Click the link to complete your registration!`)

    // Save user email in local storage
    window.localStorage.setItem('emailForRegistration',email)
    setEmail('')

  }

  const registerForm = () => {
    return(
      <form onSubmit={handleSubmit}>
      <input 
        type='email' 
        className='form-control' 
        value={email} 
        onChange={e=>setEmail(e.target.value)}
        placeholder="Insert your email here!"
        autoFocus
      />
      <br/>
      <button type="submit" className="btn btn-raised">
        Register
      </button>
    </form>
    )
    
  }

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Register</h4>
          {registerForm()}
        </div>
      </div>
    </div>
  )
}

export default Register
