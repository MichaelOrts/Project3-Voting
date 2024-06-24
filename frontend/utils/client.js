import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

const RPC = process.env.NEXT_PUBLIC_ALCHEMY_RPC || "";

export const hardhatClient = createPublicClient({
    chain: sepolia,
    transport: http(RPC)
})