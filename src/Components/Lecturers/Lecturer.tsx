import { Tabs } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LecturerDetails from "./LecturerDetails";

export default function Lecturer() {
    const navigate = useNavigate()
    const splitPaths = window.location.pathname.split("/")
    const studentId = splitPaths[2]

    useEffect(() => {
        if (!splitPaths[3]) {
            navigate(`/lecturers/${studentId}/lecturer`)
        }
    })

    return <Tabs
        type="card"
        onTabClick={(key) => {
            navigate(`/lecturers/${studentId}/${key}`)
        }}
        items={[
            {
                label: "Lecturer",
                key: "lecturer",
                children: <LecturerDetails />
            },
            // {
            //     label: "Attendance",
            //     key: "attendance",
            //     children: <LecturerDetails />
            // }
        ]}
    />
}