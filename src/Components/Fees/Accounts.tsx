import { useEffect, useState } from "react"
import ApiServices from "../../ApiServices"
import { ShowFieldsUsingTypes, ShowToast } from "../CommonComponents"
import { validateFields } from "../ValidateFields"
import { Button, Modal, Table } from "antd"
import { useNavigate } from "react-router-dom"
import { UnorderedListOutlined } from "@ant-design/icons"

export default function Accounts() {
    const navigate = useNavigate()
    const [accounts, setAccounts] = useState<any>([])
    const [students, setStudents] = useState([])
    const initialAccountData = {
        student_id: "",
        is_paid: false
    }
    const [newAccountData, setNewAccountData] = useState(initialAccountData)
    const [types, setTypes] = useState({
        student_id: { type: "Select", options: [] },
    })
    const [isSaveButtonClicked, setIsSaveButtonClicked] = useState(false)
    const [showModel, setShowModel] = useState(false)
    const [requiredFieldsModel, setRequiredFieldsModel] = useState({
        student_id: "",
    })
    const Columns: any = [
        {
            title: "Student Name",
            dataIndex: "student_id",
            width: "30%"
        },
        {
            title: "Is Paid",
            dataIndex: "is_paid",
            width: "30%",
            render: (value: any) => value.toString()
        },
        {
            title: "No of pending quarters",
            dataIndex: "data",
            width: "30%",
            render: (value: any, record: any) => {
                return Object.keys(value).length
            }
        },
        {
            title: "Details",
            dataIndex: "details",
            render: (value: any, record: any) => {
                return <Button icon={<UnorderedListOutlined />} onClick={() => navigate(`/fees/accounts/${record.id}`)} />
            }
        }
    ]

    useEffect(() => {
        Promise.all([
            ApiServices.get("student-accounts"),
            ApiServices.get("students"),
            ApiServices.get("installments")
        ]).then(([accounts, students, installments]) => {
            let studentsData: any = []
            let installmentsData: any = []
            if (accounts.error) {
                ShowToast("error", accounts.error)
            }
            else {
                setAccounts(accounts)
            }
            if (students.error) {
                ShowToast("error", students.error)
            }
            else {
                students.map((item: any) => {
                    let options: any = {}
                    options.label = item.first_name;
                    options.value = item.student_id;
                    options.key = item.student_id;
                    studentsData.push(options)
                })
                setStudents(students)
            }
            if (students.error) {
                ShowToast("error", students.error)
            }
            else {
                students.map((item: any) => {
                    let options: any = {}
                    options.label = item.installment_no;
                    options.value = item.installment_id;
                    options.key = item.installment_id;
                    installmentsData.push(options)
                })
            }
            setTypes({
                ...types,
                student_id: { type: "Select", options: studentsData },
            })
        })
    }, [])

    useEffect(() => {
        if (isSaveButtonClicked) {
            const error = validateFields(newAccountData, requiredFieldsModel)
            if (error) {
                ShowToast("error", error.errorMessage)
                setRequiredFieldsModel(error.borderColorsObject)
                setIsSaveButtonClicked(false)
            }
            else {
                addUserAccount()
            }
        }
    }, [isSaveButtonClicked])

    function addUserAccount() {
        Promise.all([
            ApiServices.post("student-accounts", newAccountData)
        ]).then(([accountData]) => {
            if (accountData?.error) {
                ShowToast("error", accountData.error)
            }
            else {
                setShowModel(false)
                setAccounts([
                    ...accounts,
                    accountData
                ])
                ShowToast("success", "Successfully created acount.")
            }
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setIsSaveButtonClicked(false)
        })
    }

    return <div>
        <Table
            columns={Columns}
            dataSource={accounts}
        />
    </div>
}