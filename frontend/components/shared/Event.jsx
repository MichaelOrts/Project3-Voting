import {
    Card
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const Event = ({ event }) => {
  function showParam(name, value) {
    if(value){
      return (
        <div>
          <p className="ml-2">{name} : <span className="font-bold">{value}</span></p>
        </div>
      )
    }
  }

  function getColor(name) {
    switch(name){
      case "VoterRegistered": return "bg-purple-500";
      case "WorkflowStatusChange": return "bg-red-500";
      case "ProposalRegistered": return "bg-blue-500";
      case "Voted": return "bg-green-500";
      default: return "bg-grey-500";
    }
  }

  return (
    <Card className="p-4 mb-2">
        <div className="flex items-center">
            <Badge className={getColor(event.name)}>{event.name}</Badge>
            {showParam('Voter', event.voter)}
            {showParam('Previous Status', event.previousStatus)}
            {showParam('New Status', event.newStatus)}
            {showParam('Proposal Id', event.proposalId)}
        </div>
    </Card>
  )
}

export default Event