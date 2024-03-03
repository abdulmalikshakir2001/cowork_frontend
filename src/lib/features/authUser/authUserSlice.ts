import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store'
import { features } from 'process';
import { extend } from 'jquery';


// Define a type for the slice state

interface IChats {
  message?:string|null;
  last_message_date?:string|null;
}
export interface IUserState extends IChats {
  
  id?:number|null
   name:string|null;
   email:string|null;
   role:string|null;
   online_status:string|number|null;
   
   
   
}
export interface IinitialState {
    user:IUserState
}

// Define the initial state using that type
const initialState:IinitialState = {
    user:{
      id:null,
    name:null,
  email:null,
   role:null,
   online_status:0
    }
}
export const authUserSlice = createSlice({
  name: 'authUser',
  initialState,
  reducers: {
    setAuthUser: (state,action) => {
        state.user = action.payload
    },
    
  }
})

export const { setAuthUser} = authUserSlice.actions
// Other code such as selectors can use the imported `RootState` type
export const selectAuthUser = (state: RootState) => state.authUser.user
export default authUserSlice.reducer