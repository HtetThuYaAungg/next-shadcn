import React from "react";
import Main from "./main";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Main>{children}</Main>;
}
