import { useState, useEffect } from 'react';
import { parseAbi } from 'viem';
import { contractAddress, contractAbi } from '@/constant';
import { hardhatClient as publicClient } from '@/utils/client';
import { useAccount } from 'wagmi';
import useVoters from '@/hooks/useVoters';


const useProposals = () => {
  const { address } = useAccount();
  const { votersAddress } = useVoters();
  const [proposals, setProposals] = useState([]);

  const isVoter = votersAddress?.includes(address) || false;

  const getProposalEvents = async () => {
    const eventsLog = await publicClient.getLogs({
      address: contractAddress,
      events: parseAbi(['event ProposalRegistered(uint proposalId)']),
      fromBlock: 0n,
      toBlock: 'latest',
    });

    const proposalIds = eventsLog.map((log) => log.args.proposalId.toString());

    if(isVoter) {
      // Fetch descriptions for each proposalId
      const proposalsWithDescription = await Promise.all(proposalIds.map(async (id) => {
        const description = await publicClient.readContract({
          address: contractAddress,
          abi: contractAbi,
          functionName: 'getOneProposal',
          args: [id],
          account: address,
        });
        return { id, ...description };
      }));
  
      setProposals(proposalsWithDescription);
    }
  };

  useEffect(() => {
    getProposalEvents();
  }, []);

  return { proposals, getProposalEvents };
};

export default useProposals;
