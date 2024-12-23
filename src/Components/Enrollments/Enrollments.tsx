import { Button, Input, Modal, Table } from "antd";
import { useEffect, useState } from "react"
import ApiServices from "../../ApiServices";
import { ShowToast } from "../CommonComponents";
import { UnorderedListOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom";

export default function Enrollments() {
    const [enrollments, setEnrollments] = useState([])
    const navigate = useNavigate()
    const Columns = [
        {
            title: "Name",
            dataIndex: "first_name",
            width: "20%"
        },
        {
            title: "Class",
            dataIndex: "class",
            width: "20%"
        },
        {
            title: "Branch",
            dataIndex: "department_name",
            width: "20%"
        },
        {
            title: "Enroll Status",
            dataIndex: "is_enrolled",
            width: "20%",
            render: (value: any, record: any) => {
                return <>{value.toString()}</>
            }
        },
        {
            title: "Details",
            dataIndex: "details",
            render: (value: any, record: any) => {
                return <Button icon={<UnorderedListOutlined />} onClick={() => navigate(`/enrollments/${record.enrollment_id}`)} />
            }
        }
    ]

    useEffect(() => {
        Promise.all([
            ApiServices.get("enrollments"),
        ]).then(([enrollmentsData]) => {
            let enrollments: any = []
            if (enrollmentsData.error) {
                ShowToast("error", enrollmentsData.error)
            }
            else {
                setEnrollments(enrollments)
            }
        }).catch((err) => {
            ShowToast("error", "Error occurred while getting organizations")
        })
    }, [])


    useEffect(() => {
        Promise.all([
            ApiServices.get("enrollments")
        ]).then(([libraryData]) => {
            if (libraryData.error) {
                ShowToast("error", libraryData.error)
            }
            else {
                setEnrollments(libraryData)
            }
        }).catch((err) => {
            ShowToast("error", "Error occurred while getting library data.")
        })
    }, [])

    return <div>
        <Table
            columns={Columns}
            dataSource={enrollments}
        />
    </div>
}