
'use client';
import NotConnected from "@/components/shared/NotConnected";
import ProgressBar from "@/components/shared/ProgressBar";
import Proposal from "@/components/shared/Proposal";
import Voting from "../components/shared/Voting"
import UserRole from "@/components/shared/UserRole";
import { contractAddress, contractAbi } from '../constant/index';
import { useAccount, useReadContract } from "wagmi";


const contractConfig = {
  address: contractAddress,
  abi: contractAbi
};

export default function Home() {

  const { isConnected } = useAccount();

 const { data: workflowStatusData, isError: isWorkflowStatusError } = useReadContract({
    ...contractConfig,
    functionName: 'workflowStatus',
  });

  const { data: ownerAddress, isError: isOwnerError } = useReadContract({
    ...contractConfig,
    functionName: 'owner',
  });

  // Créer la fonction pour récupérer les votants dans le smart contract
  const { data: getAllVoters, isError: isGetAllVotersError } = useReadContract({
    ...contractConfig,
    functionName: 'getAllVoters',
  });
  

  if (isWorkflowStatusError || isOwnerError || isGetAllVotersError) {
    // Handle error
    return <div>Something went wrong</div>;
  }

  const workflowStatus = workflowStatusData || 1;
  const AllVoters = getAllVoters || [];


  return (
    <>
      {isConnected ? (
        <>
          <ProgressBar currentStep={workflowStatus} />
          <UserRole ownerAddress={ownerAddress} voters={AllVoters} />
          {workflowStatus === 1 && (
            // Registering Voters
            <div>Registering Voters</div>
          )}
          {workflowStatus === 2 && (
            // Proposals Registration Started
            <Proposal />
          )}
          {workflowStatus === 3 && (
            // Proposals Registration Ended
            <div>Proposals Registration Ended</div>
          )}
          {workflowStatus === 4 && (
            // Voting Session Started
            <Voting />
          )}
          {workflowStatus === 5 && (
            // Voting Session Ended
            <div>Voting Session Ended</div>
          )}
          {workflowStatus === 6 && (
            // Votes Tallied
            <div>Votes Tallied</div>
          )}
        </>
      ) : (
        <NotConnected />
      )}
    </>
  );
}