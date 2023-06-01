import {AxiosResponse} from "axios";
import {
    instance,
} from "common/api/common.api";
import {UpdateDomainTaskModelType} from "features/TodolistsList/tasks.reducer";
import {ResponseType} from "common/types/common.types";
import {TaskPriorities, TaskStatuses} from "common/enums";

export const todolistsAPI = {
    getTodolists() {
        return instance.get<TodolistType[]>('todo-lists');
    },
    createTodolist(title: string) {
        return instance.post<{ title: string }, AxiosResponse<ResponseType<{ item: TodolistType }>>>('todo-lists', {title});
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}`);
    },
    updateTodolist(todolistId: string, title: string) {
        return instance.put<{ title: string }, AxiosResponse<ResponseType>>(`todo-lists/${todolistId}`, {title});
    },
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
    },

    /*
    deleteTask(todolistId,taskId) {
            return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`);
        },
        */
    deleteTask(arg: RemoveTaskArgType) {
        return instance.delete<ResponseType>(`todo-lists/${arg.todolistId}/tasks/${arg.taskId}`);
    },
    //createTask(arg:{title: string, todolistId: string}) {
    createTask(arg: AddTaskArgType) {
        return instance.post<{ title: string }, AxiosResponse<ResponseType<{ item: TaskType }>>>
        (`todo-lists/${arg.todolistId}/tasks`, {title: arg.title});
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<UpdateTaskModelType, AxiosResponse<ResponseType<{ item: TaskType }>>>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
    }
}


//type
export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}
export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}
export type UpdateTaskModelType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}
type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}

export type AddTaskArgType = {
    title: string
    todolistId: string
}

export type UpdateTaskArgType = {
    taskId: string
    domainModel: UpdateDomainTaskModelType
    todolistId: string
}

export type RemoveTaskArgType = {
    taskId: string
    todolistId: string
}

export type UpdateTodolistTitleArgType = {
    todolistId: string
    title: string
}