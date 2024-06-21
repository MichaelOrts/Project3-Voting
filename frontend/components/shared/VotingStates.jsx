import { Badge } from "@/components/ui/badge"

const VotingStates = ({ currentState }) => {

  function getStyle(isCurrentState){
    return isCurrentState? "bg-pink-600 text-bold text-lg" : "bg-pink-400";
  }

  return (
    <div className="flex flex-row">
        <Badge className={getStyle(currentState==0)}>RegisteringVoters</Badge>
        <Badge className={getStyle(currentState==1)}>ProposalsRegistrationStarted</Badge>
        <Badge className={getStyle(currentState==2)}>ProposalsRegistrationEnded</Badge>
        <Badge className={getStyle(currentState==3)}>VotingSessionStarted</Badge>
        <Badge className={getStyle(currentState==4)}>VotingSessionEnded</Badge>
        <Badge className={getStyle(currentState==5)}>VotesTallied</Badge>
    </div>
  )
}

export default VotingStates