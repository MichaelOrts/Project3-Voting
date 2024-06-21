
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

  const workflowStatus = workflowStatusData || 0;
  const AllVoters = getAllVoters || [];


  return (
    <>
      {isConnected ? (
        <>
          <ProgressBar currentStep={workflowStatus} />
          <UserRole ownerAddress={ownerAddress} voters={AllVoters}/>
          <Proposal />
          <Voting />
        </>
      ) : (
        <NotConnected />
      )}
    </>
  );
}