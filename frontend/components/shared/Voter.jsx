import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

import { contractAddress, contractAbi } from "@/constant";
import { useReadContract, useAccount } from "wagmi";

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
    <Badge className="bg-yellow-200 flex-col items-start">
        <div>
            <Label className="ml-4">Address</Label>
            <Label className="ml-4 mr-4 font-bold">{voterAddress}</Label>
        </div>
        <div>
            <Label className="ml-4">Has Voted</Label>
            <Label className="ml-4 mr-4 font-bold">{voter?.hasVoted.toString()||"false"}</Label>
        </div>
        <div>
            <Label className="ml-4">Voted Proposal Id</Label>
            <Label className="ml-4 mr-4 font-bold">{voter?.votedProposalId?.toString()||0}</Label>
        </div>
    </Badge>
  )
}

export default Voter