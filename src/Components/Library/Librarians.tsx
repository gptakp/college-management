import { useEffect, useState } from "react"
import ApiServices from "../../ApiServices"
import { ShowFieldsUsingTypes, ShowToast } from "../CommonComponents"
import { validateFields } from "../ValidateFields"
import { Button, Modal, Table } from "antd"
import { useSelector } from "react-redux"

export default function Librarians() {
    const [librarians, setLibrarians] = useState<any>([])
    const initialLibrarianData = {
        name: "",
        contact_no: "",
    }
    const [newLibrarianData, setNewLibrarianData] = useState(initialLibrarianData)
    const [types, setTypes] = useState({
        name: { type: "Input", length: 30 },
        contact_no: { type: "Number", length: 9999999999 },
    })
    const [isSaveButtonClicked, setIsSaveButtonClicked] = useState(false)
    const [showModel, setShowModel] = useState(false)
    const [requiredFieldsModel, setRequiredFieldsModel] = useState({
        name: "",
        contact_no: "",
    })
    const Columns = [
        {
            title: "Name",
            dataIndex: "name",
            width: "30%"
        },
        {
            title: "Contact no",
            dataIndex: "contact_no",
            width: "30%"
        },
    ]
    const hasPermission = useSelector((state: any) => state?.user?.user?.role)

    useEffect(() => {
        Promise.all([
            ApiServices.get("librarians")
        ]).then(([librarians]) => {
            if (librarians.error) {
                ShowToast("error", librarians.error)
            }
            else {
                setLibrarians(librarians)
            }
        })
    }, [])

    useEffect(() => {
        if (isSaveButtonClicked) {
            const error = validateFields(newLibrarianData, requiredFieldsModel)
            if (error) {
                ShowToast("error", error.errorMessage)
                setRequiredFieldsModel(error.borderColorsObject)
                setIsSaveButtonClicked(false)
            }
            else {
                addBook()
            }
        }
    }, [isSaveButtonClicked])

    function addBook() {
        newLibrarianData["contact_no"] = newLibrarianData["contact_no"].toString()
        Promise.all([
            ApiServices.post("librarians", newLibrarianData)
        ]).then(([librarianData]) => {
            if (librarianData?.error) {
                ShowToast("error", librarianData.error)
            }
            else {
                setShowModel(false)
                setLibrarians([
                    ...librarians,
                    librarianData
                ])
                ShowToast("success", "Successfully added librarian.")
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
                        Add librarian
                    </Button>}
                </>
            }
        </div>
        <Table
            columns={Columns}
            dataSource={librarians}
        />
        {<Modal
            open={showModel}
            width={700}
            title={"Add Librarian"}
            onOk={() => {
                setIsSaveButtonClicked(true);
            }}
            onCancel={() => {
                setShowModel(false)
                setNewLibrarianData(initialLibrarianData)
            }}
        >
            <ShowFieldsUsingTypes
                types={types}
                borderColors={requiredFieldsModel}
                data={newLibrarianData}
                setData={setNewLibrarianData}
            />
        </Modal>}
    </div>
}