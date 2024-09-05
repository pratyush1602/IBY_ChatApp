import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router'
import { RxAvatar } from "react-icons/rx";
import { HiDotsVertical } from "react-icons/hi";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import { FaRegImage } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import { IoMdVideocam } from "react-icons/io";
import uploadfile from '../helper/uploadfile';
import { IoClose } from "react-icons/io5";
import Loading from './Loading';
import { IoMdSend } from "react-icons/io";
import moment from 'moment';

const Messagepage = () => {
  const params = useParams();
  const currentmessage = useRef(null);
  // console.log('params', params.userId)

  const socketconnection = useSelector(state => state?.user?.socketconnection);
  const user = useSelector(state => state?.user);
  const [openimgvideo, setopenimgvideo] = useState(false);
  const [datauser, setdatauser] = useState({
    name: "",
    email: "",
    online: false,
    _id: ""
  })

  const [loading, setloading] = useState(false);
  const [Allmessage, setAllmessage] = useState([]);

  const [message, setmessage] = useState({
    text: "",
    imageurl: "",
    videourl: ""
  })

  useEffect(() => {
    if (currentmessage.current) {
      currentmessage.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [Allmessage])

  useEffect(() => {
    if (socketconnection) {
      // chanfe page is added
      socketconnection.emit('message page', params.userId);

      socketconnection.emit('seen',params.userId)

      socketconnection.on('message-user', (data) => {
        setdatauser(data);
      })
      socketconnection.on('message', (data) => {
        console.log('messager -data', data);
        setAllmessage(data);
      })
    }
  }, [socketconnection, params?.userId, user])



  const handleplus = () => {
    setopenimgvideo(preve => !preve);
  }

  const handleimage = async (e) => {
    const file = e.target.files[0];
    setloading(true)
    const uploadphoto = await uploadfile(file);
    setloading(false);
    setopenimgvideo(false)
    console.log("uploadphoto", uploadphoto.url);
    setmessage(preve => {
      return {
        ...preve,
        imageurl: uploadphoto.url
      }
    })
  }

  const handleclearimage = () => {
    setmessage(preve => {
      return {
        ...preve,
        imageurl: ""
      }
    })
  }
  // console.log("url ",uploadphoto.url);
  const handlevideo = async (e) => {
    const file = e.target.files[0];
    setloading(true)
    const uploadvideo = await uploadfile(file);
    setloading(false)
    setopenimgvideo(false)
    console.log("uploadvideo", uploadvideo);
    setmessage(preve => {
      return {
        ...preve,
        videourl: uploadvideo.url
      }
    })
  }

  const handleclearvideo = () => {
    setmessage(preve => {
      return {
        ...preve,
        videourl: ""
      }
    })
  }

  const handleonchange = (e) => {
    const { name, value } = e.target
    setmessage(preve => {
      return {
        ...preve,
        text: value
      }
    })
  }
  const handlemesssubmit = (e) => {
    e.preventDefault();
    if (message.text || message.imageurl || message.videourl) {
      if (socketconnection) {
        socketconnection.emit('new message', {
          sender: user?._id,
          receiver: params.userId,
          text: message.text,
          imageurl: message.imageurl,
          videourl: message.videourl,
          msgbyuserid: user?._id
        })
        setmessage(
          {
            text: "",
            imageurl: "",
            videourl: ""
          }
        )
      }
    }
  }
  return (
    <div>
      <header className='sticky top-0 h-16 bg-white flex justify-between items-center px-4'>
        <div className='flex items-center gap-5 p-2 '>
          <Link to={'/'} className='hover:text-gray-500 lg:hidden'>
            <IoMdArrowRoundBack size={25} />
          </Link>
          <div>
            <RxAvatar size={50} name={datauser?.name} userId={datauser?._id} />
          </div>
          <div>
            <h3 className='font-semibold text-lg my-0 text-ellipsis line-clamp-1 '>{datauser.name}</h3>
            <p>
              {
                datauser.online ? <span className='text-green-500'>online</span> : <span className='text-gray-500'> offline</span>
              }
            </p>
          </div>
        </div>
        <div>
          <button className='cursor-pointer hover:text-gray-400'>
            <HiDotsVertical />
          </button>
        </div>
      </header>

      <section className='h-[calc(100vh-128px)]  overflow-x-hidden overflow-y-scroll scrollbar relative'>

        {/* showing all message */}

        <div className='flex flex-col gap-2 py-2 mx-1' ref={currentmessage}>
          {
            Allmessage.map((msg, index) => {
              return (
                <div className={` p-1 py-1 max-w-[250px] md:max-w-sm lg:max-w-md rounded w-fit ${user._id === msg.msgbyuserid ? 'ml-auto bg-teal-200' : "bg-teal-100"}`}>
                  <div className='w-full'>
                    {
                      msg?.imageurl && (
                        <img src={msg?.imageurl} className='w-full h-full object-scale-down' />
                      )
                    }
                    {
                      msg?.videourl && (
                       <video src={msg.videourl} className='w-full h-full object-scale-down' controls/>
                  
                      )
                    }
                  </div>
                  <p className='px-2'>
                    {msg.text}
                  </p>
                  <p className='text-xs ml-auto w-fit'>{moment(msg.createdAt).format('hh:mm')}</p>
                </div>
              )
            })
          }
        </div>


        {
          message.imageurl && (
            <div className='w-full sticky bottom-0 h-full bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
              <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-gray-200' onClick={handleclearimage}>
                <IoClose size={30} />
              </div>
              <div className='bg-white p-3'>
                <img src={message.imageurl} alt="upload image" className='aspect-square w-full h-full max-w-sm m-2 object-scale-down' />
              </div>
            </div>
          )
        }
        {
          message.videourl && (
            <div className='w-full sticky bottom-0 h-full bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
              <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-gray-200' onClick={handleclearvideo}>
                <IoClose size={30} />
              </div>
              <div className='bg-white p-3'>
                <video src={message.videourl} className='aspect-square w-full h-full max-w-sm m-2  object-scale-down' controls muted autoPlay></video>
              </div>
            </div>
          )
        }

        {
          loading && (
            <div className='w-full sticky bottom-0 h-full flex justify-center items-center'>
              <Loading />
            </div>
          )
        }
      </section>

      <section className='h-16 bg-white flex items-center'>

        <div className='relative' >
          <button onClick={handleplus} className='hover:text-gray-400 mx-5 '>
            <IoMdAdd size={30} />
          </button>
          {
            openimgvideo && (
              <div className='bg-white shadow rounded absolute bottom-12 w-36 p-2 mx-1'>
                <form>
                  <label htmlFor='uploadimage' className='flex items-center p-2 gap-3 hover:bg-slate-300 cursor-pointer'>
                    <div className='text-cyan-500 '>
                      <FaRegImage size={20} />
                    </div>
                    <p>Image</p>
                  </label>
                  <label htmlFor='uploadvideo' className='flex items-center p-2 gap-3 hover:bg-slate-300 cursor-pointer'>
                    <div className='text-purple-500' >
                      <IoMdVideocam size={20} />
                    </div>
                    <p>Video</p>
                  </label>

                  <input type="file" id='uploadimage' onChange={handleimage} className='hidden' />
                  <input type="file" id='uploadvideo' onChange={handlevideo} className='hidden' />
                </form>
              </div>
            )
          }

        </div>

        <form className='h-full w-full flex ' onSubmit={handlemesssubmit}>
          <input type="text" placeholder='Type Here ' className=' px-4 outline-none w-full h-full' value={message.text} onChange={handleonchange} />
          <button className='text-green-600 hover:text-green-300 mx-4'>
            <IoMdSend size={30} />
          </button>
        </form>
      </section>
    </div>
  )
}

export default Messagepage
