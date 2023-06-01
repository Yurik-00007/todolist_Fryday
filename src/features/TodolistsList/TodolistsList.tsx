import React, {useCallback, useEffect} from 'react'
import {useAppSelector} from 'app/store'
import {
    FilterValuesType,
    todolistsActions, todolistsThunks
} from 'features/TodolistsList/todolists.reducer'
import {tasksThunks} from 'features/TodolistsList/tasks.reducer'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {Todolist} from './Todolist/Todolist'
import {Navigate} from "react-router-dom";
import {selectIsLoggedIn} from "features/auth/auth.selectors";
import {selectTodolists} from "features/TodolistsList/todolist.selectors";
import {selectTasks} from "features/TodolistsList/tasks.selectors";
import {AddItemForm} from "common/components";
import {TaskStatuses} from "common/enums/common.enum";
import {useAppDispatch} from "common/hooks";


export const TodolistsList: React.FC = () => {
    const todolists = useAppSelector(selectTodolists)
    const tasks = useAppSelector(selectTasks)
    const isLoggedIn=useAppSelector(selectIsLoggedIn)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if( !isLoggedIn){
            return
        }
        dispatch(todolistsThunks.fetchTodolists())
    }, [])

    const removeTask = useCallback(function (taskId: string, todolistId: string) {
        dispatch(tasksThunks.removeTask({taskId, todolistId}))
    }, [])

    const addTask = useCallback(function (title: string, todolistId: string) {
        dispatch(tasksThunks.addTask({title, todolistId}))
    }, [])

    const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
        dispatch(tasksThunks.updateTask({taskId, domainModel:{status}, todolistId}))
    }, [])

    const changeTaskTitle = useCallback(function (taskId: string, title: string, todolistId: string) {
        dispatch(tasksThunks.updateTask({taskId, domainModel:{title}, todolistId}))
    }, [])

    const changeFilter = useCallback(function (filter: FilterValuesType, todolistId: string) {
        dispatch(todolistsActions.changeTodolistFilter({todolistId, filter}))
    }, [])

    const removeTodolist = useCallback(function (todolistId: string) {
        dispatch(todolistsThunks.removeTodolist(todolistId))
    }, [])

    const changeTodolistTitle = useCallback(function (todolistId: string, title: string) {
        dispatch(todolistsThunks.changeTodolistTitle({todolistId, title}))
    }, [])

    const addTodolist = useCallback((title: string) => {
        dispatch(todolistsThunks.addTodolist({title}))
    }, [dispatch])


    if(!isLoggedIn){
        //ebugger
        return <Navigate to={'/login'}/>
    }

    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist
                                todolist={tl}
                                tasks={allTodolistTasks}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                changeTaskStatus={changeStatus}
                                removeTodolist={removeTodolist}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitle}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
