import { Tabs } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Books from "./Books";
import Accounts from "./Accounts";
import Librarians from "./Librarians";
import AccountDetails from "./AccountDetails";

export default function Library() {
    const navigate = useNavigate()
    const splitPaths = window.location.pathname.split("/")
    const studentId = splitPaths[2]

    useEffect(() => {
        if (!splitPaths[2]) {
            navigate(`/library/books`)
        }
    })

    return <Tabs
        type="card"
        activeKey={splitPaths[2]}
        onTabClick={(key) => {
            navigate(`/library/${key}`)
        }}
        items={[
            {
                label: "Book",
                key: "books",
                children: <Books />
            },
            {
                label: "Accounts",
                key: "accounts",
                children: splitPaths.length === 3 ? <Accounts /> : <AccountDetails />
            },
            {
                label: "Librarians",
                key: "librarians",
                children: <Librarians />
            },
        ]}
    />
}