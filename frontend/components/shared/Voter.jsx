import {
    Card
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { contractAddress, contractAbi } from "@/constant";
import { useReadContract, useAccount } from "wagmi";
import { useState, useEffect } from "react";

const Voter = ({ voterAddress }) => {

    const { address } = useAccount();
    

    const { data: voter } = useReadContract({
        address: contractAddress,
            abi: contractAbi,
            functionName: 'getVoter',
            args: [voterAddress],
            account: address
    })

    

  return (
    <Card className="p-4 mb-2">
        <div className="flex items-center">
            <Badge className="bg-white-900">{voterAddress}</Badge>
            <p className="ml-2">hasVoted : <span className="font-bold">{voter?.hasVoted.toString()}</span></p>
            <p className="ml-2">votedProposalId : <span className="font-bold">{voter?.votedProposalId?.toString()}</span></p>
        </div>
    </Card>
  )
}

export default Voter