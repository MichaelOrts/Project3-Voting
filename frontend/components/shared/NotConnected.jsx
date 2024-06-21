'use client';
import Image from "next/image";

const NotConnected = () => {
  return (
     <>
     <h1 className="text-4xl font-bold mb-6">Welcome to Crypto Consensus</h1>
     <Image src="/logo.png" alt="Crypto Consensus Logo" width="150" height="150" className="mb-5" />
     <p className="mb-4">A simple app to vote on the proposed changes to the web3 ecosystem.</p>
     </>
  )
}

export default NotConnected