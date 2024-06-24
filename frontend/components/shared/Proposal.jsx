'use client';
import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { contractAddress, contractAbi } from '@/constant';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import useProposals from '@/hooks/useProposals';
import { useUserRole } from '@/context/UserRoleContext';
import useVotes from '@/hooks/useVotes'

import { useToast } from "../ui/use-toast";
import { Table, TableCell, TableHead, TableHeader, TableRow, TableBody } from '../ui/table';

const Proposal = ({isVoter, workflowStatus}) => {
  const { voter } = useUserRole();
  const [proposal, setProposal] = useState('');
  const { proposals, getProposalEvents } = useProposals();
  const { votes, getVoteEvents } = useVotes();

  const { toast } = useToast();

  const {data: hash, error, writeContract } = useWriteContract()

  const { isLoading: isConfirming, isSuccess, error: errorConfirmation } = useWaitForTransactionReceipt({hash})

  const [hasVoted, setHasVoted] = useState(voter?.hasVoted || false);

  const handleAddProposal = async () => {
    await writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'addProposal',
      args: [proposal],
    });
    setProposal('');
  };

  useEffect(() => {
    if(isSuccess) {
      if(workflowStatus === 3){
        getVoteEvents();
      }
      getProposalEvents();
    }
    if(errorConfirmation) {
        toast({
            title: errorConfirmation.message,
            status: error,
            duration: 5000,
            isClosable: true
        });
    }
}, [isSuccess, errorConfirmation])

  const handleVote = async (proposalId) => {
    await writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'setVote',
      args: [proposalId]
    });
  };

  useEffect(() => {
    if(workflowStatus === 1 && isSuccess){
        toast({
          title: "Proposal Registered",
          description: "id : " + proposals[proposals.length - 1].id + "     description : " + proposals[proposals.length - 1].description,
          duration: 5000,
          className: "bg-lime-200"
      })
    }
  }, [proposals])

  useEffect(() => {
    if(isSuccess){
        toast({
          title: "Voted",
          description: "voter : " + votes[votes.length - 1].voter + "      proposal id : " + votes[votes.length - 1].proposalId,
          duration: 5000,
          className: "bg-lime-200"
      })
      setHasVoted(true);
    }
  }, [votes])

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl text-center font-bold mb-2 mt-4">Proposals</h2>
      <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Votes Count</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
          {proposals.map((proposal, index) => (
            <TableRow key={crypto.randomUUID()}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{proposal?.description}</TableCell>
              <TableCell>{proposal?.voteCount.toString()}</TableCell>
              {workflowStatus === 3 && isVoter && (
                <Button
                  onClick={() => handleVote(proposal.id)}
                  className="w-1/6 bg-green-500 text-white px-8 py-2 rounded-lg m-2"
                  disabled={isConfirming || hasVoted}
                >
                  {isConfirming ? 'Voting...' : 'Vote'}
                </Button>
              )}
            </TableRow>
          ))}
        </TableBody>
    </Table>
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
      </>
      ) : (
         <>
         {workflowStatus != 1 && <p className='text-red-500'>Adding proposals is currently closed</p>}
         {!isVoter && <p className='text-red-500 text-center'>Only voter can add proposals or vote</p>}
        </>
      )}
    </div>
  );
};

export default Proposal;
