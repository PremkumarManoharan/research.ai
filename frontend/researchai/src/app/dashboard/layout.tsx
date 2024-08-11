"use client";
import React from "react";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div style={{ display: "flex", height: "100vh", padding: 0 }}>
      {children}
    </div>
  );
}

export default Layout;
