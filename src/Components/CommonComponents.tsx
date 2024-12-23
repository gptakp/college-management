import { Button, Checkbox, DatePicker, Input, InputNumber, Select, Upload } from "antd";
import { getBase64, returnDatePickerSelectedValue, returnDatePickerValue } from "./Utils";
import { ShowFieldsUsingTypesType } from "./Types";
import { UploadOutlined } from "@ant-design/icons"
import { message as Toast } from "antd"
import { useSelector } from "react-redux";

export function ShowToast(type: string, message: string) {
    if (type == "error") {
        Toast.error(message);
    }
    else if (type === "success") {
        Toast.success(message);
    }
}


export function ShowFieldsUsingTypes(props: ShowFieldsUsingTypesType) {
    const { types, setData, data, borderColors, isEdit } = props;
    const hasPermission = useSelector((state: any) => state?.user?.user?.role)
    console.log(hasPermission)

    return <div>
        {
            Object.entries(types).map(([key, value]): any => {
                return <div key={key} style={{ display: "grid", gridTemplateColumns: "50% 50%", gridRowGap: "20px", marginTop: "10px" }}>
                    <div>{key}{borderColors?.[key] !== undefined && <span style={{ color: "red" }}>*</span>}: </div>
                    {((isEdit || isEdit === undefined) && value.type !== "Text" && hasPermission === "admin") ? value.type === "Select"
                        ? <Select
                            options={value?.options}
                            showSearch={true}
                            style={{ borderColor: borderColors?.[key] }}
                            onChange={(value) => {
                                setData({
                                    ...data,
                                    [key]: value
                                })
                            }}
                            mode={value?.mode}
                            value={data?.[key]}
                        />
                        : value.type === "Date" ?
                            <DatePicker
                                value={returnDatePickerValue(data?.[key])}
                                style={{ borderColor: borderColors?.[key] }}
                                picker="date"
                                format={"YYYY-MM-DD"}
                                onChange={(dateString, date) => {
                                    setData({
                                        ...data,
                                        [key]: returnDatePickerSelectedValue(dateString, date)
                                    })
                                }}
                            />
                            : value.type === "CheckBox" ?
                                <Checkbox
                                    style={{ borderColor: borderColors?.[key] }}
                                    checked={data?.[key]}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            [key]: e.target.checked
                                        })
                                    }}
                                />
                                : value.type === "TextBox" ?
                                    <Input.TextArea
                                        style={{ borderColor: borderColors?.[key] }}
                                        maxLength={value?.length}
                                        value={data?.[key]}
                                        onChange={(e) => {
                                            setData({
                                                ...data,
                                                [key]: e.target.value
                                            });
                                        }}
                                    />
                                    : value.type === "Image" ?
                                        <Upload
                                            name="avatar"
                                            listType="picture"
                                            showUploadList={false}
                                            onChange={async (FileList: any) => {
                                                if (FileList.file.originFileObj) {
                                                    await getBase64(FileList.file.originFileObj).then((response) => {
                                                        setData({
                                                            ...data,
                                                            [key]: response
                                                        })
                                                    });
                                                }
                                            }}
                                            beforeUpload={(file) => {
                                            }}
                                        > <Button icon={<UploadOutlined />}>Upload</Button>
                                        </Upload>
                                        : value.type === "Number" ?
                                            <InputNumber
                                                value={data?.[key]}
                                                style={{ borderColor: borderColors?.[key], width: key === "contact_no" ? "300px" : "" }}
                                                max={value?.length}
                                                min={0}
                                                type="number"
                                                onChange={(value) => {
                                                    setData({
                                                        ...data,
                                                        [key]: value
                                                    })
                                                }}
                                            />
                                            : <Input
                                                value={data?.[key]}
                                                style={{ borderColor: borderColors?.[key] }}
                                                maxLength={value?.length}
                                                onChange={(e) => {
                                                    setData({
                                                        ...data,
                                                        [key]: e.target.value
                                                    })
                                                }}
                                            />
                        : <div>{Array.isArray(data?.[key]) ?
                            data?.[key].map((element: any) => {
                                return <Button>{element}</Button>
                            })
                            : value.type === "Image" ? <img src={data[key]} width={"250px"} height={"250px"} />
                                : value.type === "CheckBox" ?

                                    <>{data?.[key] ? "True" : "False"}</>
                                    : <>{data?.[key]}</>
                        }</div>
                    }
                </div>
            })
        }
    </div>
}

export const Constants = {
    event_name: "Event Name",
    conducting_date: "Conducting Date",
    conducted_by: "Conducted By",
    description: "Description",
}