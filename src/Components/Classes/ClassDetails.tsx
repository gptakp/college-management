import { useEffect, useState } from "react";
import ApiServices from "../../ApiServices";
import { ShowToast } from "../CommonComponents";
import { ShowFieldsUsingTypes } from "../CommonComponents";
import { Button, Skeleton } from "antd";
import { validateFields } from "../ValidateFields";
import { useSelector } from "react-redux";

export default function ClassDetails(props: any) {
    const [data, setData] = useState({})
    const [editData, setEditData] = useState({})
    const [loading, setLoading] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [teachers, setTeachers] = useState([])
    const [isSaveButtonClicked, setIsSaveButtonClicked] = useState(false)
    const [types, setTypes] = useState({
        name: { type: "Input", length: 10 },
        branch_id: { type: "Select", options: [] },
        room_no: { type: "Number", length: 100 }
    })
    const [schedule, setSchedule] = useState({})
    const [scheduleTypes, setScheduleTypes] = useState({})
    const [requiredFieldsModel, setRequiredFieldsModel] = useState({
        name: "",
        head_id: ""
    })
    const [branches, setBranches] = useState({})
    const hasPermission = useSelector((state: any) => state?.user?.user?.role)

    useEffect(() => {
        setLoading(true)
        Promise.all([
            ApiServices.get(`classes/${props.classId}`),
            ApiServices.get(`branches`),
        ]).then(([classData, branchesData]) => {
            let branches: any = []
            if (classData?.error) {
                ShowToast("error", classData.error)
            }
            else {
                setData(classData)
                let scheduleObjectType: any = {}
                let scheduleKeysObject: any = {}
                Object.keys(classData.schedule).map((key) => {
                    scheduleObjectType[key] = { type: "Input" }
                    scheduleKeysObject[key] = ""
                })
                setScheduleTypes(scheduleObjectType)
                setRequiredFieldsModel({
                    ...requiredFieldsModel,
                    ...scheduleKeysObject
                })
                setSchedule(classData.schedule)
                setEditData(classData)
            }
            if (branchesData.error) {
                ShowToast("error", branchesData.error)
            }
            else {
                branchesData.map((item: any) => {
                    let object: any = {}
                    object.value = item.branch_id
                    object.key = item.branch_id
                    object.label = item.name
                    branches.push(object)
                })
                setBranches(branches)
            }
            setTypes({
                ...types,
                branch_id: { type: "Select", options: branches },
            })
        }).catch((err) => {
            console.log(err)
        }).finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        if (isSaveButtonClicked) {
            const error = validateFields({ ...editData, ...schedule }, requiredFieldsModel)
            if (error) {
                ShowToast("error", error.errorMessage)
                setRequiredFieldsModel(error.borderColorsObject)
                setIsSaveButtonClicked(false)
            }
            else {
                updateClass()
            }
        }
    }, [isSaveButtonClicked])

    console.log(requiredFieldsModel)

    function updateClass() {
        Promise.all([
            ApiServices.put("classes", { ...editData, schedule: schedule })
        ]).then(([organizationData]) => {
            if (organizationData?.status === "Success") {
                ShowToast("success", "Student updated successfully.")
                setEditData(editData)
                setData(editData)
                setIsEdit(false)
            }
            else if (organizationData?.error) {
                ShowToast("error", organizationData.error)
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
                <div>
                    <div style={{ border: "2px solid #DFDFDF", padding: "20px", marginTop: "20px", borderRadius: "10px" }}>
                        <div style={{ fontSize: "15px", fontWeight: "500" }}>
                            Schedule
                        </div>
                        <ShowFieldsUsingTypes
                            isEdit={isEdit}
                            borderColors={requiredFieldsModel}
                            types={scheduleTypes}
                            data={schedule}
                            setData={setSchedule}
                        />
                    </div>
                </div>
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