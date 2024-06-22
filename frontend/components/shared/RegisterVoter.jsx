'use client';
import { useState } from 'react';
import { useWriteContract } from 'wagmi';
import { contractAddress, contractAbi } from '@/constant';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import useVoters from '@/hooks/useVoters';


const RegisterVoter = ({isOwner}) => {
  const [voterAddress, setVoterAddress] = useState();
  const [status, setStatus] = useState('');
  const { votersAddress } = useVoters();

  const { writeContract } = useWriteContract()

  let isConfirming = false;

  const handleAddVoter = async () => {
    try {
      isConfirming = true;
      await writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'addVoter',
      args: [voterAddress],
      });
      
      setStatus('Voter added successfully');
      setVoterAddress('');
      isConfirming = false;
    } catch (error) {
        console.log('error', error);
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-2 mt-4">Registered Voters</h2>
      <ul className="list-disc m-2 pl-5">
        {votersAddress.map((voter, index) => (
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
        className="mt-8 mb-4 p-2 border border-gray-300 rounded w-3/6"
        />
        <Button
          onClick={handleAddVoter}
          className="bg-blue-500 text-white px-4 py-2 rounded w-3/6"
          disabled={isConfirming || !voterAddress}
        >
          {isConfirming ? 'Submitting...' : 'Add Voter'}
        </Button>
        {status && <p className="mt-2 text-sm text-green-500">{status}</p>}
      </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default RegisterVoter;
