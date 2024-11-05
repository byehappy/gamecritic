import { createSlice } from "@reduxjs/toolkit";

type UserState  = {
    id?: string;
    username?:string;
    loading:boolean;
}

const initialState:UserState = {
    id: "ec39e51d-5acc-4382-b12b-9f0c091f6cfd",
    username:"Tarnished",
    loading:true
}

export const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        switchLoading: (state) =>{
            state.loading = !state.loading
        },
        setId: (state,action)=>{
            state.id = action.payload
        },
        setUsername: (state,action)=>{
            state.username = action.payload
        },
        resetAuthState: (state) => {
            state.username = undefined;
            state.id = undefined;
            state.loading = false;
        }
    }
})

export const {setId,setUsername,resetAuthState,switchLoading} = userSlice.actions
export default userSlice.reducer
