import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

const UserRole = ({ ownerAddress, voters }) => {
  const { address } = useAccount();
  const [role, setRole] = useState('');

  useEffect(() => {
    if (address === ownerAddress) {
      setRole('Owner');
    } else if (voters.includes(address)) {
      setRole('Voter');
    } else {
      setRole('No Role');
    }
  }, [address, ownerAddress, voters]);

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-md shadow-md">
      <h3 className="text-xl font-semibold">Your Role</h3>
      <p className="text-lg text-center">{role}</p>
    </div>
  );
};

export default UserRole;
