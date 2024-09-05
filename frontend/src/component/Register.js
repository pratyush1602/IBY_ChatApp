import React, { useState } from 'react'
// import { IoClose } from "react-icons/io5";
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [data, setdata] = useState({
        name: "",
        email: "",
        password: "",
        cpassword: ""
    })
    let navigate = useNavigate();

    const handleonchange = (event) => {
        const { name, value } = event.target
        setdata((p) => {
            return {
                ...p,
                [name]: value
            }
        })
    }

    const handlesubmit = async (e) => {
        e.preventDefault();
        // console.log("data ", data);
        const { name, email, password, cpassword } = data;
        try {


            // const URL = "http://localhost:4000/api/auth/createuser"

            if (name.length < 3) {
                toast.error("Name must be at least 3 characters long");
                return;
            }

            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailPattern.test(email)) {
                toast.error("Enter a valid email address");
                return;
            }

            if (password.length < 5) {
                toast.error("Password must be at least 5 characters long");
                return;
            }

            if (password !== cpassword) {
                toast.error("Passwords do not match");
                return;
            }
            else {
                const response = await fetch("http://localhost:4000/api/auth/createuser", {
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, password }),
                });
                const json = await response.json();
                console.log(json);
                if (json.success) {
                 
                    toast.success("Registration successful!");
                    console.log("Success:", json);
                    setTimeout(() => {
                        navigate('/login');
                      }, 500);
                } else {
                    
                    toast.error(json.error || "Registration failed!");
                    console.log("Failed:", json);
                }
            }
        } catch (error) {
            console.error("Error:", error.message);
            toast.error(error.message || "Something went wrong. Please try again later.");
        }

    }

    return (
        <div className='mt-5 a'>
            <div className='bg-white w-full max-w-sm  rounded overflow-hidden p-4 mx-auto'>
                <h3 className='text-2xl text-center'>Welcome to Chat-app</h3>
                <form className='grid gap-2' onSubmit={handlesubmit}>

                    <div className='flex flex-col mt-3'>
                        <label htmlFor="name"> Name: </label>
                        <input className='bg-slate-100 px-2 py-2 mt-2 rounded' type="text" id='name' name='name' placeholder='Enter Your Name' onChange={handleonchange} required />
                    </div>
                    <div className='flex flex-col mt-2'>
                        <label htmlFor="email"> Email: </label>
                        <input className='bg-slate-100 px-2 py-2 mt-2 rounded' type="text" id='email' name='email' placeholder='Enter Your Email' value={data.email} onChange={handleonchange} required />
                    </div>
                    <div className='flex flex-col mt-2'>
                        <label htmlFor="password"> Password: </label>
                        <input className='bg-slate-100 px-2 py-2 mt-2 rounded' type="password" id='password' name='password' placeholder='Enter Your Password' value={data.password} onChange={handleonchange} required />
                    </div>
                    <div className='flex flex-col mt-2'>
                        <label htmlFor="password">Confirm Password: </label>
                        <input className='bg-slate-100 px-2 py-2 mt-2 rounded' type="password" id='cpassword' name='cpassword' placeholder='Confirm Your Password' value={data.cpassword} onChange={handleonchange} required />
                    </div>

                   

                    <button className='bg-slate-400 h-10 rounded mt-5 border hover:border-black'>
                        Register
                    </button>
                </form>

                <p className='mt-2 p-2 text-center'>Already have Accounnt?  <Link className='hover:text-blue-500' to={'/login'}>Login</Link></p>
            </div>
        </div>
    )
}

export default Register
