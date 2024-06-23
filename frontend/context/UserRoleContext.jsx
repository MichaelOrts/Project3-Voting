import { createContext, useContext, useState, useEffect } from 'react';
import { contractAddress, contractAbi } from "@/constant";
import { hardhatClient as publicClient } from "@/utils/client";
import { useAccount } from "wagmi";

const UserRoleContext = createContext(null);

export const UserRoleProvider = ({ children }) => {
  const { address } = useAccount();
  const [voter, setVoter] = useState(null);

  useEffect(() => {
      const getVoterData = async () => {
        try {
          const data = await publicClient.readContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: 'getVoter',
            args: [address],
            account: address,
          });
          setVoter(data);
        } catch (error) {
          console.error("Error fetching voter data:", error);
        }
      };
      
      if (address) {
        getVoterData();
      }
    }, [address]);

  return (
    <UserRoleContext.Provider value={{ voter }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => {
  return useContext(UserRoleContext);
};
