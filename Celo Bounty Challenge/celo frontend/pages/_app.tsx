import "../styles/globals.css";
import type { AppProps } from "next/app";
import ActiveContext from "../context/context";
import Header from "../components/Header";
import { MoralisProvider } from "react-moralis";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { Toaster } from "react-hot-toast";


const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: process.env.NEXT_PUBLIC_GRAPH_URL,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <ApolloProvider client={client}>
        <ActiveContext>
          <div className="min-h-screen w-screen flex flex-col">
            <Header />
            <Component {...pageProps} />
            {/* <Notification /> */}
            <Toaster position="bottom-right" />
          </div>
        </ActiveContext>
      </ApolloProvider>
    </MoralisProvider>
  );
}

export default MyApp;
