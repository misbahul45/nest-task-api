import { TASKVALIDATION } from "src/tasks/task.validation";
import { z } from "zod";


export namespace TaskTypes{
    export type CREATE_TASK=z.infer<typeof TASKVALIDATION.CREATE>;
    export enum TaskStatus {
        TODO = 'TODO',
        IN_PROGRESS = 'IN_PROGRESS',
        DONE = 'DONE',
    }
    export type TASK={
        id: string;
        title: string;
        description?: string;
        dueDate?: Date;
        status: TaskStatus;
    }

    export type UPDATE_TASK=z.infer<typeof TASKVALIDATION.UPDATE>;
}