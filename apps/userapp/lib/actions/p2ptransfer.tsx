"use server"

import { auth } from "@/auth";
import { db } from "@repo/db";



export async function p2pTransfer(to: string, amount: number) {
    const session = await auth()
    const from = session?.user?.id;
    if (!from) {
        return {
            message: "Error while sending"
        }
    }
    const toUser = await db.user.findFirst({
        where: {
            number: to
        }
    });

    if (!toUser) {
        return {
            message: "User not found"
        }
    }
    
    const transaction=await db.$transaction(async (tx) => {
        await tx.$queryRaw`select * from "Balance" where "userId"=${Number(from)} for update`;
        const fromBalance = await tx.balance.findFirst({
            where: { userId: Number(from) },
          });
          if (!fromBalance || fromBalance.amount < amount) {
            throw new Error('Insufficient funds');
          }

          await tx.balance.updateMany({
            where: { userId: Number(from) },
            data: { amount: { decrement: amount } },
          });

          await tx.balance.updateMany({
            where: { userId: toUser.id },
            data: { amount: { increment: amount } },
          });
          await tx.p2pTransfer.create({
            data:{
                amount:amount,
                fromUserId:Number(from),
                toUserId:Number(toUser.id)
            }
          })
    });
    console.log(transaction)
}