import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";

export function AuthShowcase() {
  const { data: sessionData } = useSession();

  return (
    <div className="fixed bottom-0 left-0 p-4 flex flex-col items-start justify-center gap-4">
      {/* <p className="">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
      </p> */}
      <Button
        onClick={sessionData ? async () => await signOut() : async () => await signIn()}
      >
        {sessionData ? "Sign out " + sessionData.user.name : "Sign in"}
      </Button>
    </div>
  );
}
