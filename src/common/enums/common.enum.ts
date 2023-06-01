export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}
/*
export const TaskStatuses= {
    New : 0,
    InProgress : 1,
    Completed : 2,
    Draft : 3
}as const
*/

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}
/*
export const TaskPriorities= {
    Low : 0,
    Middle : 1,
    Hi : 2,
    Urgently : 3,
    Later : 4
}as const
*/

/*
export enum ResultCode {
    Success = 0,
    Error = 1,
    Captcha = 10,
}
//ResultCode.Seccess=78
*/

export const ResultCode= {
    Seccess : 0,
    Error : 1,
    Captcha : 10,
}as const

//ResultCode2.Seccess=78
