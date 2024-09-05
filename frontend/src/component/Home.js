import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router';
import { setonlineuser, setsocketconnection, setuser } from '../redux/Slice';
import Sidebar from './Sidebar';
import io from 'socket.io-client'

const Home = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector(state => state.user)
  console.log("redux ", user);
  console.log('user',user);
  const fetchuserData = async () => {
    try {
      if (localStorage.getItem('token')) {
        const response = await fetch("http://localhost:4000/api/auth/getuserdetails", {
          method: "GET",
          headers: {
            'content-type': 'application/json',
            'auth-token': localStorage.getItem('token')
          }
        })

        const json = await response.json();
        dispatch(setuser(json))
        console.log(json);
      }
    
    } catch (error) {
    console.log("error", error);
  }
}

useEffect(() => {
  fetchuserData();
}, [])

useEffect(()=>{
  const socketconnection = io("http://localhost:4000",{
    auth:{
      token : localStorage.getItem('token')
    }
  })
    socketconnection.on('onlineuser',(data)=>{
      console.log(data);
      dispatch(setonlineuser(data));
    })

    dispatch(setsocketconnection(socketconnection));
  return ()=>{
    socketconnection.disconnect()
  }
},[])

const basepath = location.pathname === '/'
return (
  <div className='  grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
    <section className={`bg-white ${!basepath  && "hidden"} lg:block`}>
      <Sidebar />
    </section>
    <section className={`${basepath && "hidden"}`}>
      <Outlet />
    </section>

    <div className={` justify-center items-center flex-col gap-2 hidden ${!basepath ? "hidden" : "lg:flex"}`}>
      <div>
          <h2 className='text-4xl'>Chat-App</h2>
          <p>Use the Chat-App to chat with your friends.</p>
          
      </div>
    </div>
  </div>
)
}

export default Home
