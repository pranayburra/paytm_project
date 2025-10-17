"use server"
import { auth } from "@/auth";
import { db } from "@repo/db";



export async function CreateOnRampTransactions(provider:string,amount:number){

    const session=await auth();
    if(!session?.user||!session?.user?.id){
        return {
            msg:"Not Authenticated",
        }
    }
   
    const token=(Math.random()*100).toString();
    await db.onRampTransaction.create({
        data:{
            status:"Pending",
            token:token,
            startTime:new Date(),
            provider:provider,
            amount:amount,
            userId:Number(session?.user?.id)
        }
    })
    return {
        message:"Done"
    }


}