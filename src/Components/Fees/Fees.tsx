import { Tabs } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Accounts from "./Accounts";
import Installments from "./Installments";
import AccountDetails from "./AccountDetails";

export default function Fees() {
    const navigate = useNavigate()
    const splitPaths = window.location.pathname.split("/")

    useEffect(() => {
        if (!splitPaths[2]) {
            navigate(`/fees/installments`)
        }
    })

    return <Tabs
        type="card"
        activeKey={splitPaths[2]}
        onTabClick={(key) => {
            navigate(`/fees/${key}`)
        }}
        items={[
            {
                label: "Installments",
                key: "installments",
                children: <Installments />
            },
            {
                label: "Accounts",
                key: "accounts",
                children: splitPaths.length === 3 ? <Accounts /> : <AccountDetails />
            },
        ]}
    />
}