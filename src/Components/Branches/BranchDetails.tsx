import { useEffect, useState } from "react";
import ApiServices from "../../ApiServices";
import { ShowToast } from "../CommonComponents";
import { ShowFieldsUsingTypes } from "../CommonComponents";
import { Button, Skeleton } from "antd";
import { validateFields } from "../ValidateFields";
import { useSelector } from "react-redux";

export default function DepartmentDetails(props: any) {
    const [data, setData] = useState({})
    const [editData, setEditData] = useState({})
    const [loading, setLoading] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [isSaveButtonClicked, setIsSaveButtonClicked] = useState(false)
    const [types, setTypes] = useState({
        name: { type: "Input", lenght: 30 },
    })
    const [requiredFieldsModel, setRequiredFieldsModel] = useState({
        name: "",
    })
    const hasPermission = useSelector((state: any) => state?.user?.user?.role)

    useEffect(() => {
        setLoading(true)
        Promise.all([
            ApiServices.get(`branches/${props.branchId}`),
        ]).then(([departmentData]) => {
            if (departmentData?.error) {
                ShowToast("error", departmentData.error)
            }
            else {
                setData(departmentData)
                setEditData(departmentData)
            }
        }).catch((err) => {
            console.log(err)
        }).finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        if (isSaveButtonClicked) {
            const error = validateFields(editData, requiredFieldsModel)
            if (error) {
                ShowToast("error", error.errorMessage)
                setRequiredFieldsModel(error.borderColorsObject)
                setIsSaveButtonClicked(false)
            }
            else {
                updateDepartment()
            }
        }
    }, [isSaveButtonClicked])

    function updateDepartment() {
        Promise.all([
            ApiServices.put("branches", editData)
        ]).then(([branchData]) => {
            if (branchData?.status === "Success") {
                ShowToast("success", "Student updated successfully.")
                setEditData(editData)
                setData(editData)
                setIsEdit(false)
            }
            else if (branchData?.error) {
                ShowToast("error", branchData.error)
            }
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setIsSaveButtonClicked(false)
        })
    }

    return <Skeleton loading={loading}>
        <div className="content-body">
            <div>{hasPermission === "admin" && <Button onClick={() => setIsEdit(!isEdit)}>{isEdit ? "Cancel" : "Edit"}</Button>}</div>
            <div>
                <ShowFieldsUsingTypes
                    types={types}
                    data={editData}
                    borderColors={requiredFieldsModel}
                    setData={setEditData}
                    isEdit={isEdit}
                />
            </div>
            {isEdit && <div style={{ height: "40px", width: "100%" }}>
                <div style={{ float: "right", marginTop: "20px" }}>
                    <Button onClick={() => setIsSaveButtonClicked(true)} type="primary">
                        Save
                    </Button>
                    <Button onClick={() => {
                        setEditData(data)
                        setIsEdit(false)
                    }}
                        style={{ marginLeft: "15px" }}
                    >
                        Cancel
                    </Button>
                </div>
            </div>}
        </div>
    </Skeleton>
}