import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import {  useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';


import "../../styles/AuthStyles.css";

const ForgotPassword = () => {


    const [email,setEmail]= useState("");
    const [newPassword,setNewPassword]= useState("");
    const [question,setQuestion]= useState("");
    const navigate = useNavigate()
   

    const handleSubmit = async(e) =>{
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/forgot-password`,{email,newPassword,question})

            console.log("checking",res.data)
            
            if(res && res.data.success){
                toast.success(res.data && res.data.message);
                setTimeout(() => {
                   
                    
                    navigate('/login');
                }); // Adjust the delay time as needed
            }else{
                toast.error(res.data.message)
            }
            
        } catch (error) {
          toast.error(error.response.data.message)
            
        }

    }


  return (
    <Layout title={"Forgot Password - Ecommerce App"}>
        <div className='form-container'>
                <h1>RESET PASSWORD</h1>
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
                        
                        <input type="text"
                         className="form-control"
                          id="exampleInputEmail"
                          placeholder='Enter your Favorite Sport'
                          value={question}
                          onChange={(e)=>setQuestion(e.target.value)}
                          required
                          />
                    </div>

                    <div className="mb-3">
                        <input type="password" 
                        className="form-control" 
                        id="exampleInputPassword1" 
                        placeholder='Enter The Password'
                        
                        value={newPassword}
                        onChange={(e)=>setNewPassword(e.target.value)}
                        required
                        />
                        
                    </div>

                    <button type="submit" className="btn btn-primary">RESET</button>
                </form>

            </div>
    </Layout>
  )
}

export default ForgotPassword
