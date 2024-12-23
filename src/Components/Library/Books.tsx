import { useEffect, useState } from "react"
import ApiServices from "../../ApiServices"
import { ShowFieldsUsingTypes, ShowToast } from "../CommonComponents"
import { validateFields } from "../ValidateFields"
import { Button, Modal, Table } from "antd"
import { useNavigate } from "react-router-dom"
import { UnorderedListOutlined } from "@ant-design/icons"
import { useSelector } from "react-redux"

export default function Books() {
    const navigate = useNavigate()
    const [books, setBooks] = useState<any>([])
    const initialBookData = {
        title: "",
        author: "",
        publication: "",
    }
    const [newBookData, setNewBookData] = useState(initialBookData)
    const [types, setTypes] = useState({
        title: { type: "Input", length: 100 },
        author: { type: "Input", length: 60 },
        publication: { type: "Input", length: 40 },
    })
    const [isSaveButtonClicked, setIsSaveButtonClicked] = useState(false)
    const [showModel, setShowModel] = useState(false)
    const [requiredFieldsModel, setRequiredFieldsModel] = useState({
        title: "",
        author: "",
        publication: "",
    })
    const hasPermission = useSelector((state: any) => state?.user?.user?.role)
    const Columns = [
        {
            title: "Book Name",
            dataIndex: "title",
            width: "40%"
        },
        {
            title: "Author",
            dataIndex: "author",
            width: "40%"
        },
        {
            title: "Publication",
            dataIndex: "publication",
            width: "30%"
        },
        // {
        //     title: "Details",
        //     dataIndex: "details",
        //     render: (value: any, record: any) => {
        //         return <Button icon={<UnorderedListOutlined />} onClick={() => navigate(`/library/books/${record.book_id}`)} />
        //     }
        // }
    ]

    useEffect(() => {
        Promise.all([
            ApiServices.get("books")
        ]).then(([books]) => {
            if (books.error) {
                ShowToast("error", books.error)
            }
            else {
                setBooks(books)
            }
        })
    }, [])

    useEffect(() => {
        if (isSaveButtonClicked) {
            const error = validateFields(newBookData, requiredFieldsModel)
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
        Promise.all([
            ApiServices.post("books", newBookData)
        ]).then(([bookData]) => {
            if (bookData?.error) {
                ShowToast("error", bookData.error)
            }
            else {
                setShowModel(false)
                setBooks([
                    ...books,
                    bookData
                ])
                ShowToast("success", "Successfully added book.")
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
                        Add Book
                    </Button>}
                </>
            }
        </div>
        <Table
            columns={Columns}
            dataSource={books}
        />
        {<Modal
            open={showModel}
            width={700}
            title={"Add Book"}
            onOk={() => {
                setIsSaveButtonClicked(true);
            }}
            onCancel={() => {
                setShowModel(false)
                setNewBookData(initialBookData)
            }}
        >
            <ShowFieldsUsingTypes
                types={types}
                borderColors={requiredFieldsModel}
                data={newBookData}
                setData={setNewBookData}
            />
        </Modal>}
    </div>
}