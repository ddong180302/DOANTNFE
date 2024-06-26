import { ISkill } from "@/types/backend";
import { Badge, Descriptions, Drawer } from "antd";
import dayjs from 'dayjs';

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    dataInit: ISkill | null;
    setDataInit: (v: any) => void;
}
const ViewDetailSkill = (props: IProps) => {
    const { onClose, open, dataInit, setDataInit } = props;

    return (
        <>
            <Drawer
                title="Thông Tin Skill"
                placement="right"
                onClose={() => { onClose(false); setDataInit(null) }}
                open={open}
                width={"40vw"}
                maskClosable={false}
            >
                <Descriptions title="" bordered column={2} layout="vertical">
                    <Descriptions.Item label="Tên hiển thị">{dataInit?.name}</Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">{dataInit && dataInit.createdAt ? dayjs(dataInit.createdAt).format('DD-MM-YYYY HH:mm:ss') : ""}</Descriptions.Item>
                    <Descriptions.Item label="Ngày sửa">{dataInit && dataInit.updatedAt ? dayjs(dataInit.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ""}</Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    )
}

export default ViewDetailSkill;