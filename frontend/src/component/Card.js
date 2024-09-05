import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Card = ({ user , onclose }) => {
    const onlineuser = useSelector(state => state?.user?.onlineuser);
    const isonline = onlineuser.includes(user._id);
    return (
        <Link to={'/'+user._id} onClick={onclose} className=' flex justify-between items-center cursor-pointer p-2 lg:p-4 border border-transparent border-b-slate-200 hover:border-black rounded'>
            
            <div className='relative'>
                {/* Green marker for online users */}
                {/* {isonline && <span className='absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full'></span>} */}
                <div className='font-semibold text-ellipsis line-clamp-1'>
                    {user?.name}
                </div>
                <p className='text-ellipsis line-clamp-1'>{user?.email}</p>
            </div>
            {isonline && <span className='w-3 h-3  bg-green-600 rounded-full ml-20'></span>}
        </Link>
    )
}

export default Card
