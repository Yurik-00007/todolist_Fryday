import {Dispatch} from "redux";
import {authActions} from "features/auth/auth.reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerAppError} from "common/utils/handle-server-app-error";
import {handleServerNetworkError} from "common/utils/handle-server-network-error";
import {authAPI} from "features/auth/auth.api";


const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}

const slice = createSlice({
    name: 'app',
/*
    initialState: {
        status: 'idle' as RequestStatusType,
        error: null as null | string,
        isInitialized: false
    },
*/
    initialState,
    reducers: {
        setAppError: (state, action: PayloadAction<{ error: null | string }>) => {
            state.error = action.payload.error
        },
        setAppStatus:(state, action:PayloadAction<{status:RequestStatusType}>)=>{
            state.status=action.payload.status
        },
        setIsInitialized:(state, action:PayloadAction<{isInitialized:boolean}>)=>{
            state.isInitialized=action.payload.isInitialized
        }
    }
})

export const appReducer=slice.reducer
export const appActions=slice.actions



//thunk
export const initializeAppTC = () => async (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatus({status:'loading'}))
    try{
        const res= await authAPI.me()

        //debugger
        if (res.data.resultCode === 0) {
            dispatch(authActions.setIsLoggedIn({isLoggedIn: true}));
            dispatch(appActions.setAppStatus({status:'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch);
        }

    }
    catch(error)  {
        handleServerNetworkError((error as any), dispatch)
    }
    finally {
        //debugger
        dispatch(appActions.setIsInitialized({isInitialized:true}))
    }
}

//type
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type AppInitialStateType = typeof initialState
