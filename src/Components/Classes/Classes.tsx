import { Button, Input, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import ApiServices from "../../ApiServices";
import { ShowToast } from "../CommonComponents";
import { ShowFieldsUsingTypes } from "../CommonComponents";
import { validateFields } from "../ValidateFields";
import { useNavigate } from "react-router-dom";
import { UnorderedListOutlined } from "@ant-design/icons"
import { useSelector } from "react-redux";

export default function Classes() {
    const [showModel, setShowModel] = useState(false)
    const [isSaveButtonClicked, setIsSaveButtonClicked] = useState(false)
    const initialData = {
        name: "",
        branch_id: "",
        room_no: ""
    }
    const [schedule, setSchedule] = useState({
        period1: "",
        period2: "",
        period3: "",
        period4: "",
        period5: "",
        period6: "",
        period7: "",
    })
    const hasPermission = useSelector((state: any) => state?.user?.user?.role)
    const [types, setTypes] = useState({
        name: { type: "Input", length: 10 },
        branch_id: { type: "Select", options: [] },
        room_no: { type: "Number", lenght: 100 }
    })
    const navigate = useNavigate()
    const [scheduleTypes, setScheduleTypes] = useState({
        period1: { type: "Input" },
        period2: { type: "Input" },
        period3: { type: "Input" },
        period4: { type: "Input" },
        period5: { type: "Input" },
        period6: { type: "Input" },
        period7: { type: "Input" },
    })
    const [newclassesData, setNewclassesData] = useState(initialData)
    const Columns = [
        {
            title: "Name",
            dataIndex: "name",
            width: "20%"
        },
        {
            title: "Room Number",
            dataIndex: "room_no",
            width: "20%"
        },
        {
            title: "Head",
            dataIndex: "faculty_id",
            width: "20%"
        },
        {
            title: "Details",
            dataIndex: "details",
            width: "20%",
            render: (value: any, record: any) => {
                return <Button icon={<UnorderedListOutlined />} onClick={() => navigate(`/classes/${record.class_id}`)} />
            }
        },
    ]
    const [branches, setBranches] = useState([])
    const [classes, setClasses] = useState<any>([])
    const [requiredFieldsModel, setRequiredFieldsModel] = useState({
        period1: "",
        period2: "",
        period3: "",
        period4: "",
        period5: "",
        period6: "",
        period7: "",
        name: "",
        faculty_id: "",
        room_no: ""
    })

    useEffect(() => {
        if (isSaveButtonClicked) {
            const error = validateFields({ ...newclassesData, ...schedule }, requiredFieldsModel)
            if (error) {
                ShowToast("error", error.errorMessage)
                setRequiredFieldsModel(error.borderColorsObject)
                setIsSaveButtonClicked(false)
            }
            else {
                addClass()
            }
        }
    }, [isSaveButtonClicked])

    function addClass() {
        let payload: any = { ...newclassesData, schedule: schedule }
        payload["room_no"] = Number(payload["room_no"])
        Promise.all([
            ApiServices.post("classes", payload)
        ]).then(([classData]) => {
            if (classData?.error) {
                ShowToast("error", classData.error)
            }
            else {
                ShowToast("success", "Student updated successfully.")
                setClasses([
                    ...classes,
                    classData
                ])
                setShowModel(false)
            }
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setIsSaveButtonClicked(false)
        })
    }

    useEffect(() => {
        Promise.all([
            ApiServices.get("classes"),
            ApiServices.get("branches"),
        ]).then(([classesData, branchesData]) => {
            let classes: any = []
            let branches: any = []
            if (classesData.error) {
                ShowToast("error", classesData.error)
            }
            else {
                classesData.map((item: any) => {
                    let object: any = {}
                    object.value = item.id
                    object.key = item.id
                    object.label = item.name
                    classes.push(object)
                })
                setClasses(classesData)
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
            ShowToast("error", "Error occurred while getting organizations")
        })
    }, [])


    return <div>
        <div>
            <div>
                {hasPermission === "admin" && <Button type="primary" size="large" onClick={() => setShowModel(true)}>
                    Add classes
                </Button>}
            </div>
        </div>
        <Table
            columns={Columns}
            dataSource={classes}
        />
        {<Modal
            open={showModel}
            width={700}
            title={"Add Class"}
            onOk={() => {
                setIsSaveButtonClicked(true);
            }}
            onCancel={() => {
                setShowModel(false)
                setNewclassesData(initialData)
            }}
        >
            <div>
                <ShowFieldsUsingTypes
                    types={types}
                    data={newclassesData}
                    setData={setNewclassesData}
                    borderColors={requiredFieldsModel}
                />
                <div>
                    <div style={{ border: "2px solid #DFDFDF", padding: "20px", marginTop: "20px", borderRadius: "10px" }}>
                        <div style={{ fontSize: "15px", fontWeight: "500" }}>
                            Schedule
                        </div>
                        <ShowFieldsUsingTypes
                            borderColors={requiredFieldsModel}
                            types={scheduleTypes}
                            data={schedule}
                            setData={setSchedule}
                        />
                    </div>
                </div>
            </div>
        </Modal>}
    </div>
}