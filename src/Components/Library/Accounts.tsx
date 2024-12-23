import { useEffect, useState } from "react"
import ApiServices from "../../ApiServices"
import { ShowFieldsUsingTypes, ShowToast } from "../CommonComponents"
import { validateFields } from "../ValidateFields"
import { Button, Modal, Table } from "antd"
import { UnorderedListOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

export default function Accounts() {
    const navigate = useNavigate()
    const hasPermission = useSelector((state: any) => state?.user?.user?.role)
    const [accounts, setAccounts] = useState<any>([])
    const [students, setStudents] = useState([])
    const initialAccountData = {
        student_id: "",
    }
    const initialBorrowedBooksData = {
        book_id: "",
        to_date: ""
    }
    const [newAccountData, setNewAccountData] = useState(initialAccountData)
    const [borrowedBooksInfo, setBorrowedBooksInfo] = useState(initialBorrowedBooksData)
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
            dataIndex: "student_name",
            width: "50%"
        },
        {
            title: "No of books borrowed",
            dataIndex: "borrowed_books_info",
            width: "30%",
            render: (value: any, record: any) => {
                return Object.keys(value).length
            }
        },
        {
            title: "Details",
            dataIndex: "details",
            render: (value: any, record: any) => {
                return <Button icon={<UnorderedListOutlined />} onClick={() => navigate(`/library/accounts/${record.student_id}`)} />
            }
        }
    ]

    useEffect(() => {
        Promise.all([
            ApiServices.get("accounts"),
            ApiServices.get("students")
        ]).then(([accounts, students]) => {
            let studentsData: any = []
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
                setTypes({
                    ...types,
                    student_id: { type: "Select", options: studentsData }
                })
                setStudents(students)
            }
        })
    }, [])

    useEffect(() => {
        if (isSaveButtonClicked) {
            let data = { ...newAccountData, borrowed_books_info: borrowedBooksInfo }
            const error = validateFields(data, requiredFieldsModel)
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
        let payload = { ...newAccountData, borrowed_books_info: { bok: "ghj" } }
        Promise.all([
            ApiServices.post("accounts", payload)
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
        <div style={{ marginBottom: "20px" }}>
            {
                <>
                    {hasPermission === "admin" && <Button type="primary" size="large" onClick={() => {
                        setShowModel(true)
                    }}>
                        Add Account
                    </Button>}
                </>
            }
        </div>
        <Table
            columns={hasPermission === "admin" ? Columns : Columns.slice(0,2)}
            dataSource={accounts}
        />
        {<Modal
            open={showModel}
            width={700}
            title={"Add Account"}
            onOk={() => {
                setIsSaveButtonClicked(true);
            }}
            onCancel={() => {
                setShowModel(false)
                setNewAccountData(initialAccountData)
            }}
        >
            <ShowFieldsUsingTypes
                types={types}
                borderColors={requiredFieldsModel}
                data={newAccountData}
                setData={setNewAccountData}
            />
        </Modal>}
    </div>
}