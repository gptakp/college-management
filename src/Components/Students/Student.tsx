import { Tabs } from "antd";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import StudentDetails from "./StudentDetails";
import StudentAttendance from "./StudentAttendance";
import IdCard from "./IdCard";
import StudentMarks from "./StudentMarks";

export default function Student() {
    const navigate = useNavigate()
    const splitPaths = window.location.pathname.split("/")
    const studentId = splitPaths[2]

    useEffect(() => {
        if (!splitPaths[2]) {
            navigate(`/students/${studentId}/student`)
        }
    })

    return <Tabs
        type="card"
        onTabClick={(key) => {
            navigate(`/students/${studentId}/${key}`)
        }}
        items={[
            {
                label: "Student",
                key: "student",
                children: <StudentDetails />
            },
            // {
            //     label: "Attendance",
            //     key: "attendance",
            //     children: <StudentAttendance />
            // },
            {
                label: "Id Card",
                key: "id_card",
                children: <IdCard />
            },
            // {
            //     label: "Marks",
            //     key: "marks",
            //     children: <StudentMarks />
            // },
        ]}
    />
}