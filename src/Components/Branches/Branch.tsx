import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DepartmentDetails from "./BranchDetails";
import DepartmentClasses from "./BranchClasses";

export default function Department() {
    const navigate = useNavigate()
    const splitPaths = window.location.pathname.split("/")

    useEffect(() => {
        if (!splitPaths[3]) {
            navigate(`/branches/${splitPaths[2]}/branch`)
        }
    }, [])

    return <Tabs
        type="card"
        items={[
            {
                label: "Branch",
                key: "branch",
                children: <DepartmentDetails branchId={splitPaths[2]} />
            },
            {
                label: "Class",
                key: "class",
                children: <DepartmentClasses branchId={splitPaths[2]} />
            },
        ]}
        onTabClick={(key) => navigate(`/branches/${splitPaths[2]}/${key}`)}
        activeKey={splitPaths[3]}
    />
}