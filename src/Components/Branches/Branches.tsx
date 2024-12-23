import { useEffect, useState } from "react"
import { Button, Modal, Table } from "antd"
import { UnorderedListOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import ApiServices from "../../ApiServices"
import { ShowFieldsUsingTypes, ShowToast } from "../CommonComponents"
import { validateFields } from "../ValidateFields"
import { useSelector } from "react-redux"

export default function Branches() {
    const [branches, setBranches] = useState<any>([])
    const navigate = useNavigate()
    const [showModel, setShowModel] = useState(false)
    const columns: any = [
        {
            title: "Name",
            dataIndex: "name",
            width: "30%"
        },
        {
            title: "Course In Years",
            dataIndex: "course_in_years",
            width: "30%"
        },
        {
            title: "Details",
            dataIndex: "details",
            render: (value: any, record: any) => {
                return <Button icon={<UnorderedListOutlined />} onClick={() => navigate(`/branches/${record.branch_id}`)} />
            }
        }
    ]
    const hasPermission = useSelector((state: any) => state?.user?.user?.role)
    const initialData = {
        name: "",
        course_in_years: "",
    }
    const [types, setTypes] = useState({
        name: { type: "Input", length: 30 },
        course_in_years: { type: "Number", length: 4 },
    })
    const [isSaveButtonClicked, setIsSaveButtonClicked] = useState(false)
    const [data, setData] = useState(initialData)
    const [requiredFieldsModel, setRequiredFieldsModel] = useState(initialData)

    useEffect(() => {
        if (isSaveButtonClicked) {
            console.log(data)
            const error = validateFields(data, requiredFieldsModel)
            if (error) {
                ShowToast("error", error.errorMessage)
                setIsSaveButtonClicked(false)
            }
            else {
                addBranch()
            }
        }
    }, [isSaveButtonClicked])

    function addBranch() {
        Promise.all([
            ApiServices.post("branches", data)
        ]).then(([branchData]) => {
            if (branchData?.error) {
                ShowToast("error", branchData.error)
            }
            else {
                ShowToast("success", "Successfully added the branch.")
                setBranches([
                    ...branches,
                    branchData
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
            ApiServices.get("branches")
        ]).then(([branchesData]) => {
            if (branchesData.error) {
                ShowToast("error", branchesData.error)
            }
            else {
                setBranches(branchesData)
            }
        }).catch((err) => {
            ShowToast("error", "Error occurred while getting branches.")
        })
    }, [])

    return <>
        <div className="header">
            Branches
        </div>
        <div className="content-body">
            <div className="addButton">
                {hasPermission === "admin" && <Button type="primary" onClick={() => setShowModel(true)} size="large">
                    Add Branch
                </Button>}
            </div>
            <Table
                dataSource={branches}
                columns={columns}
                pagination={false}
            />
            {<Modal
                open={showModel}
                width={700}
                title={"Add Branch"}
                onOk={() => {
                    setIsSaveButtonClicked(true);
                }}
                onCancel={() => {
                    setShowModel(false)
                    setData(initialData)
                }}
            >
                {
                    <ShowFieldsUsingTypes
                        types={types}
                        data={data}
                        setData={setData}
                    />
                }
            </Modal>}
        </div>
    </>
}