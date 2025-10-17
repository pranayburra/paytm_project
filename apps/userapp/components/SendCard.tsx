"use client"

import { Card } from "./Card";
import { Center } from "./Centralize";
// import { TextInput } from "@repo/ui/textinput";
import { useState } from "react";
import { TextInput } from "./TextInput";
import { p2pTransfer } from "@/lib/actions/p2ptransfer";

export function SendCard() {
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState("");

    return <div className="h-[60vh] w-[60vw]">
        <Center >
            <Card title="Send" >
                <div className="min-w-72 pt-2">
                    <TextInput value={(number)} placeholder={"Number"} label="Number"  onChange={(value) => {
                        setNumber(value)
                    }} />
                    <TextInput value={(amount)} placeholder={"Amount"} label="Amount" onChange={(value) => {
                        setAmount(value)
                    }} />
                    <div className="pt-4 flex justify-center">
                       <button onClick={ async ()=>{
                         await p2pTransfer(number, Number(amount) * 100)
                       }}>Send</button>
                    </div>
                </div>
            </Card>
        </Center>
            
       
    </div>
}