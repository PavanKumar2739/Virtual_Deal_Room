import {createSlice}  from "@reduxjs/toolkit"

const initialState ={
    showChat : false,
    product : null,
    onlineUsers:[],
}

const pageSlice = createSlice({
    name:'page',
    initialState,
    reducers:{
        setShowChat:(state,action)=>{
            state.showChat = action.payload;
        },
        setProductData:(state,action)=>{
            state.product = action.payload;
        },
        setOnlineUsers:(state,action)=>{
            state.onlineUsers = action.payload;
        }

    }
});

export const {setShowChat,setProductData,setOnlineUsers} = pageSlice.actions;

export default pageSlice.reducer;

