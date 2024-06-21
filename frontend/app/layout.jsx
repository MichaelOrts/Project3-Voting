import CustomRainbowKitProvider from "./CustomRainbowKitProvider";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from '../components/Header';
import Footer from '../components/Footer';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Crypto Consensus",
  description: "A simple app to vote on the proposed changes to the web3 ecosystem.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <CustomRainbowKitProvider>
          <div className="flex flex-col flex-grow min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto p-4">
              {children}
            </main>
            <Footer />
          </div>
        </CustomRainbowKitProvider>
      </body>
    </html>
  );
}
