import { NextFunction, Request,Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import {config} from "dotenv"
config()

interface User{
    id:string,
    name:string,
    email:string
    
}


export const auth=async(req:Request,res:Response,next:NextFunction)=>{
    const token=req.cookies.jwt;
    
    if(!token){
        return res.status(401).json({
            message:"you are not authenticated"
        })
    }
    const decode = jwt.verify(token,process.env.JWT_SECRET as string) 
    req.user=decode as User
    next()
    

}