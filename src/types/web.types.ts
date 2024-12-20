import { Request } from "express";
export class WebResponse<T> { 
    data?:T;
    message:string;
    success:boolean;
    errors?: string[]
 }

 export type USER={
    id:string,
    name:string,
    email:string
 }

 export type AUTHRESPONSE={
   user:USER,
   accessToken:string,
   refreshToken:string  
 }

 export class REQUEST extends Request{
    user?:USER
    body: {
      refreshToken?: string;
  } & Request['body']; 
 }