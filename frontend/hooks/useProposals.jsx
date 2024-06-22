import { useState, useEffect } from 'react';
import { parseAbi } from 'viem';
import { contractAddress } from '@/constant';
import { hardhatClient as publicClient } from '@/utils/client';

const useProposals = () => {
  const [proposals, setProposals] = useState([]);

  const getProposalEvents = async () => {
    const eventsLog = await publicClient.getLogs({
      address: contractAddress,
      events: parseAbi(['event ProposalRegistered(uint proposalId)']),
      fromBlock: 0n,
      toBlock: 'latest',
    });

    setProposals(
      eventsLog.map((log) => ({
        id: log.args.proposalId.toString(),
        description: log.args.description,  // Assuming description is part of event args
      }))
    );
  };

  useEffect(() => {
    getProposalEvents();
  }, []);

  return { proposals, getProposalEvents };
};

export default useProposals;
