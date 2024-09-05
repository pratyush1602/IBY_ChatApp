import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  _id: "",
  name:"",
  email:"",
  token:"",
  onlineuser: [],
  socketconnection : null 
}

export const Slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setuser : (state,action)=>{
        state._id = action.payload._id
        state.name = action.payload.name
        state.email = action.payload.email
    },
    settoken: (state,action)=>{
        state.token = action.payload.token
    },
    emptydata : (state,action)=>{
        state._id = ""
        state.name =""
        state.email = ""
        state.token = ""
        state.socketconnection = null
    },
    setonlineuser :(state,action)=>{
      state.onlineuser = action.payload
    },
    setsocketconnection :(state,action)=>{
      state.socketconnection = action.payload
     }
  },
})

export const { setuser,settoken,emptydata,setonlineuser,setsocketconnection} = Slice.actions

export default Slice.reducer