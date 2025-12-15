import { Button } from "@/components/ui/button";
import Logout from "@/modules/auth/components/logout";
import { requireAuth } from "@/modules/auth/utils/auth-utils";
import Image from "next/image";

export default async function Home() {
  await requireAuth();
  return (
    <div className=" flex items-center justify-center h-screen">
      <Logout>
        <Button>Hello, Click to Logout</Button>
      </Logout>
    </div>
  );
}
