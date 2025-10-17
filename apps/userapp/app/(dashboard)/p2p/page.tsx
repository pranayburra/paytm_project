import { auth } from "@/auth";
import { SendCard } from "@/components/SendCard"

export default async function page() {
    const session=await auth();
    return <div className="w-full">
        {session?.user?.id}
        <SendCard />
    </div>
}