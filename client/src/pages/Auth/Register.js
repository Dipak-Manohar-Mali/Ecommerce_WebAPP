import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import "../../styles/AuthStyles.css";


const Register = () =>{

    const [name,setName]= useState("");
    const [email,setEmail]= useState("");
    const [password,setPassword]= useState("");
    const [phone,setPhone]= useState("");
    const [address,setAddress]= useState("");
    const navigate = useNavigate()

    const [question,setQuestion] = useState();


    //form function

    const handleSubmit = async(e) =>{
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/register`,{name,email,password,phone,address,question})

            console.log("Checking Response",res)
            if(res.data.success){
                toast.success(res.data.message);
            // Delay navigation to ensure toast message is displayed
                setTimeout(() => {
                    navigate('/login');
                }); // Adjust the delay time as needed
            }else{
                toast.error("Something is Wrong")
            }
            
        } catch (error) {
            console.log(error)
            
        }

    }
    return (
        <Layout title={'Register -Ecommerce App'}>
            <div className='form-container'>
                <h1>Register Page</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input type="text" 
                        className="form-control" 
                        id="exampleInputName"
                        placeholder='Enter Your Name'
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                        required
                        />
                    </div>

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

                    <div className="mb-3">
                        <input type="text" 
                        className="form-control" 
                        id="exampleInputPhone"
                        placeholder='Enter Your Contact No.'
                        value={phone}
                        onChange={(e)=>setPhone(e.target.value)}
                        required
                        />
                    </div>

                    <div className="mb-3">
                        
                        <input type="text"
                         className="form-control" 
                         id="exampleInputName"
                         placeholder='Enter Your Address'
                         value={address}
                         onChange={(e)=>setAddress(e.target.value)}
                         required
                         />
                         
                    </div>


                    <div className="mb-3">
                        
                        <input type="text"
                         className="form-control" 
                         id="exampleInputName"
                         placeholder='What is Your Favorite Sport'
                         value={question}
                         onChange={(e)=>setQuestion(e.target.value)}
                         required
                         />
                         
                    </div>
                    

                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>

            </div>

        </Layout>
    )
}

export default Register;