import { Button, Skeleton } from "antd";
import { ShowFieldsUsingTypes } from "../CommonComponents";
import { useEffect, useState } from "react";
import ApiServices from "../../ApiServices";
import { ShowToast } from "../CommonComponents";

export default function AccountDetails() {
    const [accountData, setAccountData] = useState({})
    const [editData, setEditData] = useState({})
    const [loading, setLoading] = useState(false)
    const [types, setTypes] = useState({
        user_id: { type: "Text" },
        student_id: { type: "Text" },
        borrowed_books_info: { type: "Text" },
        student_name: { type: "Text" },
        contact_no: { type: "Text" }
    })

    useEffect(() => {
        setLoading(true)
        Promise.all([
            ApiServices.get(`accounts/${window.location.pathname.split("/")[3]}`),
        ]).then(([accountData]) => {
            if (accountData?.error) {
                ShowToast("error", accountData?.error)
            }
            else {
                setAccountData(accountData)
                setEditData(accountData)
            }
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setLoading(false)
        })
    }, [])

    return <Skeleton loading={loading}>
        <div className="content-body">
            <div>
                <ShowFieldsUsingTypes
                    types={types}
                    data={editData}
                    setData={setEditData}
                />
            </div>
        </div>
    </Skeleton>
}
