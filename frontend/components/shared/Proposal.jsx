'use client';
import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from 'wagmi';
import { contractAddress, contractAbi } from '@/constant';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

const Proposal = ({isVoter}) => {
  const [proposal, setProposal] = useState('');
  const [status, setStatus] = useState('');
  const [allProposals, setAllProposals] = useState([]);

  const { data: proposalsData, isError: isProposalsError } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'getAllProposals',
  });

  const { data: hash, error, isPending: setIsPending, writeContract } = useWriteContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'addProposal',
    args: [proposal]
  });

  const { isLoading: isConfirming, isSuccess, error: errorConfirmation } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (proposalsData) {
      setAllProposals(proposalsData);
    }
  }, [proposalsData]);

  const handleAddProposal = async () => {
    try {
      await writeContract();
      setStatus('Proposal added successfully');
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-2 mt-4">All Proposals</h2>
      <ul className="list-disc pl-5">
        {allProposals.map((proposal, index) => (
          <li key={index} className="text-gray-700">{proposal.description} - Votes: {proposal.voteCount}</li>
        ))}
      </ul>

        {isVoter ? (
            <>
        <Input 
            type="text" 
            placeholder="Enter your proposal" 
            value={proposal} 
            onChange={(e) => setProposal(e.target.value)} 
            className="mb-2 p-2 border border-gray-300 rounded w-3/6"
        />
        <Button
            onClick={handleAddProposal}
            className="bg-blue-500 text-white px-4 py-2 rounded w-3/6"
            disabled={isConfirming || !proposal}
        >
            {isConfirming ? 'Submitting...' : 'Add Proposal'}
        </Button>
        {status && <p className="mt-2 text-sm text-green-500">{status}</p>}
        </>
        ) : (
           <></>
        )}
    </div>
  );
};

export default Proposal;
