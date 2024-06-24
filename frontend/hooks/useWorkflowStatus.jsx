import { useState, useEffect } from 'react';
import { parseAbi } from 'viem';
import { contractAddress } from '@/constant';
import { hardhatClient as publicClient } from '@/utils/client';

const useWorkflowStatus = () => {
  const [workflowStatusEvents, setWorkflowStatus] = useState([]);

  const getWorkflowStatusEvents = async () => {
    const eventsLog = await publicClient.getLogs({
      address: contractAddress,
      events: parseAbi(['event WorkflowStatusChange(uint8 previousStatus,uint8 newStatus)']),
      fromBlock: 0n,
      toBlock: 'latest',
    });

    setWorkflowStatus(
      eventsLog.map((log) => ({previousStatus : log.args.previousStatus.toString(),
        newStatus : log.args.newStatus.toString()}))
    );
  };

  useEffect(() => {
    getWorkflowStatusEvents();
  }, []);

  return { workflowStatusEvents, getWorkflowStatusEvents };
};

export default useWorkflowStatus;
