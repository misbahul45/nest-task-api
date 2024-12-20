import { Request } from "express"

export namespace AuthTypes {
    export type SIGNUP={
        name:string,
        email:string,
        password:string,
        confirmPassword?:string
    }

    export type SIGNIN={
        email:string,
        password:string
    } 
    export type RESPON_SIGNUP={
        id:string,
        email:string,
        name:string,
    }

    export type RESPON_VALIDATE_LOCAL={
        id:string,
        name:string,
        email:string
    }

   export type AUTH_JWT_PAYLOAD={
    sub:string
   }


}