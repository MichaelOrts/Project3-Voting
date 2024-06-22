import { Button } from '../../components/ui/button';
import { useWriteContract } from 'wagmi';
import { contractAddress, contractAbi } from '@/constant';

const NextWorkflowButton = ({workflowStatus}) => {
  const { writeContract } = useWriteContract()

  let isConfirming = false;

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
console.log('functionName', functionName)
    if (functionName) {
      await writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName
        });
     };
  };


  const handleNextWorkflow = async () => {
    try {
      isConfirming = true;
      await advanceWorkflow(workflowStatus);

      isConfirming = false;
    } catch (error) {
      isConfirming = false;
    }
  };


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