import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "zicarus/utils/api";
import { Toaster } from "../components/ui/toaster";
import UserSync from "@/components/UserProvider";
import "zicarus/styles/globals.css";
import ConversationsModal from "zicarus/components/ConversationsModal";
import TopRightNav from "zicarus/components/TopRightNav";
import Layout from "zicarus/components/Layout";
import VendorMap from "zicarus/components/VendorMap";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <SessionProvider session={session}>
        <UserSync>
          <Layout>
            <Component {...pageProps} />
            <ConversationsModal />
          </Layout>
        </UserSync>
      </SessionProvider>
      <Toaster />
    </>
  );
};

export default api.withTRPC(MyApp);
