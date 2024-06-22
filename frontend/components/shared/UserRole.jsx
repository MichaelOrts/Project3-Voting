import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

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
    <Card className="my-4 px-52 bg-gray-100 rounded-md shadow-2xl border-solid border-2 border-blue-400">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Your Role</CardTitle>
      </CardHeader>
      <CardContent className="text-lg text-center">
        {role}
      </CardContent>
    </Card> 
  );   
};

export default UserRole;
