import { Button, Input, Modal, Table } from "antd"
import { useEffect, useState } from "react"
import { ShowFieldsUsingTypes, ShowToast } from "../CommonComponents"
import ApiServices from "../../ApiServices"
import { OrganizeImportsMode } from "typescript"
import { useNavigate } from "react-router-dom"
import { UnorderedListOutlined } from "@ant-design/icons"
import { validateFields } from "../ValidateFields"
import { useSelector } from "react-redux"

export default function Auditorium() {
    const [showModel, setShowModel] = useState(false)
    const [isSaveButtonClicked, setIsSaveButtonClicked] = useState(false)
    const hasPermission = useSelector((state: any) => state?.user?.user?.role)
    const initialData = {
        event_name: "",
        conducting_date: "",
        conducted_by: "",
        description: ""
    }
    const navigate = useNavigate()
    const columns: any = [
        {
            title: "Name",
            dataIndex: "event_name",
            width: "20%"
        },
        {
            title: "Conducting date",
            dataIndex: "conducting_date",
            width: "20%"
        },
        {
            title: "Conducting by",
            dataIndex: "conducted_by",
            width: "20%"
        },
        {
            title: "Description",
            dataIndex: "description",
            width: "30%"
        },
        // {
        //     title: "Details",
        //     dataIndex: "details",
        //     width: "10%",
        //     render: (value: any, record: any) => {
        //         return <Button icon={<UnorderedListOutlined />} onClick={() => navigate(`/branches/${record.branch_id}`)} />
        //     }
        // }
    ]
    const [types, setTypes] = useState({
        event_name: { type: "Input" , length:"40"},
        conducting_date: { type: "Date" },
        conducted_by: { type: "Input", length:"20"},
        description: { type: "TextArea" , length:"200"}
    })
    const [newEventData, setNewStudentData] = useState(initialData)
    const [auditoriums, setAuditoriums] = useState<any>([])
    const [requiredFieldsModel, setRequiredFieldsModel] = useState({
        event_name: "",
        conducting_date: "",
        conducted_by: "",
        description: "",
    })

    useEffect(() => {
        if (isSaveButtonClicked) {
            const error = validateFields(newEventData, requiredFieldsModel)
            if (error) {
                ShowToast("error", error.errorMessage)
                setIsSaveButtonClicked(false)
            }
            else {
                addEvent()
            }
        }
    }, [isSaveButtonClicked])

    function addEvent() {
        Promise.all([
            ApiServices.post("auditoriums", newEventData)
        ]).then(([auditoriumData]) => {
            if (auditoriumData?.error) {
                ShowToast("error", auditoriumData.error)
            }
            else {
                ShowToast("success", "Successfully added the Event.")
                setAuditoriums([
                    ...auditoriums,
                    auditoriumData,
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
            ApiServices.get("auditoriums")
        ]).then(([auditoriumsData]) => {
            // let auditoriums: any = []
            if (auditoriumsData.error) {
                ShowToast("error", auditoriumsData.error)
            }
            else {
                setAuditoriums(auditoriumsData)
            }
        }).catch((err) => {
            ShowToast("error", "Error occurred while getting auditoriums")
        })
    }, [])

    return <div>
        <h1>Auditorium</h1>
        {hasPermission === "admin" && <Button type="primary" onClick={() => setShowModel(true)}>Add Event</Button>}
        <Table
            dataSource={auditoriums}
            columns={columns}
            pagination={false}
        />
        {<Modal
            open={showModel}
            width={700}
            title={"Add Event"}
            onOk={() => {
                setIsSaveButtonClicked(true);
            }}
            onCancel={() => {
                setShowModel(false)
                setNewStudentData(initialData)
            }}
        >
            <ShowFieldsUsingTypes
                types={types }
                borderColors={requiredFieldsModel}
                data={newEventData}
                setData={setNewStudentData}
            />
        </Modal>}
    </div>
}