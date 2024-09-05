import React, { useState, useEffect } from 'react'
import { BsChatLeftDots } from "react-icons/bs";
import { HiMiniUserPlus } from "react-icons/hi2";
import { NavLink, useNavigate } from 'react-router-dom'
import { IoLogOutOutline } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";
import { useDispatch, useSelector } from 'react-redux';
import Updateuser from './Updateuser';
import Search from './Search';
import { IoMdVideocam } from "react-icons/io";
import { FaRegImage } from "react-icons/fa6";
import { emptydata } from '../redux/Slice';



const Sidebar = () => {
    const user = useSelector(state => state?.user);
    const [edituser, setedituser] = useState(false);
    const [muser, setmuser] = useState([]);
    const [searchuser, setserachuser] = useState(false);
    const socketconnection = useSelector(state => state?.user?.socketconnection);

    

    // console.log(user._id);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (socketconnection) {
            socketconnection.emit('sidebar', user._id)
            socketconnection.on('conversation', (data) => {
                // console.log('conversations', data);
                const conversationuserdata = data.map((convuser, index) => {
                    if (convuser?.sender?._id === convuser?.receiver?._id) {
                        return {
                            ...convuser,
                            userDetails: convuser.sender
                        }
                    }
                    else if (convuser?.receiver?._id !== user?._id) {
                        return {
                            ...convuser,
                            userDetails: convuser.receiver
                        }
                    } else {
                        return {
                            ...convuser,
                            userDetails: convuser.sender
                        }
                    }
                })
                setmuser(conversationuserdata)
            })
         
        }   
    }, [socketconnection, user]);
    const handlelogout = ()=>{
        dispatch(emptydata())
        navigate('/login');
        localStorage.clear();
    }


    return (
        <div className='w-full h-full grid grid-cols-[40px,1fr]'>
            <div className='bg-slate-300 w-10 h-full rounded-t py-5 flex flex-col justify-between'>
                <div>
                    <NavLink className={({ isActive }) => `h-10 w-10 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded my-2 ${isActive && "bg-slate-200"}`} title='chat'>
                        <BsChatLeftDots size={25} />
                    </NavLink>
                    <div className='h-10 w-10 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded' title='Add Friend' onClick={() => setserachuser(true)}>
                        <HiMiniUserPlus size={25} />
                    </div>
                    {/* creating group */}

                 
                </div>
                <div>
                    <div className='flex justify-center items-center my-2'>

                        <button className='mx-auto' title={user.name} onClick={() => { setedituser(true) }}>
                            <RxAvatar size={25} />
                            <span className='text-sm text-black'>{user.name}</span>
                        </button>
                    </div>
                    <button className='h-10 w-10 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded' title='Logout' onClick={handlelogout}>
                        <IoLogOutOutline size={25} />
                    </button>
                </div>
            </div>

            <div className='w-full'>
                <div className='flex h-16 justify-center items-center'>
                    <h2 className='text-2xl font-bold p-4 text-slate-500 '> Message</h2>
                </div>
                <div className='p-[0.5px] bg-slate-200 '></div>
                <div className='h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar'>
                    {
                        muser.length === 0 && (
                            <div>
                                <p className=' mt-4 text-lg text-center text-slate-600'>Add user to Chat</p>
                                <div className='mt-4 text-lg text-center text-slate-600'>
                                    Click on Add icon to Search user to Chat with
                                </div>

                            </div>
                        )
                    }
                    {
                        muser.map((w, index) => {
                            return (
                                
                                <NavLink to={'/'+w?.userDetails?._id} key={w?._id} className='flex items-center gap-2 p-3 border rounded border-transparent hover:border-gray-500 hover:bg-slate-100 cursor-pointer'>
                                    {/* <div>Chat in Group</div> */}
                                    <div className='mx-2 '>
                                        <RxAvatar size={35}/>
                                    </div>
                                    <div>
                                    <h3 className='text-ellipsis line-clamp-1 font-semibold'>{w.userDetails.name}</h3>
                                    <div className='text-slate-500 text-sm flex items-center gap-2'>
                                        <div className='flex gap-2 items-center'>
                                            {
                                                w?.lastmsg?.imageurl && (
                                                  <div className='flex gap-2 items-center'>
                                                      <span><FaRegImage/></span>
                                                      {!w?.lastmsg?.text && <span>Image</span>} 
                                                  </div>
                                                )
                                            }
                                               {
                                                w?.lastmsg?.videourl && (
                                                  <div className='flex gap-2 items-center'>
                                                      <span><IoMdVideocam/></span>
                                                      {!w?.lastmsg?.text && <span>Video</span>} 
                                                  </div>
                                                )
                                            }
                                        </div>
                                        <p className='text-ellipsis line-clamp-1'>{w?.lastmsg?.text}</p>
                                       
                                    </div>
                                  
                                    </div>
                                    {
                                       Boolean(w?.unseenmsg) && (
                                            <p className='text-xs w-5 h-5 ml-auto p-1 bg-red-400 text-white rounded-full font-semibold flex items-center justify-center'>{w?.unseenmsg}</p>
                                        )
                                    }
                                 
                                </NavLink>
                            )
                        })
                    }
                </div>
            </div>
            {
                edituser && (
                    <Updateuser onclose={() => setedituser(false)} user={user} />
                )
            }
            {
                searchuser && (
                    <Search onclose={() => setserachuser(false)} />
                )
            }
          
        </div>
    )
}

export default Sidebar
