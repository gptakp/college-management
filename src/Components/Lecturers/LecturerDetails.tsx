import { Button, Skeleton } from "antd";
import { ShowFieldsUsingTypes } from "../CommonComponents";
import { useEffect, useState } from "react";
import ApiServices from "../../ApiServices";
import { ShowToast } from "../CommonComponents";
import { validateEmail, validateFields } from "../ValidateFields";
import { useSelector } from "react-redux";

export default function LecturerDetails() {
    const [isEdit, setIsEdit] = useState(false)
    const [teacherData, setTeacherData] = useState({})
    const [editData, setEditData] = useState<any>({})
    const [loading, setLoading] = useState(false)
    const [types, setTypes] = useState({
        email: { type: "Text" },
        first_name: { type: "Input", length: 30 },
        last_name: { type: "Input", length: 20 },
        dob: { type: "Date" },
        contact_no: { type: "Number", length: 9999999999 },
        subjects: { type: "Select", options: [], mode: "tags" }
    })
    const [isSaveButtonClicked, setIsSaveButtonClicked] = useState(false)
    const [requiredFieldsModel, setRequiredFieldsModel] = useState({
        email: "",
        first_name: "",
        last_name: "",
        dob: "",
        contact_no: "",
    })
    const hasPermission = useSelector((state: any) => state?.user?.user?.role)

    useEffect(() => {
        setLoading(true)
        Promise.all([
            ApiServices.get(`lecturers/${window.location.pathname.split("/")[2]}`),
        ]).then(([teacherData]) => {
            if (teacherData?.error) {
                ShowToast("error", teacherData?.error)
            }
            else {
                setTeacherData(teacherData)
                setEditData(teacherData)
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
            else if (!validateEmail(editData.email)) {
                ShowToast("error", "Please enter correct email")
                setRequiredFieldsModel({
                    ...requiredFieldsModel,
                    email: "red"
                })
                setIsSaveButtonClicked(false)
            }
            else {
                updateLecturer()
            }
        }
    }, [isSaveButtonClicked])

    function updateLecturer() {
        editData["contact_no"] = editData["contact_no"].toString()
        Promise.all([
            ApiServices.put("lecturers", editData)
        ]).then(([teacherData]) => {
            if (teacherData?.status === "Success") {
                ShowToast("success", "Lecturer updated successfully.")
                setEditData(editData)
                setTeacherData(editData)
                setIsEdit(false)
            }
            else if (teacherData?.error) {
                ShowToast("error", teacherData.error)
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
                    setData={setEditData}
                    isEdit={isEdit}
                    borderColors={requiredFieldsModel}
                />
            </div>
            {isEdit && <div style={{ height: "40px", width: "100%" }}>
                <div style={{ float: "right", marginTop: "20px" }}>
                    <Button onClick={() => setIsSaveButtonClicked(true)} type="primary">
                        Save
                    </Button>
                    <Button onClick={() => {
                        setEditData(teacherData)
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