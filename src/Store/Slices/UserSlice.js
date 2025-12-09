import { createSlice } from '@reduxjs/toolkit'
import { AES, enc } from 'crypto-js'

const initialState = {
    data: null
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addUserData: (state, action) => {
            var bytes = AES.decrypt(action.payload,import.meta.env.VITE_APP_ENCRYPTION);
            const decrypted = JSON.parse(bytes.toString(enc.Utf8));
            // console.log("d",decrypted);
            state.data = decrypted;
        },
        removeUserData: (state) => {
            state.data = null
        },
    },
    preloadedState: initialState,

})


export const { addUserData, removeUserData, verifyUser } = userSlice.actions

export default userSlice.reducer

//HYUJIWDSERBVDHIUWDDELOJI - testapi
// GYHSWQPLOBGTZDRLOPQWEVSU - main