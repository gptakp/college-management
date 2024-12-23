import { useEffect, useState } from "react"
import ApiServices from "../../ApiServices"
import { ShowFieldsUsingTypes, ShowToast } from "../CommonComponents"
import { validateFields } from "../ValidateFields"
import { Button, Modal, Table } from "antd"
import { useSelector } from "react-redux"

export default function Installments() {
    const [installments, setInstallments] = useState<any>([])
    const [branches, setBranches] = useState([])
    const initialInstallmentsData = {
        installment_no: "",
        branch: "",
        amount: ""
    }
    const [newInstallmentData, setNewInstallmentData] = useState(initialInstallmentsData)
    const [types, setTypes] = useState({
        installment_no: { type: "Number", length: 12 },
        branch: { type: "Select", options: [] },
        amount: { type: "Input", length: 100000 }
    })
    const [isSaveButtonClicked, setIsSaveButtonClicked] = useState(false)
    const [showModel, setShowModel] = useState(false)
    const [requiredFieldsModel, setRequiredFieldsModel] = useState({
        installment_no: "",
        branch: "",
        amount: ""
    })
    const hasPermission = useSelector((state: any) => state?.user?.user?.role)
    const Columns = [
        {
            title: "Installment no",
            dataIndex: "installment_no",
            width: "30%"
        },
        {
            title: "Branch",
            dataIndex: "branch",
            width: "30%"
        },
        {
            title: "Amount",
            dataIndex: "amount",
            width: "30%"
        }
    ]

    useEffect(() => {
        Promise.all([
            ApiServices.get("installments"),
            ApiServices.get("branches"),
        ]).then(([installments, branches]) => {
            let branchesData: any = []
            if (installments.error) {
                ShowToast("error", installments.error)
            }
            else {
                setInstallments(installments)
            }
            if (branches.error) {
                ShowToast("error", branches.error)
            }
            else {
                setBranches(branches)
                branches.map((item: any) => {
                    let object: any = {}
                    object.value = item.branch_id
                    object.label = item.name
                    object.key = item.branch_id
                    branchesData.push(object)
                })
                setTypes({
                    ...types,
                    branch: { type: "Select", options: branchesData }
                })
            }
        })
    }, [])

    useEffect(() => {
        if (isSaveButtonClicked) {
            const error = validateFields(newInstallmentData, requiredFieldsModel)
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
            ApiServices.post("installments", newInstallmentData)
        ]).then(([installmentData]) => {
            if (installmentData?.error) {
                ShowToast("error", installmentData.error)
            }
            else {
                setShowModel(false)
                setInstallments([
                    installmentData,
                    ...installments
                ])
                ShowToast("success", "Successfully added installments.")
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
                        Add installment
                    </Button>}
                </>
            }
        </div>
        <Table
            columns={Columns}
            dataSource={installments}
        />
        {<Modal
            open={showModel}
            width={700}
            title={"Add installment"}
            onOk={() => {
                setIsSaveButtonClicked(true);
            }}
            onCancel={() => {
                setShowModel(false)
                setNewInstallmentData(initialInstallmentsData)
            }}
        >
            <ShowFieldsUsingTypes
                types={types}
                borderColors={requiredFieldsModel}
                data={newInstallmentData}
                setData={setNewInstallmentData}
            />
        </Modal>}
    </div>
}