import React, { useEffect, useState } from 'react'
import { IoSearchSharp } from "react-icons/io5";
import Loading from './Loading';
import Card from './Card';
import toast from 'react-hot-toast';
import axios from 'axios';
import { IoClose } from "react-icons/io5";
import { useSelector } from 'react-redux';


const Search = ({onclose}) => {
   
    const [usersearched, setusersearched] = useState([]);
    const [loading, setloading] = useState(false);
    const [search, setsearch] = useState("");
    const handleserach = async ()=>{
        try {
            setloading(true)
            const response = await axios.post("http://localhost:4000/api/auth/search-user",{
                search:search
            })
            setloading(false)
            console.log("user searched",response.data.data);
            setusersearched(response.data.data)
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
       
    }

    useEffect(()=>{
        handleserach();
    },[search])
    console.log("serach user",usersearched)
  
    return (
        <div className='fixed bottom-0 top-0 left-0 right-0 bg-slate-800 bg-opacity-60 p-2 z-10'>
            <div className='w-full max-w-lg mx-auto mt-10 '>
                <div className='bg-white rounded h-14 overflow-hidden flex'>
                    <input className='w-full outline-none py-1 h-full px-4' type="text" name="" id="" placeholder='Serach user by name..' onChange={(e)=>{setsearch(e.target.value)}} value={search}/>
                    <div className='h-14 w-14 justify-center items-center flex'>
                        <IoSearchSharp size={25} />

                    </div>
                </div>

                <div className='bg-white mt-2 w-full p-4 rounded max-h-[600px] overflow-y-auto'>
                    {
                        usersearched.length === 0 && !loading && (
                            <p className='text-center text-slate-500'>
                                 No user found
                            </p>
                        )
                    }
                    {
                        loading &&(
                            <p> <Loading/></p>
                        )
                    }
                    {
                        usersearched.length !== 0 && !loading &&(
                            usersearched.map((user,index)=>{
                                return(
                                    <Card key={user._id} user={user} onclose={onclose}/>
                                )
                            })
                        )
                    }
                </div>
            </div>

            <div >
                <button className='top-0 right-0 absolute text-2xl p-2 lg:text-4xl hover:text-gray-300' onClick={onclose} >           
                     <IoClose size={35} />
                </button>

            </div>
        </div>
    )
}

export default Search


