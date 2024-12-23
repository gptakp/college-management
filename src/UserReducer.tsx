import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null
    },
    reducers: {
        userLoaded: (state, action) => {
            console.log(action)
            state.user = { ...action.payload }
        },
        userError: (state, action) => {
            state.user = null
        }
    }
})

export const { userLoaded, userError } = userSlice.actions
export default userSlice.reducer
