"use client";

import { MantineProvider } from "@mantine/core";
import { localStorageColorSchemeManager } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function MantineProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const colorSchemeManager = localStorageColorSchemeManager({
    key: "theme-mode",
  });

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        defaultColorScheme="light"
        colorSchemeManager={colorSchemeManager}
        theme={{
          fontFamily: "inherit",
          primaryColor: "violet",
          defaultRadius: "md",
        }}
      >
        {children}
      </MantineProvider>
    </QueryClientProvider>
  );
}
