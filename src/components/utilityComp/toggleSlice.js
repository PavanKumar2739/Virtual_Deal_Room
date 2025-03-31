import {createSlice}  from "@reduxjs/toolkit"

const initialState ={
    type : "Buyer",
}

const toggleSlice = createSlice({
    name:'page',
    initialState,
    reducers:{
        setType:(state,action)=>{
            state.showChat = action.payload;
        }

    }
});

export const {setType} = toggleSlice.actions;

export default toggleSlice.reducer;

