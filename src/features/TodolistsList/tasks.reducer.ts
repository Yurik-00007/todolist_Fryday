import {Dispatch} from 'redux'
import {appActions} from "app/app.reducer";
import {createSlice, current, PayloadAction} from "@reduxjs/toolkit";
import {todolistsActions, todolistsThunks} from "features/TodolistsList/todolists.reducer";
import {clearTasksAndTodolists} from "common/actions/common.actions";
import {ResultCode, TaskPriorities, TaskStatuses} from "common/enums/common.enum";
import {
    AddTaskArgType, RemoveTaskArgType,
    TaskType,
    todolistsAPI,
    UpdateTaskArgType,
    UpdateTaskModelType
} from "features/TodolistsList/todolists.api";
import {createAppAsyncThunk} from "common/utils/create-app-async-thunk";
import {handleServerAppError} from "common/utils/handle-server-app-error";
import {handleServerNetworkError} from 'common/utils/handle-server-network-error'

//const fetchTasks = createAsyncThunk<{ tasks: TaskType [],todolistId: string},string,{rejectValue:unknown}>
//типизация будет браться из utils/create-app-async-thunk
const fetchTasks = createAppAsyncThunk<{ tasks: TaskType [], todolistId: string }, string>
('tasks/fetchTasks', async (todolistId, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        const res = await todolistsAPI.getTasks(todolistId)
        //чтобы попасть в ошибку
        //const res = await todolistsAPI.getTasks('11')
        const tasks = res.data.items
        dispatch(appActions.setAppStatus({status: 'succeeded'}))
        //dispatch(tasksActions.setTasks({tasks, todolistId}))
        //debugger
        return {tasks, todolistId}
    } catch (e) {
        //debugger
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgType>
('tasks/addTask', async (arg: AddTaskArgType, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        const res = await todolistsAPI.createTask(arg)
        //if (res.data.resultCode === ResultCode.Seccess) {
        if (res.data.resultCode === ResultCode.Seccess) {
            const task = res.data.data.item
            // const action = tasksThunks.addTask({task})
            // dispatch(action)
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return {task}
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)

    }
})


const updateTask = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>
    //префикс, колбэк
    ('tasks/updateTask', async (arg, thunkAPI) => {
        //вытаскиваем необходимые методы thunk
        const {dispatch, rejectWithValue, getState} = thunkAPI
        try {
            dispatch(appActions.setAppStatus({status: 'loading'}))
            const state = getState()
            const task = state.tasks[arg.todolistId].find(t => t.id === arg.taskId)
            if (!task) {
                //throw new Error("task not found in the state");
                dispatch(appActions.setAppError({error:'Task not found in the state'}))
                //console.warn('task not found in the state')
                return rejectWithValue(null)
            }

            const apiModel: UpdateTaskModelType = {
                deadline: task.deadline,
                description: task.description,
                priority: task.priority,
                startDate: task.startDate,
                title: task.title,
                status: task.status,
                ...arg.domainModel
            }
            const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel)
            if (res.data.resultCode === ResultCode.Seccess) {
                //dispatch(tasksActions.updateTask({arg.taskId, model: arg.domainModel, arg.todolistId}))
                //return {taskId:arg.taskId, model: arg.domainModel, todolistId:arg.todolistId}
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
                return arg
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null)
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    })

const removeTask=createAppAsyncThunk<RemoveTaskArgType,RemoveTaskArgType>
('tasks/removeTask',async (arg, thunkAPI)=>{
    const {dispatch,rejectWithValue}=thunkAPI
    try{
        dispatch(appActions.setAppStatus({status: 'loading'}))

        const res= await todolistsAPI.deleteTask(arg)
        //const res= await todolistsAPI.deleteTask(arg.todolistId,arg.taskId)
        if (res.data.resultCode === ResultCode.Seccess) {
            //dispatch(tasksActions.removeTask({taskId, todolistId}))
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return arg
        }else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null)
            }
    }catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)

        }
})

