import React, { useEffect, useState } from 'react';

import { contractAddress, contractAbi } from "@/constant";
import { useReadContract, useAccount } from "wagmi";

import {
    Card
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"


const UserRole = ({ voterAddress, isOwner, isVoter }) => {

    const [role, setRole] = useState('');
    const { address } = useAccount();

    const voter = isVoter ? useReadContract({
      address: contractAddress,
            abi: contractAbi,
            functionName: 'getVoter',
            args: [voterAddress],
            account: address
        }) : null;

    useEffect(() => {
        if (isOwner) {
        setRole('Owner 😎');
        } else if (isVoter) {
        setRole('Voter 😊');
        } else {
        setRole('No Role 😢');
        }
  }, [isOwner, isVoter]);

  
  return (
    <Card className="flex bg-white rounded-lg shadow-xl w-3/6 m-auto mt-12 py-5">
            <Badge className="flex flex-col items-start">
                <div>
                    <Label className="text-base m-2 font-bold">Address</Label>
                    <Label className="text-sm m-2 text-blue-500">{voterAddress}</Label>
                </div>
                <div>
                    <Label className="text-base m-2 font-bold">Your Role</Label>
                    <Label className="text-sm m-2 text-blue-500">{role}</Label>
                </div>
              </Badge>
              <Badge className="flex flex-col items-start">
                <div>
                    <Label className="text-base m-2 font-bold">Has Voted</Label>
                    <Label className="text-sm m-2 text-blue-500">{voter?.hasVoted.toString()||"false"}</Label>
                </div>
                <div>
                    <Label className="text-base m-2 font-bold">Voted Proposal Id</Label>
                    <Label className="text-sm m-2 text-blue-500">{voter?.votedProposalId?.toString()||0}</Label>
                </div>
            </Badge>
    </Card>
  )
}

export default UserRole