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
  const [status, setStatus] = useState('');
  const { proposals, getProposalEvents } = useProposals();
  const { votes, getVoteEvents } = useVotes();

  const { toast } = useToast();

  const {data: hash, error, isPending: setIsPending, writeContract } = useWriteContract()

  const { isLoading: _isConfirming, isSuccess, error: errorConfirmation } = useWaitForTransactionReceipt({hash})

  const hasVoted = voter?.hasVoted || false;
  let isConfirming = false;

  const handleAddProposal = async () => {
    try {
      isConfirming = true;
      await writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'addProposal',
        args: [proposal],
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

  useEffect(() => {
    if(isSuccess) {
        getProposalEvents();
        getVoteEvents();
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

  useEffect(() => {
    if(isSuccess){
        toast({
          title: "Proposal Registered",
          description: "id : " + proposals[proposals.length - 1],
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
    }
  }, [votes])

  return (
    <div className="flex flex-col items-stretch">
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
              <TableCell>{index}</TableCell>
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
    </div>
  );
};

export default Proposal;
