import { useEffect, useState } from 'react';
import { useAccount } from "wagmi";

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

import { useUserRole } from '@/context/UserRoleContext';

const UserRole = ({ isOwner, isVoter })  => {
    const { address } = useAccount();
    const { voter } = useUserRole();

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
        <Card className="flex bg-white rounded-lg shadow-xl w-3/6 m-auto mt-12 py-5">
            <Badge className="flex flex-col items-start">
                <div>
                    <Label className="text-base m-2 font-bold">Address</Label>
                    <Label className="text-sm m-2 text-blue-500">{address}</Label>
                </div>
                <div>
                    <Label className="text-base m-2 font-bold">Your Role</Label>
                    <Label className="text-sm m-2 text-blue-500">{role}</Label>
                </div>
            </Badge>
        </Card>
    )
}

export default UserRole;