import { Button, Checkbox, Input, Modal, Table } from "antd";
import { useEffect, useRef, useState } from "react";
import ApiServices from "../../ApiServices";
import { ShowToast } from "../CommonComponents";
import { ShowFieldsUsingTypes } from "../CommonComponents";
import { containsLowercase, containsNumber, containsSpecialChars, containsUppercase, validateEmail, validateFields, validatePassword } from "../ValidateFields";
import { useNavigate } from "react-router-dom";
import { UnorderedListOutlined } from "@ant-design/icons"
import { useSelector } from "react-redux";

export default function Lecturers() {
    const navigate = useNavigate()
    const [showModel, setShowModel] = useState(false)
    const [isSaveButtonClicked, setIsSaveButtonClicked] = useState(false)
    const initialData = {
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        dob: "",
        subjects: [],
        employee_id: "",
        contact_no: "",
    }
    const [types, setTypes] = useState({
        employee_id: { type: "Input", length: 10 },
        email: { type: "Input", length: 50 },
    })
    const [secondTypes, setSecondTypes] = useState({
        subjects: { type: "Select", options: [], mode: "tags" },
        first_name: { type: "Input", length: 30 },
        last_name: { type: "Input", lenght: 20 },
        dob: { type: "Date" },
        is_head: { type: "CheckBox" },
        contact_no: { type: "Number", length: 9999999999 },
    })
    const hasPermission = useSelector((state: any) => state?.user?.user?.role)
    const [newLecturerData, setNewLecturerData] = useState(initialData)
    let [password, setPassword] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        specialchars: false,
        number: false
    })
    const Columns = [
        {
            title: "First Name",
            dataIndex: "first_name",
            width: "20%"
        },
        {
            title: "Last Name",
            dataIndex: "last_name",
            width: "20%"
        },
        {
            title: "Subjects",
            dataIndex: "subjects",
            width: "20%"
        },
        {
            title: "Email",
            dataIndex: "email",
            width: "20%"
        },
        {
            title: "Contact no",
            dataIndex: "contact_no",
            width: "20%"
        },
        {
            title: "Details",
            dataIndex: "details",
            width: "20%",
            render: (value: any, record: any) => {
                return <Button icon={<UnorderedListOutlined />} onClick={() => navigate(`/lecturers/${record.lecturer_id}`)} />
            }
        },
    ]
    const [lecturers, setLecturers] = useState<any>([])
    const [requiredFieldsModel, setRequiredFieldsModel] = useState({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        dob: "",
        subjects: "",
        employee_id: "",
        contact_no: "",
    })

    useEffect(() => {
        if (isSaveButtonClicked) {
            console.log(newLecturerData)
            var errorMessage = "Password contains atleast";
            const error = validateFields(newLecturerData, requiredFieldsModel)
            if (error) {
                ShowToast("error", error.errorMessage)
                setRequiredFieldsModel(error.borderColorsObject)
                setIsSaveButtonClicked(false)
            }
            else if (!validateEmail(newLecturerData.email)) {
                ShowToast("error", "Please enter correct email")
                setRequiredFieldsModel({
                    ...requiredFieldsModel,
                    email: "red"
                })
                setIsSaveButtonClicked(false)
            }
            else if (newLecturerData?.employee_id.replaceAll("0", "").length === 0) {
                ShowToast("error", "Employee id should not be 0's")
                setRequiredFieldsModel({
                    ...requiredFieldsModel,
                    employee_id: "red"
                })
                setIsSaveButtonClicked(false)
            }
            else if (newLecturerData.password.length < 8) {
                setRequiredFieldsModel({
                    ...requiredFieldsModel,
                    password: "red"
                })
                ShowToast("error", "Password contains atleast 8 characters");
                setIsSaveButtonClicked(false)
            }
            else if (!containsUppercase(newLecturerData.password)) {
                setRequiredFieldsModel({
                    ...requiredFieldsModel,
                    password: "red"
                })
                errorMessage += " one upper case,"
                setIsSaveButtonClicked(false)
                ShowToast("error", errorMessage);
            }
            else if (!containsLowercase(newLecturerData.password)) {
                setRequiredFieldsModel({
                    ...requiredFieldsModel,
                    password: "red"
                })
                errorMessage += " one lower case,"
                setIsSaveButtonClicked(false)
                ShowToast("error", errorMessage);
            }
            else if (!containsNumber(newLecturerData.password)) {
                setRequiredFieldsModel({
                    ...requiredFieldsModel,
                    password: "red"
                })
                setIsSaveButtonClicked(false)
                errorMessage += " one number,"
                ShowToast("error", errorMessage);
            }
            else if (!containsSpecialChars(newLecturerData.password)) {
                setIsSaveButtonClicked(false)
                setRequiredFieldsModel({
                    ...requiredFieldsModel,
                    password: "red"
                })
                errorMessage += " one special character."
                ShowToast("error", errorMessage);
            }
            else {
                addTeacher()
            }
        }
    }, [isSaveButtonClicked])

    function addTeacher() {
        newLecturerData["contact_no"] = newLecturerData["contact_no"].toString()
        Promise.all([
            ApiServices.post("lecturers", newLecturerData)
        ]).then(([lecturerData]) => {
            if (lecturerData?.error) {
                ShowToast("error", lecturerData.error)
            }
            else {
                setShowModel(false)
                setLecturers([
                    ...lecturers,
                    lecturerData
                ])
                ShowToast("success", "Successfully added lecturer.")
            }
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setIsSaveButtonClicked(false)
        })
    }

    useEffect(() => {
        Promise.all([
            ApiServices.get("lecturers")
        ]).then(([lecturersData]) => {
            if (lecturersData.error) {
                ShowToast("error", lecturersData.error)
            }
            else {
                setLecturers(lecturersData)
            }
        }).catch((err) => {
            ShowToast("error", "Error occurred while getting lecturers")
        })
    }, [])

    return <div>
        <div style={{ marginBottom: "20px" }}>
            {
                <>
                    {hasPermission === "admin" && <Button type="primary" size="large" onClick={() => {
                        setShowModel(true)
                    }}>
                        Add Lecturers
                    </Button>}
                </>
            }
        </div>
        <Table
            columns={Columns}
            dataSource={lecturers}
        />
        {<Modal
            open={showModel}
            width={700}
            title={"Add Lecturers"}
            onOk={() => {
                setIsSaveButtonClicked(true);
            }}
            onCancel={() => {
                setShowModel(false)
                setNewLecturerData(initialData)
            }}
        >
            <div>
                <ShowFieldsUsingTypes
                    types={types}
                    borderColors={requiredFieldsModel}
                    data={newLecturerData}
                    setData={setNewLecturerData}
                />
                <div style={{ display: "grid", gridTemplateColumns: "50% 50%", gridRowGap: "20px", marginTop: "10px" }}>
                    <div>{"password"}{requiredFieldsModel?.["password"] !== undefined && <span style={{ color: "red" }}>*</span>}
                    </div>
                    <div>
                        <Input
                            value={newLecturerData?.["password"]}
                            style={{ borderColor: requiredFieldsModel?.["password"] }}
                            maxLength={20}
                            onChange={(e) => {
                                let password: any = {
                                    uppercase: false,
                                    lowercase: false,
                                    specialchars: false,
                                    number: false
                                }
                                if (e.target.value.length >= 8) {
                                    password.uppercase = true
                                }
                                if (containsUppercase(e.target.value)) {
                                    password.uppercase = true
                                }
                                if (containsLowercase(e.target.value)) {
                                    password.lowercase = true
                                }
                                if (containsNumber(e.target.value)) {
                                    password.number = true
                                }
                                if (containsSpecialChars(e.target.value)) {
                                    password.specialchars = true
                                }
                                setPassword(password)
                                setNewLecturerData({
                                    ...newLecturerData,
                                    ["password"]: e.target.value,
                                })
                            }}
                        />
                        <Checkbox disabled checked={password?.["length"]} /> Password contains Upper Case
                        <br />
                        <Checkbox disabled checked={password?.["uppercase"]} /> Password contains Upper Case
                        <br />
                        <Checkbox disabled checked={password?.lowercase} /> Password contains Lower Case
                        <br />
                        <Checkbox disabled checked={password?.number} /> Password contains Number
                        <br />
                        <Checkbox disabled checked={password?.specialchars} /> Password contains special characters
                    </div>
                </div>
                <ShowFieldsUsingTypes
                    types={secondTypes}
                    borderColors={requiredFieldsModel}
                    data={newLecturerData}
                    setData={setNewLecturerData}
                />
            </div>
        </Modal>}
    </div>
}
