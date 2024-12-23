import { Button, Modal, Select, Table } from "antd";
import { useEffect, useState } from "react";
import ApiServices from "../../ApiServices";
import { ShowToast } from "../CommonComponents";
import { ShowFieldsUsingTypes } from "../CommonComponents";
import { useNavigate } from "react-router-dom";
import { validateEmail, validateFields } from "../ValidateFields";
import { UnorderedListOutlined } from "@ant-design/icons";
import { isConstructorDeclaration } from "typescript";
import { useSelector } from "react-redux";

export default function Students() {
    const [showModel, setShowModel] = useState(false)
    const [isSaveButtonClicked, setIsSaveButtonClicked] = useState(false)
    const initialData = {
        email: "",
        first_name: "",
        last_name: "",
        dob: "",
        branch_id: "",
        id: "",
        contact_no: "",
    }
    const [newStudentData, setNewStudentData] = useState<any>(initialData)
    const [types, setTypes] = useState({
        id: { type: "Input", length: 20 },
        email: { type: "Input", length: 40 },
        first_name: { type: "Input", length: 30 },
        last_name: { type: "Input", length: 20 },
        dob: { type: "Date" },
        branch_id: { type: "Select", options: [] },
        contact_no: { type: "Number", length: 9999999999 },
    })
    const Columns = [
        {
            title: "First Name",
            dataIndex: "first_name",
            width: "20%"
        },
        {
            title: "First Name",
            dataIndex: "last_name",
            width: "20%"
        },
        {
            title: "Date of Birth",
            dataIndex: "dob",
            width: "20%"
        },
        {
            title: "Department Id",
            dataIndex: "branch_id",
            width: "20%"
        },
        {
            title: "Details",
            dataIndex: "details",
            render: (value: any, record: any) => {
                return <Button icon={<UnorderedListOutlined />} onClick={() => navigate(`/students/${record.student_id}`)} />
            }
        }
    ]
    const [students, setStudents] = useState<any>([])
    const [branches, setBranches] = useState([])
    const navigate = useNavigate()
    const [requiredFieldsModel, setRequiredFieldsModel] = useState({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        dob: "",
        branch_id: "",
        id: "",
        contact_no: "",
    })
    const hasPermission = useSelector((state: any) => state?.user?.user?.role)

    useEffect(() => {
        Promise.all([
            ApiServices.get("branches"),
            ApiServices.get("students")
        ]).then(([branchesData, studentsData]) => {
            if (branchesData.error) {
                ShowToast("error", branchesData.error)
            }
            else {
                let branches: any = []
                branchesData.map((item: any) => {
                    let object: any = {}
                    object.value = item.branch_id
                    object.key = item.branch_id
                    object.label = item.name
                    branches.push(object)
                })
                setBranches(branchesData)
                setTypes({
                    ...types,
                    branch_id: { type: "Select", options: branches }
                })
            }
            if (studentsData.error) {
                ShowToast("error", "Error occurred while getting students.")
            }
            else {
                setStudents(studentsData)
            }
        }).catch((err) => {
            ShowToast("error", "Error occurred while getting organizations")
        })
    }, [])

    useEffect(() => {
        if (isSaveButtonClicked) {
            const error = validateFields(newStudentData, requiredFieldsModel)
            if (error) {
                ShowToast("error", error.errorMessage)
                setRequiredFieldsModel(error.borderColorsObject)
                setIsSaveButtonClicked(false)
            }
            else if (!validateEmail(newStudentData.email)) {
                ShowToast("error", "Please enter correct email")
                setRequiredFieldsModel({
                    ...requiredFieldsModel,
                    email: "red"
                })
                setIsSaveButtonClicked(false)
            }
            else {
                addStudent()
            }
        }
    }, [isSaveButtonClicked])

    function addStudent() {
        newStudentData["contact_no"] = newStudentData["contact_no"].toString()
        Promise.all([
            ApiServices.post("students", newStudentData)
        ]).then(([studentsData]) => {
            if (studentsData?.error) {
                ShowToast("error", studentsData.error)
            }
            else {
                setShowModel(false)
                setStudents([
                    ...students,
                    studentsData
                ])
                ShowToast("success", "Successfully added student.")
            }
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setIsSaveButtonClicked(false)
            setShowModel(false)
        })
    }

    return <div>
        <div className="header">
            Students
        </div>
        <div style={{ marginBottom: "20px" }}>
            {
                hasPermission === "admin" && <Button type="primary" size="large" onClick={() => { setShowModel(true) }}>
                    Add Student
                </Button>
            }
        </div>
        <Table
            columns={Columns}
            dataSource={students}
            pagination={false}
        />
        {<Modal
            open={showModel}
            width={700}
            title={"Add Student"}
            onOk={() => {
                setIsSaveButtonClicked(true);
            }}
            onCancel={() => {
                setShowModel(false)
                setNewStudentData(initialData)
            }}
        >
            <ShowFieldsUsingTypes
                types={types}
                borderColors={requiredFieldsModel}
                data={newStudentData}
                setData={setNewStudentData}
            />
        </Modal>}
    </div>
}