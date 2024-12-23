import { useEffect, useState } from "react"
import ApiServices from "../../ApiServices"
import { ShowFieldsUsingTypes, ShowToast } from "../CommonComponents"
import { validateFields } from "../ValidateFields"
import { Button, Skeleton } from "antd"
import dayjs from "dayjs"
import { useSelector } from "react-redux"

export default function ClassAttendance() {
    const [students, setStudents] = useState()
    const [attendanceData, setAttendanceData] = useState<any>({
        date: dayjs().format('YYYY-MM-DD'),
    })
    const [editAttendanceData, setEditAttendanceData] = useState({
        date: dayjs().format('YYYY-MM-DD'),
    })
    const [loading, setLoading] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const splitPaths = window.location.pathname.split("/")
    const [types, setTypes] = useState({
        date: { type: "Date" },
    })
    const [attendanceTypes, setAttendanceTypes] = useState({})
    const [editData, setEditData] = useState({})
    const [data, setData] = useState({})
    const [isSaveButtonClicked, setIsSaveButtonClicked] = useState(false)
    const [requiredFieldsModel, setRequiredFieldsModel] = useState({
        date: ""
    })
    const hasPermission = useSelector((state: any) => state?.user?.user?.role)

    useEffect(() => {
        console.log(attendanceData)
        Promise.all([
            ApiServices.get(`classes/${splitPaths[2]}/students`),
            ApiServices.get(`attendance/class/${splitPaths[2]}/${attendanceData.date ?? dayjs().format('YYYY-MM-DD')}`)
        ]).then(([studentsData, attendanceData]: any) => {
            let data: any = {}
            let labels: any = {}
            let types: any = {}
            if (studentsData.error) {
                console.log(studentsData.error)
                ShowToast("error", studentsData.error)
            }
            else {
                setStudents(studentsData)
                if (Object.keys(attendanceData).length === 0) {
                    studentsData.map((item: any) => {
                        data[item.student_id] = false
                        labels[item.student_id] = item.first_name + " " + item.last_name
                        types[item.student_id] = { type: "CheckBox" }
                    })
                }
            }
            if (attendanceData.error) {
                ShowToast("error", attendanceData.error)
            }
            else {
                console.log(attendanceData)
                if (Object.keys(attendanceData).length !== 0) {
                    setEditAttendanceData({
                        date: attendanceData.date,
                    })
                    setAttendanceData(attendanceData)
                    setEditData(attendanceData.attendance_data)
                    setData(attendanceData.attendance_data)
                    Object.keys(attendanceData.attendance_data).map((key: any) => {
                        types[key] = { type: "CheckBox" }
                    })
                }
                else {
                    setData(attendanceData.attendance_data)
                    setAttendanceData((prevState: any) => {
                        return {
                            date: prevState.date
                        }
                    })
                }
            }
            setAttendanceTypes(types)
        })
    }, [attendanceData.date])

    useEffect(() => {
        if (isSaveButtonClicked) {
            const error = validateFields(attendanceData, requiredFieldsModel)
            if (error) {
                ShowToast("error", error.errorMessage)
                setIsSaveButtonClicked(false)
            }
            else {
                updateAttendance()
            }
        }
    }, [isSaveButtonClicked])

    function updateAttendance() {
        if (!attendanceData.a_id) {
            let payload = {
                ...attendanceData,
                attendance_data: editData
            }
            Promise.all([
                ApiServices.post(`attendance/class/${splitPaths[2]}/${attendanceData.date}`, payload)
            ]).then(([studentData]) => {
                if (studentData.error) {
                    ShowToast("error", studentData.error)
                }
                else {
                    setAttendanceData(studentData)
                    ShowToast("success", "Attendance added successfully.")
                }
            }).catch((err) => {
                console.log(err)
            }).finally(() => {
                setIsSaveButtonClicked(false)
            })
        }
        else {
            let payload = {
                ...attendanceData,
                attendance_data: editData
            }
            Promise.all([
                ApiServices.put(`attendance/class/${splitPaths[2]}/${attendanceData.date}`, payload)
            ]).then(([studentData]) => {
                if (studentData?.status === "Success") {
                    setAttendanceData(payload)
                    ShowToast("success", "Attendance updated successfully.")
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
    }

    return <Skeleton loading={loading}>
        <div className="content-body">
            <div>{hasPermission === "admin" && <Button onClick={() => setIsEdit(!isEdit)}>{isEdit ? "Cancel" : "Edit"}</Button>}</div>
            <div>
                <ShowFieldsUsingTypes
                    types={types}
                    data={attendanceData}
                    borderColors={requiredFieldsModel}
                    setData={setAttendanceData}
                    isEdit={isEdit}
                />
                <div>
                    <div style={{ border: "2px solid #DFDFDF", padding: "20px", marginTop: "20px", borderRadius: "10px" }}>
                        <div style={{ fontSize: "15px", fontWeight: "500" }}>
                            Students
                        </div>
                        <ShowFieldsUsingTypes
                            isEdit={isEdit}
                            borderColors={requiredFieldsModel}
                            types={attendanceTypes}
                            data={editData}
                            setData={setEditData}
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
                        setEditAttendanceData(attendanceData)
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
