import axios, {AxiosResponse} from 'axios'
import {UpdateDomainTaskModelType} from "features/TodolistsList/tasks.reducer";
import {TaskPriorities, TaskStatuses} from "common/enums/common.enum";

export const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '3aa87812-3ffb-4599-85a2-8f21fa7c8a5a'
    }
})

// api








