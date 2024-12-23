import { Button, Input, Modal } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiServices from "../ApiServices";
import { useDispatch, useSelector } from "react-redux";
import { userLoaded } from "../UserReducer";
import { ShowToast } from "./CommonComponents";

import backgroundImage from "./C:/Users/gurug/Desktop/college manage/c-m-s/public/backgg.jpg";

export default function Login() {
    const [credentials, setCredentials] = useState({ username: "", password: "" })
    const [borderColors, setBorderColors] = useState({ username: "", password: "" })
    const [onLogin, setOnLogin] = useState<boolean>(false);
    const [onValidate, setOnValidate] = useState<boolean>(false);
    const navigate = useNavigate()
    const [loginData, setLoginData] = useState<any>({})
    const [showModel, setShowModel] = useState(false)
    const dispatch = useDispatch()
    const [otp, setOtp] = useState("")
    const [isOtpSent, setIsOtpSent] = useState(false)
    const [otpBorderColor, setOtpBorderColor] = useState("")

    useEffect(() => {
        if (onLogin) {
            let borderColorsObject: any = {
                username: "",
                password: ""
            };
            let fields: any = [];
            Object.entries(credentials).map(([key, value]) => {
                if (key !== "type")
                    if (value === "" || value === null) {
                        fields.push(key);
                        borderColorsObject[key] = "red"
                    }
            })
            setBorderColors(borderColorsObject);
            if (fields.length !== 0) {
                ShowToast("error", "Please fill the following fields: " + fields.toString());
                setOnLogin(false);
            }
            else {
                login()
            }
        }
    }, [onLogin])

    useEffect(() => {
        if (onValidate) {
            if (otp.length !== 0) {
                Promise.all([
                    ApiServices.get(`otp/${loginData["user_id"]}/${otp}`)
                ]).then(([otpData]) => {
                    if (otpData?.status === "failed" || otpData?.error) {
                        ShowToast("error", otpData?.error)
                    }
                    else {
                        setOtpBorderColor("")
                        navigate("/branches")
                        dispatch(userLoaded({ "email": loginData["email"], user_id: loginData["user_id"], role: loginData["role"] }))
                        ShowToast("success", "Successfully logged in.")
                    }
                }).finally(() => {
                    setOnValidate(false);
                })
            }
            else {
                setOtpBorderColor("red")
                setOnValidate(false)
            }
        }
    }, [onValidate])

    function login() {
        Promise.all([
            ApiServices.get("login", credentials)
        ]).then(([loginData]) => {
            if (loginData?.error) {
                ShowToast("error", loginData?.error)
            }
            else {
                localStorage.setItem("userId", loginData.uid)
                if (loginData.role === "admin") {
                    setLoginData(loginData)
                    setShowModel(true)
                    sendOtp(loginData["user_id"])
                }
                else {
                    navigate("/about")
                }
            }
        }).finally(() => {
            setOnLogin(false);
        })
    }

    function sendOtp(userId: string) {
        Promise.all([
            ApiServices.post("otp", { user_id: userId })
        ]).then(([otpSend]) => {
            if (otpSend?.error) {
                if (otpSend?.error === "Otp already sent.") {
                    setIsOtpSent(true)
                }
                ShowToast("error", otpSend?.error)
            }
            else {
                setIsOtpSent(true)
                ShowToast("success", "Otp sent successfully.")
            }
        })
    }

    return <div className="login">
        <div style={{color:"white", border:"1px solid white",  padding:"5%", backdropFilter:"blur(10px)", borderRadius:"10px"}}>
            <h2 style={{ marginLeft: "100px" }}>Login</h2>
            <div>
                <Input
                    style={{ width: "250px", borderColor: borderColors.username }}
                    placeholder="Username"
                    onChange={(e) => {
                        setCredentials({
                            ...credentials,
                            username: e.target.value
                        });
                    }}
                />
            </div>
            <div style={{ marginTop: "20px" }}>
                <Input.Password
                    style={{ width: "250px", borderColor: borderColors.password }}
                    placeholder="Password"
                    onChange={(e) => {
                        setCredentials({
                            ...credentials,
                            password: e.target.value
                        });
                    }}
                />
            </div>
            <div style={{ margin: "20px 0 0 100px" }}>
                <Button
                    type="primary"
                    onClick={() => {
                        setOnLogin(true)
                    }}
                >
                    Login
                </Button>
            </div>
        </div>
        <Modal
            open={showModel}
            title={"Otp"}
            onCancel={() => setShowModel(false)}
            onOk={() => setOnValidate(true)}
            okText={"Validate Otp"}
        >
            <div>
                <Input
                    style={{ width: "250px", borderColor: otpBorderColor }}
                    onChange={(e) => {
                        setOtp(e.target.value)
                    }}
                />
            </div>
            {isOtpSent && <div>
                otp sent successfully
            </div>}
        </Modal>
    </div>
}