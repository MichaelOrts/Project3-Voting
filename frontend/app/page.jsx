
'use client';
import NotConnected from "@/components/shared/NotConnected";
import ProgressBar from "@/components/shared/ProgressBar";
import Proposal from "@/components/shared/Proposal";
import RegisterVoter from "@/components/shared/RegisterVoter";
import Voting from "../components/shared/Voting"
import UserRole from "@/components/shared/UserRole";
import WinningProposal from "@/components/shared/WinningProposal";
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

  //const workflowStatus = workflowStatusData || 0;
  const workflowStatus = 0;
  //const allVoters = getAllVoters || [];
  const allVoters = [];
  //const isOwner = ownerAddress === useAccount().address;
  const isOwner = true;
  //const isVoter = AllVoters.includes(useAccount().address);
  const isVoter = true;

  const renderContent = () => {
    if (!isConnected) return <NotConnected />;

    switch (workflowStatus) {
      case 0:
        return isOwner ? <RegisterVoter /> : <div>Registering Voters</div>;
      case 1:
        return isOwner || isVoter ? <Proposal /> : <div>Proposals Registration Started</div>;
      case 2:
        return <div>Proposals Registration Ended</div>;
      case 3:
        return isOwner || isVoter ? <Voting /> : <div>Voting Session Started</div>;
      case 4:
        return <div>Voting Session Ended</div>;
      case 5:
        return <WinningProposal />;
      default:
        return null;
    }
  };


  return (
    <>
      {isConnected ? (
        <>
          <div className="container">
            <ProgressBar currentStep={workflowStatus} />
            <UserRole isOwner={isOwner} isVoter={isVoter} />

            <div className="flex flex-row justify-center my-24 space-x-20">
          
              <div className="w-3/6 bg-white p-4 rounded-lg shadow-xl">
                <h2 className="text-xl text-center font-bold mb-2">Registered Voters</h2>
                <ul className="list-disc pl-5">
                  {allVoters.map((voter, index) => (
                    <li key={index} className="text-gray-700">{voter}</li>
                  ))}
                </ul>
              </div>

              <div className="w-3/6 bg-white p-4 rounded-lg shadow-xl">
                <h2 className="text-xl text-center font-bold mb-2">Proposals</h2>
                  <Proposal />
              </div>

            </div>
      
          </div>
        </>
      ) : (
        <NotConnected />
      )}
    </>
  );
}