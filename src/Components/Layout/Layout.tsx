import { Button, Layout as MainLayout, Menu, Select } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLoaded } from "../../UserReducer";
import React from "react";

const { Header, Sider, Content } = MainLayout

export default function Layout({ children }: any) {
    const navigate = useNavigate();
    const [inlineCollapse, setInlineCollapse] = useState(false)
    const data = useSelector((state: any) => state.user.user)
    const dispatch = useDispatch()
    const siderItems: any = [
        {
            label: "Branches",
            key: "branches"
        },
        {
            label: "Students",
            key: "students",
        },
        {
            label: "Lecturers",
            key: "lecturers",
        },
        {
            label: "Enrollments",
            key: "enrollments",
        },
        {
            label: "Classes",
            key: "classes",
        },
        // {
        //     label: "Attendance",
        //     key: "attendance",
        // },
        {
            label: "Library",
            key: "library",
        },
        {
            label: "Fees",
            key: "fees"
        },
        // {
        //     label: "Sports",
        //     key: "sports",
        // },
        // {
        //     label: "Mess",
        //     key: "mess",
        // },
        {
            label: "Auditorium",
            key: "auditorium",
        },
    ];
    const headerItems: any = [
        {
            label: "Home",
            key: "home",
            style: { width: "100px", textAlign: "center" }
        },
        {
            label: "About",
            key: "about",
            style: { width: "100px", textAlign: "center" }
        },
    ];

    return <MainLayout style={{ height: "100vh", width: "100%" }}>
        <>
            <Header style={{ height: "60px", borderBottom: "2px solid green" }}>
                <div style={{ height: "100%", display: "grid", gridTemplateColumns: "90% 10%" }}>
                    <div>
                        <Menu
                            theme="dark"
                            items={headerItems}
                            style={{ marginLeft: "210px", height: "90%" }}
                            mode="horizontal"
                            onClick={(e) => {
                                navigate("/" + (e.key === "home" ? "students" : e.key));
                            }}
                            selectedKeys={[["about"].includes(window.location.pathname.split("/")[1]) ? "about" : "home"]}
                        />
                    </div>
                    <div>
                        <Button type="primary" style={{ float: "right", marginTop: "15px" }} onClick={() => { dispatch(userLoaded({})); navigate("/about") }}>
                            Home
                        </Button>
                    </div>
                </div>
            </Header>
            <MainLayout style={{ overflow: "hidden" }}>
                <>
                    <Sider
                        style={{ height: "100vh", borderRight: "2px solid green", overflow: "auto" }}
                        width={"260px"}
                        theme="dark"
                        collapsedWidth={60}
                        breakpoint="xl"
                        onCollapse={() => setInlineCollapse(!inlineCollapse)}
                    >
                        <Menu
                            items={siderItems}
                            theme="dark"
                            // items={isLoggedIn ? siderItems : withoutLoginSiderItems}
                            onClick={(e) => {
                                navigate("/" + e.key)
                            }}
                            inlineCollapsed={inlineCollapse}
                            // style={{ backgroundColor: "#FAFAFA" }}
                            selectedKeys={[window.location.pathname.split("/")[1]]}
                        />
                    </Sider>
                    <MainLayout style={{ overflow: "auto" }}>
                        <Content style={{ padding: "40px" }}>
                            {children}
                        </Content>
                    </MainLayout>
                </>
            </MainLayout>
        </>
    </MainLayout >
}