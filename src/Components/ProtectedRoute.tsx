import { useContext, useEffect } from "react";
import Layout from "./Layout/Layout";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MainLayout from "./Home/MainLayout";

export default function ProtectedRoute({ children }: any) {
    const navigate = useNavigate()
    const data = useSelector((state: any) => state.user.user)

    console.log(data)
    useEffect(() => {
        if (window.location.pathname.split("/")[1] !== "/") {
            if (!data) {
                if (!["home", "auditorium", "library", "about", "vision-and-mission"].includes(window.location.pathname.split("/")[1])) {
                    navigate("/home")
                }
            }
        }
    }, [window.location.pathname])

    return data?.["role"] === "admin" ? <Layout>
        {children}
    </Layout>
        : <MainLayout>
            {children}
        </MainLayout>
}