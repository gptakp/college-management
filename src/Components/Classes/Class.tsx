import { Tabs } from "antd"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import ClassDetails from "./ClassDetails"
import ClassAttendance from "./ClassAttendance"

export default function Class() {
    const navigate = useNavigate()
    const splitPaths = window.location.pathname.split("/")

    useEffect(() => {
        if (!splitPaths[3]) {
            navigate(`/classes/${splitPaths[2]}/class`)
        }
    }, [])

    return <Tabs
        items={[
            {
                label: "Class",
                key: "class",
                children: <ClassDetails classId={splitPaths[2]} />
            },
            {
                label: "Attendance",
                key: "attendance",
                children: <ClassAttendance />
            },
        ]}
        onTabClick={(key) => navigate(`/classes/${splitPaths[2]}/${key}`)}
        activeKey={splitPaths[3]}
    />
}