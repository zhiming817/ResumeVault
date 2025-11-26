"use client";
import { ReactNode } from "react";
import { baseSepolia } from "wagmi/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { http, createConfig } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import "@coinbase/onchainkit/styles.css";

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'ResumeVault',
      preference: 'all',
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
});

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

export function RootProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <OnchainKitProvider
            apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
            chain={baseSepolia}
            config={{
              appearance: {
                mode: "auto",
              },
              wallet: {
                display: "modal",
                preference: "all",
              },
            }}
            miniKit={{
              enabled: true,
              autoConnect: true,
            }}
          >
            {children}
          </OnchainKitProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
