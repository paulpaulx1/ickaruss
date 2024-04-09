import { appRouter } from "../api/root";
import superjson from "superjson";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { createInnerTRPCContext } from "../api/trpc";
import { getSession } from "next-auth/react";

const session = await getSession();

export const serverSideHelpers = () =>
  createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session }),
    transformer: superjson, // optional - adds superjson serialization
  });
