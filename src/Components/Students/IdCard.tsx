import { Button, Skeleton } from "antd"
import { useEffect, useRef, useState } from "react"
import ApiServices from "../../ApiServices"
import { ShowToast } from "../CommonComponents"
import html2canvas from "html2canvas"

export default function IdCard() {
    const [data, setData] = useState<any>({})
    const backgroundImge = `${window.location.origin}/ecardbgfinal.png`
    const css = {
        backgroundImage: `url(${backgroundImge})`,
    }
    const [loading, setLoading] = useState(false)
    const cardRef = useRef(null);

    useEffect(() => {
        setLoading(true)
        Promise.all([
            ApiServices.get(`enrollments/${window.location.pathname.split("/")[2]}`),
        ]).then(([studentData]) => {
            if (studentData?.error) {
                ShowToast("error", studentData?.error)
            }
            else {
                setData(studentData)
            }
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setLoading(false)
        })
    }, [])

    const handleDownload = () => {
        if (cardRef.current) {
            html2canvas(cardRef.current).then((canvas: any) => {
                const dataURL = canvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.href = dataURL;
                link.download = "id_card.png";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        }
    };

    return <Skeleton loading={loading}>
        <div className="container">
            <div className="padding">
                <div className="font" style={css} ref={cardRef}>
                    <div className="top">
                        <img src={data.img_data} />
                    </div>
                    <div className="">
                        <div className="ename">
                            
                        </div>
                        <div className="edetails">
                         <p><b>Name :</b> {data?.first_name+" "+data?.last_name}</p>
                            <p><b>pin no:</b> {data?.id}</p>
                            <p><b>Mobile No :</b> {data?.contact_no}</p>
                            <p><b>DOB :</b> {data?.dob}</p>
                        </div>
                    </div>
                </div>
            </div>
            <Button onClick={handleDownload} style={{ marginTop: "10px" }}>
                Download Photo
            </Button>
        </div>
    </Skeleton>
}