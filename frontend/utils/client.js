import { createPublicClient, http } from "viem";
import { hardhat } from "viem/chains";

export const hardhat = createPublicClient({
    chain: hardhat,
    transport: http()
})