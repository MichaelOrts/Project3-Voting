'use client';
import { useState, useEffect } from "react";

import { contractAddress, contractAbi } from "@/constant";
import { useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseAbiItem } from "viem";

import { hardhat as publicClient } from "@/utils/client";

import Event from "./Events";

const Voting = () => {

    const { address } = useAccount();

    

    return (
        <div>

        </div>
    )
}

export default SimpleStorage