import { Button } from "antd";
import { ShowFieldsUsingTypes } from "../CommonComponents";
import { useEffect, useState } from "react";
import ApiServices from "../../ApiServices";
import { ShowToast } from "../CommonComponents";
import { validateFields } from "../ValidateFields";
import { useSelector } from "react-redux";

export default function StudentDetails() {
    const [isEdit, setIsEdit] = useState(false)
    const [studentData, setStudentData] = useState({})
    const [editData, setEditData] = useState<any>({})
    const [loading, setLoading] = useState(false)
    const [branches, setBranches] = useState([])
    const [types, setTypes] = useState({
        email: { type: "Text" },
        first_name: { type: "Input", length: 30 },
        last_name: { type: "Input", length: 20 },
        dob: { type: "Date" },
        contact_no: { type: "Number", length: 9999999999 },
    })
    const [isSaveButtonClicked, setIsSaveButtonClicked] = useState(false)
    const [requiredFieldsModel, setRequiredFieldsModel] = useState({
        first_name: "",
        last_name: "",
        dob: "",
        contact_no: "",
    })
    const hasPermission = useSelector((state: any) => state?.user?.user?.role)

    useEffect(() => {
        setLoading(true)
        Promise.all([
            ApiServices.get(`students/${window.location.pathname.split("/")[2]}`),
        ]).then(([studentData]) => {
            if (studentData?.error) {
                ShowToast("error", studentData?.error)
            }
            else {
                setStudentData(studentData)
                setEditData(studentData)
            }
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setLoading(false)
        })
    }, [])

    useEffect(() => {
        if (isSaveButtonClicked) {
            const error = validateFields(editData, requiredFieldsModel)
            if (error) {
                ShowToast("error", error.errorMessage)
                setRequiredFieldsModel(error?.borderColorsObject)
                setIsSaveButtonClicked(false)
            }
            else {
                updateStudent()
            }
        }
    }, [isSaveButtonClicked])

    function updateStudent() {
        editData["contact_no"] = editData["contact_no"].toString()
        Promise.all([
            ApiServices.put("students", editData)
        ]).then(([studentData]) => {
            if (studentData?.status === "Success") {
                ShowToast("success", "Student updated successfully.")
                setEditData(editData)
                setStudentData(editData)
                setIsEdit(false)
            }
            else if (studentData?.error) {
                ShowToast("error", studentData.error)
            }
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setIsSaveButtonClicked(false)
        })
    }

    return <>
        <div className="content-body">
            <div>{hasPermission === "admin" && <Button onClick={() => setIsEdit(!isEdit)}>{isEdit ? "Cancel" : "Edit"}</Button>}</div>
            <div>
                <ShowFieldsUsingTypes
                    types={types}
                    data={editData}
                    setData={setEditData}
                    isEdit={isEdit}
                    borderColors={requiredFieldsModel}
                />
            </div>
            {
                isEdit && <div style={{ height: "40px", width: "100%" }}>
                    <div style={{ float: "right", marginTop: "20px" }}>
                        <Button onClick={() => setIsSaveButtonClicked(true)} type="primary">
                            Save
                        </Button>
                        <Button onClick={() => {
                            setEditData(studentData)
                            setIsEdit(false)
                        }}
                            style={{ marginLeft: "15px" }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            }
        </div>
    </>
}