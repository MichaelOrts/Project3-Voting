import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { contractAddress, contractAbi } from '@/constant';
import { useToast } from "../ui/use-toast";
import useWorkflowStatus from '@/hooks/useWorkflowStatus';

const NextWorkflowButton = ({workflowStatus}) => {

  const { workflowStatusEvents, getWorkflowStatusEvents } = useWorkflowStatus([]);

  const { toast } = useToast();

  const { data : hash, error, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess, error: errorConfirmation } = useWaitForTransactionReceipt({hash})

  const advanceWorkflow = async (workflowStatus) => {
    let functionName;

    switch (workflowStatus) {
      case 0:
        functionName = 'startProposalsRegistering';
        break;
      case 1:
        functionName = 'endProposalsRegistering';
        break;
      case 2:
        functionName = 'startVotingSession';
        break;
      case 3:
        functionName = 'endVotingSession';
        break;
      case 4:
        functionName = 'tallyVotes';
        break;
      default:
        functionName = null;
    }

    if (functionName) {
      await writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName
        });
     };
  };


  const handleNextWorkflow = async () => {
      await advanceWorkflow(workflowStatus);
  };

  useEffect(() => {
    if(isSuccess) {
        getWorkflowStatusEvents();
    }
    if(errorConfirmation) {
        toast({
            title: errorConfirmation.message,
            status: error,
            duration: 5000,
            isClosable: true,
            className: "bg-red-200"
        });
    }
}, [isSuccess, errorConfirmation])

useEffect(() => {
  if(isSuccess){
      toast({
        title: "Workflow Status Change",
        description: "previous status : " + workflowStatusEvents[workflowStatusEvents.length - 1].previousStatus 
                          + "     new status : " + workflowStatusEvents[workflowStatusEvents.length - 1].newStatus,
        duration: 5000,
        className: "bg-lime-200"
    })
  }
}, [workflowStatusEvents])


  return (
    <>
        <Button
          onClick={handleNextWorkflow}
          className="bg-red-500 text-white mt-12 px-4 py-2 rounded-full w-1/6"
          disabled={isConfirming}
        >
            Move to next status
        </Button>
    </>
  )
}

export default NextWorkflowButton