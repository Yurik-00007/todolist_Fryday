import React, {useEffect} from 'react'
import './App.css'
import {TodolistsList} from 'features/TodolistsList/TodolistsList'
import {useAppDispatch, useAppSelector} from './store'
import {initializeAppTC, RequestStatusType} from 'app/app.reducer'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import {Menu} from '@mui/icons-material';
import {ErrorSnackbar} from 'components/ErrorSnackbar/ErrorSnackbar'
import {Navigate, Route, Routes} from "react-router-dom";
import {Login} from "features/auth/Login";
import {logoutTC} from "features/auth/auth.reducer";
import CircularProgress from "@mui/material/CircularProgress";
import {selectIsLoggedIn} from "features/auth/auth.selectors";
import {selectIsInitialized, selectStatus} from "app/app.selectors";


function App() {
    const status = useAppSelector(selectStatus)
    const isInitialized=useAppSelector(selectIsInitialized)
    const isLoggedIn=useAppSelector(selectIsLoggedIn)
    const dispatch=useAppDispatch()
    useEffect(()=>{
        //debugger
        dispatch(initializeAppTC())
    },[])

    const logoutHandler=()=>{
        dispatch(logoutTC())
    }
    if (!isInitialized) {
        //debugger
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }
    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Logout</Button>}
                </Toolbar>
                {status === 'loading' && <LinearProgress/>}
            </AppBar>
            <Container fixed>
                <Routes>
                    <Route path={'/'} element={<TodolistsList/>}/>
                    <Route path={'login'} element={<Login/>}/>
                    <Route path='404' element={<h1 style={{textAlign: "center"}}>404: PAGE NOT FOUND</h1>}/>
                    <Route path={'*'} element={<Navigate to='/404'/>}/>
                    </Routes>

                        </Container>
                        </div>
                        )
                    }

                           export default App
