import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';


import "../../styles/AuthStyles.css";
import { useAuth } from '../../context/auth';

const Login = () => {

    const [email,setEmail]= useState("");
    const [password,setPassword]= useState("");
    const [auth,setAuth] = useAuth();
    const navigate = useNavigate()
    const location = useLocation()

    const handleSubmit = async(e) =>{
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/login`,{email,password})

            console.log("checking",res)
            
            if(res && res.data.success){
                toast.success(res.data && res.data.message);
                setTimeout(() => {
                    setAuth({
                        ...auth,
                        user:res.data.user,
                        token:res.data.token,
                    })
                    localStorage.setItem('auth',JSON.stringify(res.data))
                    navigate(location.state || '/');
                }); // Adjust the delay time as needed
            }else{
                toast.error(res.data.message)
            }
            
        } catch (error) {
          toast.error(error.response.data.message)
            
        }

    }

    

  return (
    <Layout title={'Login - Ecommerce App'}>
            <div className='form-container'>
                <h1>Login Page</h1>
                <form onSubmit={handleSubmit}>

                    <div className="mb-3">
                        
                        <input type="email"
                         className="form-control"
                          id="exampleInputEmail"
                          placeholder='example123@gmail.com'
                          value={email}
                          onChange={(e)=>setEmail(e.target.value)}
                          required
                          />
                    </div>

                    <div className="mb-3">
                        <input type="password" 
                        className="form-control" 
                        id="exampleInputPassword1" 
                        placeholder='Enter The Password'
                        
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        required
                        />
                        
                    </div>

                    < div className='mb-3'>
                        <button type="button" className="btn btn-primary" onClick={()=>{navigate('/forgot-password')}}>Forgot Password</button>

                    </div>

                    <button type="submit" className="btn btn-primary">Login</button>
                </form>

            </div>

        </Layout>
  )
}

export default Login
