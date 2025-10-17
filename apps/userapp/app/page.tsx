// app/page.tsx

import { auth } from "@/auth";
import { redirect } from "next/navigation";



export default async function Page() {

  const session=await auth();
  if(session)redirect("/dashboard");
  else redirect("/api/auth/signin");
  

 
  return (
    <div>
     
      <div>Welcome to your dashboard!</div>
    </div>
  );
}
