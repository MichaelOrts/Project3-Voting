import { useState, useEffect } from 'react';
import { parseAbi } from 'viem';
import { contractAddress } from '@/constant';
import { hardhatClient as publicClient } from '@/utils/client';

const useVoters = () => {
  const [votersAddress, setVotersAddress] = useState([]);

  const getVoterEvents = async () => {
    const eventsLog = await publicClient.getLogs({
      address: contractAddress,
      events: parseAbi(['event VoterRegistered(address voterAddress)']),
      fromBlock: 0n,
      toBlock: 'latest',
    });

    setVotersAddress(
      eventsLog.map((log) => log.args.voterAddress.toString())
    );
  };

  useEffect(() => {
    getVoterEvents();
  }, []);

  return { votersAddress, getVoterEvents };
};

export default useVoters;
