'use client';
import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from 'wagmi';
import { contractAddress, contractAbi } from '@/constant';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

const RegisterVoter = ({isOwner}) => {
  useAccount();
  const [voterAddress, setVoterAddress] = useState('');
  const [status, setStatus] = useState('');
  const [allVoters, setAllVoters] = useState([]);

  const { data: votersData, isError: isVotersError } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'getAllVoters',
  });

  const { data: hash, error, isPending: setIsPending, writeContract } = useWriteContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'addVoter',
    args: [voterAddress]
  });

  const { isLoading: isConfirming, isSuccess, error: errorConfirmation } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (votersData) {
      setAllVoters(votersData);
    }
  }, [votersData]);

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
      <h2 className="text-xl font-bold mb-2 mt-4">Registered Voters</h2>
      <ul className="list-disc pl-5">
        {allVoters.map((voter, index) => (
          <li key={index} className="text-gray-700">{voter}</li>
        ))}
      </ul>

      {isOwner ? (
        <>
        <Input 
        type="text" 
        placeholder="Voter Address" 
        value={voterAddress} 
        onChange={(e) => setVoterAddress(e.target.value)} 
        className="mb-2 p-2 border border-gray-300 rounded w-3/6"
        />
        <Button
          onClick={handleAddVoter}
          className="bg-blue-500 text-white px-4 py-2 rounded w-3/6"
          disabled={isConfirming || !voterAddress}
        >
          {isConfirming ? 'Submitting...' : 'Add Voter'}
        </Button>
        {status && <p className="mt-2 text-sm text-red-500">{status}</p>}
      </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default RegisterVoter;
