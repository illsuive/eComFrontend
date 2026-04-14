import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    // isAuthenticated: false,
    user: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // actions
        setUser : (state, action)=> {
            // state.isAuthenticated = true;
            state.user = action.payload;
        }
    }
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;