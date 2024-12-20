import { z } from "zod";

export class AUTHVALIDATION{
    static readonly SIGNUP=z.object({
        name:z.string().min(3, { message:"Name at least 3 char" }),
        email:z.string().email({ message:"Invalid email" }),
        password:z.string().min(8, { message:"Password at least 6 char" }),
        confirmPassword:z.string()
    }).refine(data => data.password === data.confirmPassword, {
        message:"Password not match",
        path:["confirmPassword"]
    });
    
    static readonly SIGNIN=z.object({
        email:z.string().email({ message:"Invalid email" }),
        password:z.string().min(8, { message:"Password at least 6 char" })
    });
}