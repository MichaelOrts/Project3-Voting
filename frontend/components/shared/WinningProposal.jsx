'use client';
import { useReadContract } from 'wagmi';
import { contractAddress, contractAbi } from '@/constant';

const WinningProposal = () => {
  const { data: winningProposalId, isError: isWinningProposalIdError } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'winningProposalID',
  });

  const { data: winningProposal, isError: isWinningProposalError } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'getOneProposal',
    args: [winningProposalId]
  });

  if (isWinningProposalIdError || isWinningProposalError) {
    return <div>Something went wrong</div>;
  }

  if (!winningProposal) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="mb-4 text-4xl">Winning Proposal</h2>
      <div className="w-full max-w-xl bg-white shadow-md rounded-lg p-4">
        <p className="text-lg font-semibold">Description:</p>
        <p className="mb-4">{winningProposal.description}</p>
        <p className="text-lg font-semibold">Vote Count:</p>
        <p>{winningProposal.voteCount}</p>
      </div>
    </div>
  );
};

export default WinningProposal;