// export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch) => {
//     todolistsAPI.deleteTask(todolistId, taskId)
//         .then(res => {
//             const action = tasksActions.removeTask({taskId, todolistId})
//             dispatch(action)
//         })
// }

const initialState: TasksStateType = {}

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
       /*
        removeTask: (state, action: PayloadAction<{ taskId: string, todolistId: string }>) => {
            //return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index !== -1) tasks.splice(index, 1)

        },
*/
        /*      addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
                  const tasks = state[action.payload.task.todoListId]
                  tasks.unshift(action.payload.task)
              },*/
        /*
        updateTask: (state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index !== -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        },
        */
        /*
                //этот подредусер удаляем так как он тепер будет работать в extraReducers
                setTasks: (state, action: PayloadAction<{ tasks: TaskType[], todolistId: string }>) => {
                    //return {...state, [action.todolistId]: action.tasks}
                    state[action.payload.todolistId] = action.payload.tasks
                },
        */
    },
    extraReducers: builder => {
        builder
            .addCase(addTask.fulfilled, (state, action) => {
                //debugger
                //console.log('state', current(state))
                const tasks = state[action.payload.task.todoListId]
                tasks.unshift(action.payload.task)
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                //debugger
                state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index !== -1) {
                    //tasks[index] = {...tasks[index], ...action.payload.model}
                    tasks[index] = {...tasks[index], ...action.payload.domainModel}
                }
            })
            .addCase(removeTask.fulfilled,(state, action)=>{
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index !== -1) tasks.splice(index, 1)
            })
            /*
                        //если нужно обработать ошибку то можно написать такую логику,
                        // но сейчас такая логика ненужеа так как используем handleServerNetworkError(e,dispatch)
                        .addCase(fetchTasks.rejected, (state, action) => {
                            debugger
                        })
            */

            .addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
                //return {...state, [action.todolist.id]: []}
                state[action.payload.todolist.id] = []
            })
/*
            .addCase(todolistsActions.addTodolist, (state, action) => {
                //return {...state, [action.todolist.id]: []}
                state[action.payload.todolist.id] = []
            })
*/
/*
            .addCase(todolistsActions.removeTodolist, (state, action) => {
                delete state[action.payload.todolistId]
            })
*/
            .addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) => {
                delete state[action.payload.todolistId]
            })
     /*       .addCase(todolistsActions.setTodolists, (state, action) => {
                action.payload.todolists.forEach(el =>
                    state[el.id] = [])
            })*/
            .addCase(todolistsThunks.fetchTodolists.fulfilled, (state, action) => {
                action.payload.todolists.forEach(el =>
                    state[el.id] = [])
            })

            .addCase(clearTasksAndTodolists, (state, action) => {
                return {}
                //return action.payload.tasks
            })
    }
})
export const tasksReducer = slice.reducer
export const tasksActions = slice.actions
//export const {removeTask,addTask,}=slice.actions
export const tasksThunks = {fetchTasks, addTask, updateTask,removeTask}

// thunks


/*
export const _fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    todolistsAPI.getTasks(todolistId)
        .then((res) => {
            const tasks = res.data.items
            dispatch(tasksActions.setTasks({tasks, todolistId}))
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
        })
}
*/
/*
export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch) => {
    todolistsAPI.deleteTask(todolistId, taskId)
        .then(res => {
            const action = tasksActions.removeTask({taskId, todolistId})
            dispatch(action)
        })
}
*/
/*
export const addTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    todolistsAPI.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                const task = res.data.data.item
                const action = tasksThunks.addTask({task})
                dispatch(action)
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
*/
/*
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
    (dispatch: ThunkDispatch, getState: () => AppRootStateType) => {
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (!task) {
            //throw new Error("task not found in the state");
            console.warn('task not found in the state')
            return
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...domainModel
        }

        todolistsAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === 0) {
                    const action = tasksActions.updateTask({taskId, model: domainModel, todolistId})
                    dispatch(action)
                } else {
                    handleServerAppError(res.data, dispatch);
                }
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch);
            })
    }
    */

// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<TaskType>
}

type ThunkDispatch = Dispatch