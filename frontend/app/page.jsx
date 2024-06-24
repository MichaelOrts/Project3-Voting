'use client';
import React, { useEffect, useState } from 'react';
import { UserRoleProvider } from '@/context/UserRoleContext';
import NextWorkflowButton from '@/components/shared/NextWorkflowButton';
import NotConnected from "@/components/shared/NotConnected";
import ProgressBar from "@/components/shared/ProgressBar";
import Proposal from "@/components/shared/Proposal";
import RegisterVoter from "@/components/shared/RegisterVoter";
import UserRole from "@/components/shared/UserRole";
import WinningProposal from "@/components/shared/WinningProposal";
import { useAccount, useReadContract } from "wagmi";
import { contractAddress, contractAbi } from '../constant/index';
import useVoters from '@/hooks/useVoters';

import Voting from "@/components/shared/Voting"

const contractConfig = {
  address: contractAddress,
  abi: contractAbi
};

export default function Home() {
  const { isConnected, address: currentAddress } = useAccount();
  const { votersAddress } = useVoters();
  const { data: workflowStatusData, isError: isWorkflowStatusError } = useReadContract({
    ...contractConfig,
    functionName: 'workflowStatus',
  });

  const { data: ownerAddress, isError: isOwnerError } = useReadContract({
    ...contractConfig,
    functionName: 'owner',
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // ou un loader, spinner, etc.
  }

  if (isWorkflowStatusError || isOwnerError) {
    // Handle error
    return <div>Something went wrong</div>;
  }

  const workflowStatus = workflowStatusData || 0;
  const allVoters = votersAddress || [];
  const isOwner = ownerAddress === currentAddress;
  const isVoter = allVoters.includes(currentAddress);
  
  return (
    <>
      <UserRoleProvider>
      {isConnected ? (
        <>
          <div className="container">
            <ProgressBar workflowStatus={workflowStatus} />
            <UserRole isOwner={isOwner} isVoter={isVoter} />
            <p className='flex justify-center'>
              {isOwner && workflowStatus < 5 && <NextWorkflowButton workflowStatus={workflowStatus} />}
            </p>
            <div className="flex flex-row justify-center my-24 space-x-20">
              <div className="w-3/6 bg-white p-4 rounded-lg shadow-xl">
                <RegisterVoter isOwner={isOwner} workflowStatus={workflowStatus} />
              </div>
              <div className="w-3/6 bg-white p-4 rounded-lg shadow-xl">
                <Proposal isVoter={isVoter} workflowStatus={workflowStatus} />
              </div>
            </div>
            {workflowStatus === 5 && (
              <div className="flex flex-row justify-center my-24 space-x-20">
                <div className="w-3/6 bg-white p-4 rounded-lg shadow-xl">
                  <WinningProposal />
                </div>
              </div>
            )}
            <Voting />
          </div>
        </>
      ) : (
        <NotConnected />
      )}
      </UserRoleProvider>
    </>
  );
}
