"use client";
import { Button } from "@repo/ui/Button";
import { Card } from "./Card";
// import { Center } from "./centralize";
import { Select } from "./Select";
import { useState } from "react";
import { TextInput } from "./TextInput";

import {  useSession } from "next-auth/react";

import { CreateOnRampTransactions } from "@/lib/actions/CreateOnRampTransactions";

const SUPPORTED_BANKS = [
  {
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com",
  },
  {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/",
  },
];

export const AddMoney = () => {
  const [redirectUrl, setRedirectUrl] = useState(
    SUPPORTED_BANKS[0]?.redirectUrl
  );
  const [amount, setAmount] = useState(0);
  const [provider,setProvider]=useState(SUPPORTED_BANKS[0]?.name||"")
  const session = useSession();

  return (
    <Card title="Add Money">
      <div className="w-full">
        <TextInput
            value={amount}
          label={"Amount"}
          placeholder={"Amount"}
          onChange={(e:string) => {
            setAmount(Number(e));
          }}
        />
        <div className="py-4 text-left">Bank</div>
        <Select
          onSelect={(value) => {
            setRedirectUrl(
              SUPPORTED_BANKS.find((x) => x.name === value)?.redirectUrl || "");
            setProvider(SUPPORTED_BANKS.find((x)=>x.name==value)?.name||"");
          }}
          options={SUPPORTED_BANKS.map((x) => ({
            key: x.name,
            value: x.name,
          }))}
        />
        <div className="flex justify-center pt-4">
          <Button onClick={async ()=>{
            await CreateOnRampTransactions(provider,amount*100)
          }}  disable={!amount || !session.data} >Add Money</Button>
        </div>
      </div>
    </Card>
  );
};
