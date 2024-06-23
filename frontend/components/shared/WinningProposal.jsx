'use client';
import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { contractAddress, contractAbi } from '@/constant';
import { hardhatClient as publicClient } from '@/utils/client';
import { useAccount } from 'wagmi';

const WinningProposal = () => {
  const { address } = useAccount();
  const [winningProposal, setWinningProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { data: winningProposalId, isError: isWinningProposalIdError } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'winningProposalID',
  });

  useEffect(() => {
    if (winningProposalId) {
      const getWinningProposal = async () => {
        try {
          const description = await publicClient.readContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: 'getOneProposal',
            args: [winningProposalId],
            account: address,
          });
          setWinningProposal(description);
          setLoading(false);
        } catch (error) {
          setError(error);
          setLoading(false);
        }
      };

      getWinningProposal();
    }
  }, [winningProposalId]);

  if (isWinningProposalIdError || error) {
    return <div className='text-center'>Something went wrong or you're not a voter</div>;
  }

  if (loading) {
    return <div className='text-center'>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl text-center font-bold my-6">🏆 Winning Proposal 🏆</h2>
      <p className="flex space-x-4 my-2">
        <span className="text-lg font-semibold">Description</span>
        <span className="text-lg">{winningProposal.description}</span>
      </p>
      <p className="flex space-x-4 my-2">
        <span className="text-lg font-semibold">Vote Count</span>
        <span className="text-lg">{winningProposal.voteCount.toString()}</span>
      </p>
    </div>

  );
};

export default WinningProposal;
