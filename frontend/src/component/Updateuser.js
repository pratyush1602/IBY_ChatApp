// import React, { useEffect, useState } from 'react'
// import toast from 'react-hot-toast'
// import { useDispatch } from 'react-redux'
// import { setuser } from '../redux/Slice'

// const Updateuser = ({ onclose, user }) => {
//     const [data, setdata] = useState({ name: user?.user })
//     // console.log("edit user ",user);
//     const dispatch = useDispatch();
//     useEffect(() => {
//         setdata((preve) => {
//             return {
//                 ...preve,
//                 ...user
//             }
//         })
//     }, [user])

//     const handlesubmit = async (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         try {

    
//                 const response = await fetch("http://localhost:4000/api/auth/updateuser", {
//                     method: "PUT",
//                     headers: {
//                         'content-type': 'application/json',
//                         'auth-token': localStorage.getItem('token')
//                     },
//                     body: JSON.stringify({ name: data.name }),
//                 })
            
//             const json = await response.json();
//             if(response.ok){
//                 toast.success("Updated successfully!");
//                 console.log(json);
//                 dispatch(setuser(json));
//                 onclose();
//             }
//             else {
//                 toast.error(json.error || "Update failed!");
//             }
//         }catch (error) {
//             toast.error("An error occurred!");
//             console.error("An error occurred while updating the user:", error);
//         }
//     }
//     const handleonchange = (e) => {
//         const { name, value } = e.target
//         setdata((preve) => {
//             return {
//                 ...preve,
//                 [name]: value
//             }
//         })
//     }
//     return (
//         <div className='fixed top-0 bottom-0 right-0 left-0 bg-gray-700 bg-opacity-40 flex justify-center items-center'>
//             <div className='bg-white p-4 m-1 rounded w-full max-w-sm'>
//                 <h2 className='font-bold'>Profile</h2>
//                 <p className='text-sm '>Edit user Details</p>
//                 <form className='grid gap-3 mt-3' onSubmit={handlesubmit}>
//                     <div className='flex flex-col gap-2'>
//                         <label htmlFor="name">
//                             Name
//                         </label>
//                         <input type="text" name='name' id='name' value={data.name} onChange={handleonchange} className='py-1 mx-2 w-full border rounded hover:border-black ' />
//                     </div>
//                     <div className='p-[0.5px] bg-slate-400 my-3'  ></div>
//                     <div className='flex gap-2 w-fit ml-auto '>
//                         <button onClick={onclose} className='border px-4 rounded py-1 hover:bg-slate-300 text-black'>cancel</button>
//                         <button onClick={handlesubmit} className='border px-4 rounded py-1 hover:bg-slate-300 text-black'>save</button>
//                     </div>
//                 </form>

//             </div>
//         </div>
//     )
// }

// export default React.memo(Updateuser)
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setuser } from '../redux/Slice';
// import { useNavigate } from 'react-router';

const Updateuser = ({ onclose, user }) => {
    const [data, setdata] = useState({name: user?.user});
    const dispatch = useDispatch();
    // const navigate = useNavigate();
    // Update local state when `user` prop changes

    useEffect(() => {
        setdata((preve)=>{
            return{
                ...preve,
                ...user
            }
        })
    }, [user])

    
    const handleonchange = (e) => {
        const { name, value } = e.target;
        setdata((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlesubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const response = await fetch("http://localhost:4000/api/auth/updateuser", {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'),
                },
                body: JSON.stringify({ name: data.name }),
            });

            const json = await response.json();
            if (response.ok) {
                toast.success("Updated successfully!");
                dispatch(setuser(json));
                console.log("response edit",json);
                onclose();
            } else {
                toast.error(json.error || "Update failed!");
            }
        } catch (error) {
            toast.error("An error occurred!");
            console.error("An error occurred while updating the user:", error);
        }
    };

    return (
        <div className='fixed top-0 bottom-0 right-0 left-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10'>
            <div className='bg-white p-4 m-1 rounded w-full max-w-sm'>
                <h2 className='font-bold'>Profile</h2>
                <p className='text-sm'>Edit user Details</p>
                <form className='grid gap-3 mt-3' onSubmit={handlesubmit}>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            name='name'
                            id='name'
                            value={data.name}
                            onChange={handleonchange}
                            className='py-1 mx-2 w-full border rounded hover:border-black'
                        />
                    </div>
                    <div className='p-[0.5px] bg-slate-400 my-3'></div>
                    <div className='flex gap-2 w-fit ml-auto'>
                        <button
                            type="button"
                            onClick={onclose}
                            className='border px-4 rounded py-1 hover:bg-slate-300 text-black'
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className='border px-4 rounded py-1 hover:bg-slate-300 text-black'
                        onClick={handlesubmit}>
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Updateuser;
