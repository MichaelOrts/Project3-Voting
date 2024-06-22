'use client';
import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { contractAddress, contractAbi } from '@/constant';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

const RegisterVoter = () => {
  const [voterAddress, setVoterAddress] = useState('');
  const [status, setStatus] = useState('');

  const { data: hash, error, isPending: setIsPending, writeContract } = useWriteContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'addVoter',
    args: [voterAddress]
  });

  const { isLoading: isConfirming, isSuccess, error: errorConfirmation } = useWaitForTransactionReceipt({ hash });

  const handleAddVoter = async () => {
    try {
      await writeContract();
      setStatus('Voter added successfully');
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="mt-4 mb-4 text-4xl">Register Voter</h2>
      <Input 
        type="text" 
        placeholder="Voter Address" 
        value={voterAddress} 
        onChange={(e) => setVoterAddress(e.target.value)} 
        className="mb-2 p-2 border border-gray-300 rounded w-full"
      />
      <Button
        onClick={handleAddVoter}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        disabled={isConfirming || !voterAddress}
      >
        {isConfirming ? 'Submitting...' : 'Add Voter'}
      </Button>
      {status && <p className="mt-2 text-sm text-red-500">{status}</p>}
    </div>
  );
};

export default RegisterVoter;
