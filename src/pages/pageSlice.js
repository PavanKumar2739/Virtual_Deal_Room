import {createSlice}  from "@reduxjs/toolkit"

const initialState ={
    showChat : false,
    product : null,
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
        }

    }
});

export const {setShowChat,setProductData} = pageSlice.actions;

export default pageSlice.reducer;

