"use client";

import { MantineProvider } from "@mantine/core";

export function MantineProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MantineProvider
      defaultColorScheme="light"
      theme={{
        fontFamily: "inherit",
        primaryColor: "violet",
        defaultRadius: "md",
      }}
    >
      {children}
    </MantineProvider>
  );
}
