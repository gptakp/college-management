import { Table } from "antd";
import { ShowToast } from "../CommonComponents";
import ApiServices from "../../ApiServices";
import { useEffect, useState } from "react";

export default function DepartmentClasses(props: any) {
    const [classes, setClasses] = useState([])

    useEffect(() => {
        Promise.all([
            ApiServices.get(`branches/${props.branchId}/classes`)
        ]).then(([classesData]) => {
            if (classesData.error) {
                ShowToast("error", classesData.error)
            }
            else {
                setClasses(classesData)
            }
        }).catch((err) => {
            ShowToast("error", "Error occurred while getting classes")
        }).finally(() => {
        })
    }, [])

    return <div className="content-body">
        <Table
            dataSource={classes}
            columns={
                [
                    {
                        title: "Class Name",
                        dataIndex: "name",
                        width: "30%"
                    },
                    {
                        title: "schedule",
                        dataIndex: "schedule",
                        width: "50%",
                        render: (value: any, record: any) => {
                            return <>
                                <div>
                                    {Object.entries(value).map(([key, value]: any): any => {
                                        return <div key={key} style={{ display: "grid", gridTemplateColumns: "40% 20% 40%" }}>
                                            <div>
                                                {key}
                                            </div>
                                            <div>
                                                -
                                            </div>
                                            <div>
                                                {value}
                                            </div>
                                        </div>
                                    })}
                                </div>
                            </>
                        }
                    },
                    {
                        title: "Room No",
                        dataIndex: "room_no",
                        width: "20%"
                    },
                ]
            }
        />
    </div>
}