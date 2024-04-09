import React from "react";
import TopRightNav from "./TopRightNav";
import { AuthShowcase } from "./AuthShowcase";
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mt-[100px] flex flex-col">
      <AuthShowcase />
      <TopRightNav />
      <img
        className="fixed left-4 top-4 h-[60px]"
        src="/icarus-logo.png"
        alt="Icarus"
      />
      <main className="flex-1 flex-grow">{children}</main>
    </div>
  );
};

export default Layout;
