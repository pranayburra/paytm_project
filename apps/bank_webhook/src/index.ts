import express from "express";
import {db} from "@repo/db"
import cors from "cors"
const app=express();
app.use(cors());
app.use(express.json())
app.get("/",(req,res)=>{
    return res.status(200).json({
        msg:"successful"
    })
})
app.post('/addMoney',async (req,res)=>{
    const paymentInfo:{
        token:string;
        userId:string;
        amount:string;
    }={
        token:req.body.token,
        userId:req.body.userId,
        amount:req.body.amount
    }
    const t=await db.onRampTransaction.findFirst({
        where:{
            status:"Success"
        }
    })
    if(t)return res.status(409).json({msge:" already transaction is successfull"});
    try{
        const trx=await db.$transaction([
            db.balance.updateMany({
                where:{
                    userId:Number(paymentInfo.userId)
                },
                data:{
                    amount:{
                        increment:Number(paymentInfo.amount)
                    }
                }
            }),
            db.onRampTransaction.updateMany({
            where:{
                token:paymentInfo.token
            },
            data:{
                status:"Success"
            }
        })
        ])

        console.log(trx)
        if(trx){
               return res.status(200).json({
            message:"Captured"
            })
        }
        return res.status(400).json({ message: "Transaction not found or failed" });
     
        
    }catch(e){
        res.status(411).json({
            message:"Error while processing webhook"
        })
    }
})
app.listen(3002,()=>console.log(`server is runningasddf on port {http://localhost:3002} `))