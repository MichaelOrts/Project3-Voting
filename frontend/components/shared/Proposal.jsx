'use client';
import { useState } from 'react';
import { useWriteContract } from 'wagmi';
import { contractAddress, contractAbi } from '@/constant';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import useProposals from '@/hooks/useProposals';
import { useUserRole } from '@/context/UserRoleContext';

const Proposal = ({isVoter, workflowStatus}) => {
  const { voter } = useUserRole();
  const [proposal, setProposal] = useState('');
  const [status, setStatus] = useState('');
  const { proposals } = useProposals();

  const { writeContract } = useWriteContract()

  const hasVoted = voter?.hasVoted || false;
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
      setHasVoted(true);
      isConfirming = false;
    } catch (error) {
      setStatus(`Error: ${error.message}`);
      isConfirming = false;
    }
  };

  const handleVote = async (proposalId) => {
    try {
      isConfirming = true;
      await writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'setVote',
        args: [proposalId]
      });

      setStatus('Vote cast successfully');
      isConfirming = false;
    } catch (error) {
      setStatus(`Error: ${error.message}`);
      isConfirming = false;
    }
  };

  return (
    <div className="flex flex-col items-stretch">
      <h2 className="text-xl text-center font-bold mb-2 mt-4">Proposals</h2>
      <ul className="list-disc p-4">
        {proposals.map((proposal, index) => (
          <li key={index} className="text-gray-700 flex items-center">
            <span className='w-4/6'><strong>{index + 1}/</strong> {proposal.description}</span> 
            <span className='w-1/6'><strong>Votes: </strong> {proposal?.voteCount?.toString() || 0}</span>
            {workflowStatus === 3 && isVoter && (
              <Button
                onClick={() => handleVote(proposal.id)}
                className="w-1/6 bg-green-500 text-white px-4 py-2 rounded-lg m-2"
                disabled={isConfirming || hasVoted}
              >
                {isConfirming ? 'Voting...' : 'Vote'}
              </Button>
            )}
          </li>
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
            {workflowStatus != 1 && <p className='text-red-500 text-center'>Adding proposals is currently closed</p>}
            {!isVoter && <p className='text-red-500 text-center'>Only voters can add proposals</p>}
           </>
        )}
    </div>
  );
};

export default Proposal;
