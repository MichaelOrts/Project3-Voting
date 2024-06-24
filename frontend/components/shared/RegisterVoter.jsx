'use client';
import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { contractAddress, contractAbi } from '@/constant';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import useVoters from '@/hooks/useVoters';
import Voter from "@/components/shared/Voter";
import { useToast } from "../ui/use-toast";

const RegisterVoter = ({isOwner, workflowStatus}) => {

  const [voterAddress, setVoterAddress] = useState('');
  const { votersAddress, getVoterEvents } = useVoters([]);

  const { toast } = useToast();

  const { data : hash, error, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess, error: errorConfirmation } = useWaitForTransactionReceipt({hash})

  useEffect(() => {
    if(isSuccess) {
        getVoterEvents();
    }
    if(errorConfirmation) {
        toast({
            title: errorConfirmation.message,
            status: error,
            duration: 5000,
            isClosable: true,
            className: "bg-red-200"
        });
    }
}, [isSuccess, errorConfirmation])

useEffect(() => {
  if(isSuccess){
  toast({
    title: "Voter Registered",
    description: "address : " + votersAddress[votersAddress.length - 1],
    duration: 5000,
    className: "bg-lime-200"
})
}
}, [votersAddress])


  const handleAddVoter = async () => {
   
      await writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'addVoter',
        args: [voterAddress],
      });
      
      setVoterAddress('');
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-2 mt-4">Voters</h2>
      <ul className="list-disc m-2 pl-5 w-5/6">
        {votersAddress.map((voter, index) => (
            <Voter voterAddress={voter} key={crypto.randomUUID()}/>
        ))}
      </ul>

      {isOwner && workflowStatus === 0 ? (
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
      </>
      ) : (
         <>
         {workflowStatus != 0 && <p className='text-red-500'>Adding register voters is currently closed</p>}
         {!isOwner && <p className='text-red-500'>Only the owner can add voters</p>}
        </>
      )}
    </div>
  );
};

export default RegisterVoter;
