import {Dispatch} from 'redux'
import {appActions, RequestStatusType} from 'app/app.reducer'
import {createSlice, current, PayloadAction,} from "@reduxjs/toolkit";
import {clearTasksAndTodolists} from "common/actions/common.actions";
import {todolistsAPI, TodolistType, UpdateTodolistTitleArgType} from "features/TodolistsList/todolists.api";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "common/utils";
import {ResultCode} from "common/enums";
import {tasksThunks} from "features/TodolistsList/tasks.reducer";

const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }, void>
('todolists/fetchTodolists', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        const res = await todolistsAPI.getTodolists()
        //dispatch(todolistsActions.setTodolists({todolists: res.data}))
        const todolists = res.data as TodolistType[]
        dispatch(appActions.setAppStatus({status: 'succeeded'}))
        todolists.forEach(tl => {
            //console.log('inside fetchTasks')
            dispatch(tasksThunks.fetchTasks(tl.id))
        })
        return {todolists: res.data}
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

/*export const fetchTodolistsTC = () => {
    return (dispatch: any) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        todolistsAPI.getTodolists()
            .then((res) => {
                //debugger
                dispatch(todolistsActions.setTodolists({todolists: res.data}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
                return res.data
            })
            .then((todolists => {
                todolists.forEach((tl) => {
                    //debugger
                    dispatch(tasksThunks.fetchTasks(tl.id))
                })
            }))
    }
}*/

const removeTodolist = createAppAsyncThunk<{ todolistId: string }, string>('todolists/removeTodolist',
    async (todolistId, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(appActions.setAppStatus({status: 'loading'}))
            //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
            dispatch(todolistsActions.changeTodolistEntityStatus({todolistId, entityStatus: 'loading'}))
            const res = await todolistsAPI.deleteTodolist(todolistId)
            //скажем глобально приложению, что асинхронная операция завершена
            if (res.data.resultCode === ResultCode.Seccess) {
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
                //dispatch(todolistsActions.removeTodolist({todolistId}))
                return {todolistId}
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null)
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    })

const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, { title: string }>
('todolists/addTodolist', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        const res = await todolistsAPI.createTodolist(arg.title)
        if (res.data.resultCode === ResultCode.Seccess) {
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            //dispatch(todolistsActions.addTodolist({todolist: res.data.data.item}))
            return {todolist: res.data.data.item}
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

const changeTodolistTitle = createAppAsyncThunk<UpdateTodolistTitleArgType,UpdateTodolistTitleArgType>
('todolist/changeTodolist', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        const res=await todolistsAPI.updateTodolist(arg.todolistId, arg.title)
        if (res.data.resultCode === ResultCode.Seccess) {
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            //dispatch(todolistsActions.changeTodolistTitle({todolistId, title}))
            //return{todolistId:arg.todolistId, title:arg.title}
            return arg
        }else{
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

const initialState: TodolistDomainType[] = []

const slice = createSlice({
    name: 'todolists',
    initialState,
    reducers: {
        /*
                removeTodolist: (state, action: PayloadAction<{ todolistId: string }>) => {
                    const index = state.findIndex(todo => todo.id === action.payload.todolistId)
                    if (index !== -1) state.splice(index, 1)
                },
        */
        /*
                addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
                    state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
                },
        */
/*
        changeTodolistTitle: (state, action: PayloadAction<{ todolistId: string, title: string }>) => {
            const todo = state.find(todo => todo.id === action.payload.todolistId)
            if (todo)
                todo.title = action.payload.title
        },
*/
        changeTodolistFilter: (state, action: PayloadAction<{ todolistId: string, filter: FilterValuesType }>) => {
            const todo = state.find(todo => todo.id === action.payload.todolistId)
            if (todo)
                todo.filter = action.payload.filter
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{ todolistId: string, entityStatus: RequestStatusType }>) => {
            const todo = state.find(todo => todo.id === action.payload.todolistId)
            if (todo)
                todo.entityStatus = action.payload.entityStatus
        },
        /*
                setTodolists: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
                    return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
                },
        */
    },
    extraReducers: builder => {
        builder
            .addCase(fetchTodolists.fulfilled, (state, action) => {
                //console.log(current(state))
                return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
            })
            .addCase(removeTodolist.fulfilled, (state, action) => {
                const index = state.findIndex(todo => todo.id === action.payload.todolistId)
                if (index !== -1) state.splice(index, 1)
            })
            .addCase(addTodolist.fulfilled, (state, action) => {
                state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
            })
            .addCase(changeTodolistTitle.fulfilled,(state, action)=>{
                const todo = state.find(todo => todo.id === action.payload.todolistId)
                if (todo)
                    todo.title = action.payload.title
            })
            .addCase(clearTasksAndTodolists, (state, action) => {
                return []
            })
    }
})

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions
export const todolistsThunks = {fetchTodolists, removeTodolist, addTodolist, changeTodolistTitle}


// thunks
/*
export const fetchTodolistsTC = () => {
    return (dispatch: any) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        todolistsAPI.getTodolists()
            .then((res) => {
                //debugger
                dispatch(todolistsActions.setTodolists({todolists: res.data}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
                return res.data
            })
            .then((todolists => {
                todolists.forEach((tl)=>{
                    //debugger
                    dispatch(tasksThunks.fetchTasks(tl.id))
                })
            }))
    }
}
*/
/*
export const removeTodolistTC = (todolistId: string) => {
    return (dispatch: ThunkDispatch) => {
        //изменим глобальный статус приложения, чтобы вверху полоса побежала
        dispatch(appActions.setAppStatus({status: 'loading'}))
        //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
        dispatch(todolistsActions.changeTodolistEntityStatus({todolistId, entityStatus: 'loading'}))
        todolistsAPI.deleteTodolist(todolistId)
            .then((res) => {
                dispatch(todolistsActions.removeTodolist({todolistId}))
                //скажем глобально приложению, что асинхронная операция завершена
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            })
    }
}
*/
/*
export const addTodolistTC = (title: string) => {
    return (dispatch: ThunkDispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                dispatch(todolistsActions.addTodolist({todolist: res.data.data.item}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            })
    }
}
*/
/*
export const changeTodolistTitleTC = (todolistId: string, title: string) => {
    return (dispatch: Dispatch) => {
        todolistsAPI.updateTodolist(todolistId, title)
            .then((res) => {
                dispatch(todolistsActions.changeTodolistTitle({todolistId, title}))
            })
    }
}
*/

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
type ThunkDispatch = Dispatch
