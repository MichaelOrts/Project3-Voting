import React, { useEffect, useState } from 'react';

const UserRole = ({ isOwner, isVoter }) => {
  const [role, setRole] = useState('');

  useEffect(() => {
    if (isOwner) {
      setRole('Owner 😎');
    } else if (isVoter) {
      setRole('Voter 😊');
    } else {
      setRole('No Role 😢');
    }
  }, [isOwner, isVoter]);

  return (
    <>
      <div className="bg-white rounded-lg shadow-xl w-1/6 m-auto mt-12 py-5">
        <h2 className="text-xl text-center font-bold">Your Role</h2>
        <div className="text-lg text-center">{role}</div>
      </div>
    </>
  );   
};

export default UserRole;
