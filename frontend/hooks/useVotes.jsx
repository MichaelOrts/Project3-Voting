import { useState, useEffect } from 'react';
import { parseAbi } from 'viem';
import { contractAddress } from '@/constant';
import { hardhatClient as publicClient } from '@/utils/client';

const useVotes = () => {
  const [votes, setVotes] = useState([]);

  const getVoteEvents = async () => {
    const eventsLog = await publicClient.getLogs({
      address: contractAddress,
      events: parseAbi(['event Voted(address voter, uint proposalId)']),
      fromBlock: 0n,
      toBlock: 'latest',
    });

    setVotes(
      eventsLog.map((log) => ({
        voter: log.args.voter.toString(),
        proposalId: log.args.proposalId.toString(),
      }))
    );
  };

  useEffect(() => {
    getVoteEvents();
  }, []);

  return { votes, getVoteEvents };
};

export default useVotes;
