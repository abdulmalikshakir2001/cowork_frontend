import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store'
import { features } from 'process';


// Define a type for the slice state
export interface IUserState {
  
  
   name:string|null;
   email:string|null;
   role:string|null;
   online_status:string|number|null
   
   
   
}
export interface IinitialState {
    user:IUserState
}

// Define the initial state using that type
const initialState:IinitialState = {
    user:{
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