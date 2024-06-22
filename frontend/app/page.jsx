
'use client';
import NotConnected from "@/components/shared/NotConnected";
import ProgressBar from "@/components/shared/ProgressBar";
import Proposal from "@/components/shared/Proposal";
import RegisterVoter from "@/components/shared/RegisterVoter";
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
  // const { data: getAllVoters, isError: isGetAllVotersError } = useReadContract({
  //   ...contractConfig,
  //   functionName: 'getAllVoters',
  // });
  

  if (isWorkflowStatusError || isOwnerError) {
    // Handle error
    return <div>Something went wrong</div>;
  }

  //const workflowStatus = workflowStatusData || 1;
  const workflowStatus = 1;
  //const AllVoters = getAllVoters || [];
  const AllVoters = [];
  //const isOwner = ownerAddress === useAccount().address;
  const isOwner = true;
  //const isVoter = AllVoters.includes(useAccount().address);
  const isVoter = true;

  const renderContent = () => {
    if (!isConnected) return <NotConnected />;

    switch (workflowStatus) {
      case 1:
        return isOwner ? <RegisterVoter /> : <div>Registering Voters</div>;
      case 2:
        return isOwner || isVoter ? <Proposal /> : <div>Proposals Registration Started</div>;
      case 3:
        return <div>Proposals Registration Ended</div>;
      case 4:
        return isOwner || isVoter ? <Voting /> : <div>Voting Session Started</div>;
      case 5:
        return <div>Voting Session Ended</div>;
      case 6:
        return <div>Votes Tallied</div>;
      default:
        return null;
    }
  };


  return (
    <>
      {isConnected ? (
        <>
          <ProgressBar currentStep={workflowStatus} />
          <UserRole isOwner={isOwner} isVoter={isVoter} />
          {renderContent()}
        </>
      ) : (
        <NotConnected />
      )}
    </>
  );
}