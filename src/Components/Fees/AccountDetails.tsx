import { Button, Modal, Tabs } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShowFieldsUsingTypes } from "../CommonComponents";
import { capturePhoto, startCamera } from "../Utils";
import ApiServices from "../../ApiServices";
import { validateFields } from "../ValidateFields";
import { ShowToast } from "../CommonComponents";
import { useSelector } from "react-redux";

export default function AccountDetails() {
    const navigate = useNavigate()
    const splitPaths = window.location.pathname.split("/")
    const [data, setData] = useState({})
    const [editData, setEditData] = useState({})
    const [isEdit, setIsEdit] = useState(false)
    const [accountsData, setAccountsData] = useState({})
    const [loading, setLoading] = useState(false)
    const [isSaveButtonClicked, setIsSaveButtonClicked] = useState(false)
    const [classes, setClasses] = useState([])
    const [feeDataTypes, setFeeDataTypes] = useState<any>({})
    const [feeData, setFeeData] = useState<any>({})
    const [types, setTypes] = useState({
        id: { type: "Text" },
        student_id: { type: "Text" },
    })
    const [requiredFieldsModel, setRequiredFieldsModel] = useState({
        class_id: "",
        img_data: ""
    })
    const hasPermission = useSelector((state: any) => state?.user?.user?.role)

    useEffect(() => {
        if (isSaveButtonClicked) {
            const error = validateFields(editData, requiredFieldsModel)
            if (error) {
                ShowToast("error", error.errorMessage)
                setIsSaveButtonClicked(false)
            }
            else {
                updateEnrollments()
            }
        }
    }, [isSaveButtonClicked])

    function updateEnrollments() {
        let payload: any = editData
        let data: any = {}
        Object.entries(feeData).map(([key, value]) => {
            data[key] = { is_paid: value }
        })
        payload["data"] = data
        Promise.all([
            ApiServices.put(`student-accounts`, editData)
        ]).then(([enrollmentData]) => {
            if (enrollmentData?.status === "Success") {
                ShowToast("success", "Enrollment updated successfully.")
                setEditData(editData)
                setData(editData)
                setIsEdit(false)
            }
            else if (enrollmentData?.error) {
                ShowToast("error", enrollmentData.error)
            }
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setIsSaveButtonClicked(false)
        })
    }

    useEffect(() => {
        Promise.all([
            ApiServices.get(`student-accounts/${splitPaths[3]}`),
            ApiServices.get("installments")
        ]).then(([accountsData, installments]) => {
            let feeDataTypes: any = {}
            if (accountsData.error) {
                ShowToast("error", accountsData.error)
            }
            else {
                let feeData: any = {}
                Object.entries(accountsData.data).map(([key, value]: any) => {
                    feeDataTypes[key] = { type: "CheckBox" }
                    feeData[key] = value?.is_paid
                })
                setAccountsData(accountsData)
                setEditData(accountsData)
                setFeeData(feeData)
            }
            console.log(feeDataTypes)
            setFeeDataTypes(feeDataTypes)
        })
    }, [])
    return <div className="content-body">
        <div style={{ marginTop: "50px" }}>
            <div>{hasPermission === "admin" && <Button onClick={() => setIsEdit(!isEdit)}>{isEdit ? "Cancel" : "Edit"}</Button>}</div>
            <ShowFieldsUsingTypes
                types={types}
                data={editData}
                setData={setEditData}
                isEdit={isEdit}
            />
        </div>
        <div style={{ marginTop: "50px" }}>
            <ShowFieldsUsingTypes
                types={feeDataTypes}
                data={feeData}
                setData={setFeeData}
                isEdit={isEdit}
            />
        </div>
        {isEdit && <div style={{ height: "40px", width: "100%" }}>
            <div style={{ float: "right", marginTop: "20px" }}>
                <Button onClick={() => setIsSaveButtonClicked(true)} type="primary">
                    Save
                </Button>
                <Button onClick={() => {
                    setEditData(accountsData)
                    setIsEdit(false)
                }}
                    style={{ marginLeft: "15px" }}
                >
                    Cancel
                </Button>
            </div>
        </div>}
    </div>
}