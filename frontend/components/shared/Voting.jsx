'use client';
import { useState, useEffect } from "react";

import { contractAddress, contractAbi } from "@/constant";
import { useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseAbi } from "viem";

import { hardhatClient as publicClient } from "@/utils/client";

import Voter from "./Voter";
import Event from "./Event";
import VotingStates from "./VotingStates";
import { useToast } from "../ui/use-toast";

const Voting = () => {

    const { address } = useAccount();

    const { toast } = useToast();

    const [events, setEvents] = useState([]);
    const [votersAddress, setVotersAddress] = useState([]);

    const { data: workflowStatus, refetch } = useReadContract({
        address: contractAddress,
            abi: contractAbi,
            functionName: 'workflowStatus',
            account: address
    })

    const {data: hash, error, isPending: setIsPending, writeContract } = useWriteContract({
        /* mutation: {
             onSuccess: () => {
 
             },
             onError: (error) => {
 
             }
         }*/
     })

    const { isLoading: isConfirming, isSuccess, error: errorConfirmation } = useWaitForTransactionReceipt({hash})

    const refetchEverything = async() => {
        await refetch();
        await getEvents();
    }

    const getEvents = async() => {
        // On récupère tous les events Voting
        const eventsLog = await publicClient.getLogs({
            address: contractAddress,
            events: parseAbi(
                ['event VoterRegistered(address voterAddress)', 'event WorkflowStatusChange(uint8 previousStatus,uint8 newStatus)', 
                    'event ProposalRegistered(uint proposalId)', 'event Voted(address voter, uint proposalId)']),
            // du premier bloc
            fromBlock: 0n,
            // jusqu'au dernier
            toBlock: 'latest' // Pas besoin valeur par défaut
        })
        // Et on met ces events dans le state "events" en formant un objet cohérent pour chaque event
        setEvents(eventsLog.map(
            log => ({
                name: log.eventName.toString(),
                voter: log.args.voterAddress?.toString() || log.args.voter?.toString(),
                previousStatus: log.args.previousStatus?.toString(),
                newStatus: log.args.newStatus?.toString(),
                proposalId: log.args.proposalId?.toString()
            })
        ))
        setVotersAddress(eventsLog.filter(log => (log.eventName==="VoterRegistered")).map(
            log => (log.args.voterAddress)
        ))
      }

      useEffect(() => {
        if(isSuccess) {
            toast({
                title: "Congratulations",
                description: "Your transaction has been succedeed",
                className: "bg-lime-200"
            })
            refetchEverything();
        }
        if(errorConfirmation) {
            toast({
                title: errorConfirmation.message,
                status: error,
                duration: 3000,
                isClosable: true
            });
        }
    }, [isSuccess, errorConfirmation])

      useEffect(() => {
        const getAllEvents = async() => {
            if(address !== 'undefined') {
              await getEvents();
            }
        }
        getAllEvents()
    }, [address])

    return (
        <div>
            <h2 className="mb-4 text-4xl">Voters</h2>
            <div className="flex flex-col w-full">
                {votersAddress.length > 0 && votersAddress.map((voterAddress) => {
                    return (
                        <Voter voterAddress={voterAddress} key={crypto.randomUUID()}/>
                    )
                })}
            </div>
            <h2 className="mb-4 text-4xl">Events</h2>
            <div className="flex flex-col w-full">
                {events.length > 0 && events.map((event) => {
                    return (
                        <Event event={event} key={crypto.randomUUID()}/>
                    )
                })}
            </div>
            <VotingStates currentState={workflowStatus}/>
        </div>
    )
}

export default Voting