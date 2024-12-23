import { Button, Modal, Tabs } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShowFieldsUsingTypes } from "../CommonComponents";
import { capturePhoto, startCamera } from "../Utils";
import ApiServices from "../../ApiServices";
import { validateEmail, validateFields } from "../ValidateFields";
import { ShowToast } from "../CommonComponents";
import { useSelector } from "react-redux";

export default function EnrollmentDetails() {
    const navigate = useNavigate()
    const splitPaths = window.location.pathname.split("/")
    const [data, setData] = useState({})
    const [editData, setEditData] = useState<any>({})
    const [isEdit, setIsEdit] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isSaveButtonClicked, setIsSaveButtonClicked] = useState(false)
    const [classes, setClasses] = useState([])
    const [types, setTypes] = useState({
        email: { type: "Text", length: 50 },
        first_name: { type: "Text", length: 30 },
        last_name: { type: "Text", length: 20 },
        date: { type: "Text" },
        class_id: { type: "Select", options: [] },
        img_data: { type: "Image" }
    })
    const [requiredFieldsModel, setRequiredFieldsModel] = useState({
        class_id: "",
        img_data: ""
    })
    const videoRef = useRef<any>();
    const canvasRef = useRef<any>();
    const [isCameraOpened, setIsCameraOpened] = useState(false)
    const [image, setImage] = useState()
    const hasPermission = useSelector((state: any) => state?.user?.user?.role)

    useEffect(() => {
        if (isSaveButtonClicked) {
            const error = validateFields(editData, requiredFieldsModel)
            if (error) {
                ShowToast("error", error.errorMessage)
                setRequiredFieldsModel(error?.borderColorsObject)
                setIsSaveButtonClicked(false)
            }
            else {
                updateEnrollments()
            }
        }
    }, [isSaveButtonClicked])

    function updateEnrollments() {
        Promise.all([
            ApiServices.put("enrollments", editData)
        ]).then(([enrollmentData]) => {
            if (enrollmentData?.status === "Success") {
                ShowToast("success", "Enrollment updated successfully.")
                setEditData(editData)
                setData(editData)
                setIsEdit(false)
            }
            else if (enrollmentData?.error) {
                ShowToast("error", enrollmentData.error)
            }
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setIsSaveButtonClicked(false)
        })
    }

    // function sendPhoto() {
    //     Promise.all([
    //         ApiServices.post(`frs`, { "image": image })
    //     ]).then(([enrollmentData]) => {
    //         console.log(enrollmentData)
    //     }).catch((err) => {
    //         console.log(err)
    //     }).finally(() => {
    //         setIsSaveButtonClicked(false)
    //     })
    // }

    useEffect(() => {
        Promise.all([
            ApiServices.get(`enrollments/${splitPaths[2]}`),
            ApiServices.get("classes")
        ]).then(([enrollmentData, classesData]) => {
            if (enrollmentData.error) {
                ShowToast("error", enrollmentData.error)
            }
            else {
                setEditData(enrollmentData)
                setData(enrollmentData)
            }
            if (classesData.error) {
                ShowToast("error", classesData.error)
            }
            else {
                let classes: any = []
                classesData.map((item: any) => {
                    let object: any = {}
                    object.label = item.name
                    object.key = item.class_id
                    object.value = item.class_id
                    classes.push(object)
                })
                setTypes({
                    ...types,
                    class_id: { type: "Select", options: classes },
                })
                setClasses(classesData)
            }
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setIsSaveButtonClicked(false)
        })
    }, [])

    return <div className="content-body">
        <div style={{ marginTop: "50px" }}>
            <div>{hasPermission === "admin" && <Button onClick={() => setIsEdit(!isEdit)}>{isEdit ? "Cancel" : "Edit"}</Button>}</div>
            <ShowFieldsUsingTypes
                types={types}
                data={editData}
                setData={setEditData}
                isEdit={isEdit}
            />
        </div>
        {/* <Modal
            open={isCameraOpened}
            onCancel={() => setIsCameraOpened(false)}
        >
            <video ref={videoRef} autoPlay muted style={{ width: "100%", height: "100%" }} />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            {image && <img src={image} style={{ maxWidth: '100%' }} />}
            <Button type="primary" size="large"
                // icon={< />}
                onClick={() => {
                    // setShowModel(true)
                    capturePhoto(canvasRef, videoRef, setImage)
                }}>
                Capture Photo
            </Button>
        </Modal> */}
        {isEdit && <div style={{ height: "40px", width: "100%" }}>
            <div style={{ float: "right", marginTop: "20px" }}>
                <Button onClick={() => setIsSaveButtonClicked(true)} type="primary">
                    Save
                </Button>
                <Button onClick={() => {
                    setEditData(data)
                    setIsEdit(false)
                }}
                    style={{ marginLeft: "15px" }}
                >
                    Cancel
                </Button>
            </div>
        </div>}
        {/* <Button type="primary" size="large" onClick={() => {
            startCamera(videoRef, setIsCameraOpened)
        }}>
            Start Camera
        </Button> */}
    </div>
}