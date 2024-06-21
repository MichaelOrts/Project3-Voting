'use client';
import { useState, useEffect } from "react";
import { contractAddress, contractAbi } from "@/constant";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseAbi } from "viem";
import { hardhatClient as publicClient } from "@/utils/client";

const Proposal = () => {
    const { address } = useAccount();
    const [events, setEvents] = useState([]);
    const [proposal, setProposal] = useState('');

    const { data: hash, error, isPending: setIsPending, writeContract } = useWriteContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'addProposal',
        args: [proposal]
    });

    const { isLoading: isConfirming, isSuccess, error: errorConfirmation } = useWaitForTransactionReceipt({ hash });

    const refetchEverything = async () => {
        await refetch();
        await getEvents();
    };

    const getEvents = async () => {
        const eventsLog = await publicClient.getLogs({
            address: contractAddress,
            events: parseAbi([
                'event VoterRegistered(address voterAddress)',
                'event WorkflowStatusChange(uint8 previousStatus,uint8 newStatus)',
                'event ProposalRegistered(uint proposalId)',
                'event Voted(address voter, uint proposalId)'
            ]),
            fromBlock: 0n,
            toBlock: 'latest'
        });
        setEvents(eventsLog.map(log => ({
            name: log.eventName.toString(),
            voter: log.args.voterAddress?.toString() || log.args.voter?.toString(),
            previousStatus: log.args.previousStatus?.toString(),
            newStatus: log.args.newStatus?.toString(),
            proposalId: log.args.proposalId?.toString()
        })));
    };

    useEffect(() => {
        if (isSuccess) {
            toast({
                title: "Congratulations",
                description: "Your transaction has been succedeed",
                className: "bg-lime-200"
            });
            refetchEverything();
        }
        if (errorConfirmation) {
            toast({
                title: errorConfirmation.message,
                status: error,
                duration: 3000,
                isClosable: true
            });
        }
    }, [isSuccess, errorConfirmation]);

    useEffect(() => {
        const getAllEvents = async () => {
            if (address !== 'undefined') {
                await getEvents();
            }
        };
        getAllEvents();
    }, [address]);

    const handleAddProposal = async () => {
        await writeContract();
    };

    return (
    <div className="w-full max-w-xl mx-auto p-4">
            <h2 className="mb-4 text-4xl text-center">Proposals</h2>
            <div className="flex flex-col w-full">
                <input
                    type="text"
                    placeholder="Enter your proposal"
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                    className="mb-2 p-2 border border-gray-300 rounded w-full"
                />
                <button
                    onClick={handleAddProposal}
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                    disabled={isConfirming || !proposal}
                >
                    {isConfirming ? 'Submitting...' : 'Add Proposal'}
                </button>
            </div>
        </div>
    );
};

export default Proposal;
