import React,{useState,useEffect} from 'react'
import {auth} from '../../component/firebase'
import { useDispatch } from 'react-redux'
import {toast} from 'react-toastify'
import { createOrUpdateUser } from '../../functions/auth'


const RegisterComplete = ({history}) => {
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')

 
  let dispatch  = useDispatch()
 

  // props.history <=> {history}
  useEffect(()=>{
    setEmail(window.localStorage.getItem('emailForRegistration'));
    // console.log(window.location.href);
    // console.log(window.localStorage.getItem('emailForRegistration'));
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if(!email || !password) {
      toast.error('Email and password are required!')
      return // To not execute code below
    }

    if(password.length < 6) {
      toast.error('Password must be at least 6 characters long!')
      return // To not execute code below
    }

    try {
      const result = await auth.signInWithEmailLink(email,window.location.href)
      console.log(result);
      if(result.user.emailVerified) {
        // remove user email from local storage
        window.localStorage.removeItem('emailForRegistration')

        // get user id token
        let user = auth.currentUser
        await user.updatePassword(password)
        const idTokenResult = await user.getIdTokenResult()

        // redux store 
        console.log('user',user,'idTokenResult',idTokenResult);
        
        createOrUpdateUser(idTokenResult.token)
        .then(res => {
          console.log(res);
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
        .catch(err=>console.log(err))
        
        // redirect
        history.push('/')
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const completeForm = () => {
    return(
      <form onSubmit={handleSubmit}>
      <input 
        type='email' 
        className='form-control' 
        value={email} 
        autoFocus
        disabled
      />
      <input 
        type='password' 
        className='form-control' 
        value={password} 
        autoFocus
        onChange={e=>setPassword(e.target.value)}
        placeholder='Insert your password here!'
      />
      <button type="submit" className="btn btn-raised">
        Complete Registration
      </button>
    </form>
    )
    
  }

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Complete Registration</h4>
          {completeForm()}
        </div>
      </div>
    </div>
  )
}

export default RegisterComplete
