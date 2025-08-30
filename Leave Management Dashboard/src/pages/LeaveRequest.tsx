import { useContext, useEffect } from "react"
import MainContext from "../context/MainContext"
import LeaveCard from "../components/LeaveCard";

const LeaveRequest = () => {
    const { getAllLeaves, ALLleaves } = useContext(MainContext);
    useEffect(() => {
        getAllLeaves()
    }, [])

    return (
        <>{ALLleaves.length > 0 ? ALLleaves.map((leave: any, index: number) => (
            <LeaveCard key={index}
                id={leave.id}
                startDate={leave.startDate}
                endDate={leave.endDate}
                reason={leave.reason}
                totalDays={leave.totalDays}
                Type={leave.Type}
                status={leave.status}
                createdAt={leave.createdAt}
                name={leave.user.name}
                role={leave.user.role}
                email={leave.user.email}
            />
        )) : (
            <div className="flex items-center justify-center">
                <h1 >No request leaves found</h1>
            </div>
        )
        }
        </>
    )
}

export default LeaveRequest
