import { db } from "@repo/db";
import { AddMoney } from "@/components/AddMoney";
import { BalanceCard } from "@/components/BalanceCard";
import { OnRampTransactions } from "@/components/OnRampTranx";

import { auth } from "@/auth";

async function getBalance() {
    const session = await auth();
    // console.log("id"+session?.user?.id)
    const balance = await db.balance.findFirst({
        where: {
            
            userId: Number(session?.user?.id)
        }
    });
 
    return {
        amount: balance?.amount || 0,
        locked: balance?.Locked || 0
    }
}

async function getOnRampTransactions() {
    const session = await auth();
    const txns = await db.onRampTransaction.findMany({
        where: {
            userId:  Number(session?.user?.id)
        }
    });
    const p2p=await db.p2pTransfer.findMany({
        where:{
            fromUserId:Number(session?.user?.id)
        }
    })
    const total=[...txns.map(t => ({
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider
    })), ...p2p.map((t) => ({
    time: t.timeStamp,
    amount: t.amount,
    status: "Success" as const,
    provider: `P2P → ${t.toUserId}`,
  })),]

     return total;

}

export default async function page() {
    const balance = await getBalance();
    const transactions = await getOnRampTransactions();

    return <div className="w-screen">
        <div className="text-4xl  text-[#6a51a6] pt-8 mb-8 font-bold">
            Transfer
        </div>
        <div className="grid grid-cols-1  gap-4 md:grid-cols-2 p-4">
            <div  className="bg-red-300">
                <AddMoney />
            </div>
            <div className="">
                <BalanceCard amount={balance.amount} locked={balance.locked} />
                <div className="pt-4">
                    <OnRampTransactions transactions={transactions} />
                </div>
            </div>
        </div>
    </div>
}