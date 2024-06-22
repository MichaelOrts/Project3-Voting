'use client';
import { useState } from 'react';
import { useWriteContract } from 'wagmi';
import { contractAddress, contractAbi } from '@/constant';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

import useProposals from '@/hooks/useProposals';
import useVotes from '@/hooks/useVotes';

const Proposal = ({isVoter, workflowStatus}) => {
  const [proposal, setProposal] = useState();
  const [status, setStatus] = useState('');
  const { proposals } = useProposals();
  const { votes } = useVotes();

  const { writeContract } = useWriteContract()

  let isConfirming = false;

  const handleAddProposal = async () => {
    try {
      isConfirming = true;
      await writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'addProposal',
        args: [proposal]
      });
      setStatus('Proposal added successfully');
      setProposal('');
      isConfirming = false;
    } catch (error) {
      setStatus(`Error: ${error.message}`);
      isConfirming = false;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-2 mt-4">Proposals</h2>
      <ul className="list-disc pl-5">
        {proposals.map((proposal, index) => (
          <li key={index} className="text-gray-700">{proposal.description} - Votes: {proposal.voteCount}</li>
        ))}
      </ul>

        {isVoter && workflowStatus === 1 ? (
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
           <>
            {workflowStatus != 1 && <p className='text-red-500'>Adding proposals is currently closed</p>}
            {!isVoter && <p className='text-red-500'>Only voters can add proposals</p>}
           </>
        )}
    </div>
  );
};

export default Proposal;
