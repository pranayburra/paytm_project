// app/page.tsx

import { auth } from "@/auth";
import { redirect } from "next/navigation";


export default async function Page() {

  const session=await auth();
  

 
  return (
    <div>
     
      <div>Welcome to your dashboard!</div>
    </div>
  );
}
