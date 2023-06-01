import {Dispatch} from "redux";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {appActions} from "app/app.reducer";
import {handleServerAppError} from "common/utils";
import { handleServerNetworkError} from "common/utils/handle-server-network-error";
import {clearTasksAndTodolists} from "common/actions/common.actions";
import {authAPI, LoginDataType} from "features/auth/auth.api";



const slice = createSlice({
    name: 'auth',
    initialState:{
        isLoggedIn: false,
    },
    reducers: {
        setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    }
})

export const authReducer=slice.reducer
export const authActions=slice.actions



//thunks
export const loginTC = (data: LoginDataType) => (dispatch:Dispatch) => {
    dispatch(appActions.setAppStatus({status:'loading'}))
    authAPI.login(data)
        .then((res) => {
            //debugger
            if (res.data.resultCode === 0) {
                dispatch(authActions.setIsLoggedIn({isLoggedIn: true}))
                dispatch(appActions.setAppStatus({status:'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })

}

export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatus({status:'loading'}))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(authActions.setIsLoggedIn({isLoggedIn:false}))
                dispatch(clearTasksAndTodolists())
                dispatch(appActions.setAppStatus({status:'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
