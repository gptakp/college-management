import { Button, Layout as Layout, Menu, Select } from "antd";
import { isLinearGradient } from "html2canvas/dist/types/css/types/image";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout

export default function MainLayout({ children }: any) {
    const navigate = useNavigate();
    const [inlineCollapse, setInlineCollapse] = useState(false)
    const siderItems = [
        {
            label: "Home",
            key: "home"
        },
        {
            label: "Auditorium",
            key: "auditorium",
        },
        {
            label: "Library",
            key: "library",
        },
        {
            label: "About Us",
            key: "about"
        },
        {
            label: "Vision And Mission",
            key: "vision-and-mission"
        }
    ]

    return <Layout style={{ height: "100vh", width: "100%" }}>
        <>
            <Header style={{ height: "100px", borderBottom: "2px solid green" }}>
                <div style={{ height: "100%", display: "grid", gridTemplateColumns: "90% 10%" }}>
                    <div style={{ margin: "5px 0 0 -40px", textAlign: "left" }}>
                        <img src={`${window.location.origin}/clglogo.jpg` } style={{width:"1300px", height:"90px"}} />
                    </div>
                    {/* <div>
                        <Menu
                            theme="dark"
                            // items={headerItems}
                            style={{ height: "90%" }}
                            mode="horizontal"
                            onClick={(e) => {
                            }}
                            selectedKeys={[["about"].includes(window.location.pathname.split("/")[1]) ? "about" : "home"]}
                        />
                    </div> */}
                    <div>
                        <Button type="primary" style={{ float: "right", marginTop: "45px", background: 'linear-gradient(to right, #ff6900, #ff3346)'}} onClick={() => navigate("/login")}>
                            Login
                        </Button>
                    </div>
                </div>
            </Header>
            <Layout style={{ overflow: "hidden" }}>
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
                            selectedKeys={[window.location.pathname.split("/")[1]]}
                        />
                    </Sider>
                    <Layout style={{ overflow: "auto" }}>
                        <Content>
                            <div style={{ padding: "40px" }}>
                                {children}
                            </div>

                        </Content>
                    </Layout>
                </>
            </Layout>
        </>
    </Layout>
}