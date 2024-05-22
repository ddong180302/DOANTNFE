import { ISubscribers } from "@/types/backend";
import { Descriptions, Drawer, Tag } from "antd";
import dayjs from 'dayjs';

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    dataInit: ISubscribers | null;
    setDataInit: (v: any) => void;
}
const ViewDetailSubcriber = (props: IProps) => {
    const { onClose, open, dataInit, setDataInit } = props;

    return (
        <>
            <Drawer
                title="Thông Tin Subscriber"
                placement="right"
                onClose={() => { onClose(false); setDataInit(null) }}
                open={open}
                width={"40vw"}
                maskClosable={false}
            >
                <Descriptions title="" bordered column={2} layout="vertical">
                    <Descriptions.Item label="Tên người theo dõi">{dataInit?.name}</Descriptions.Item>
                    <Descriptions.Item label="Email">{dataInit?.email}</Descriptions.Item>
                    <Descriptions.Item label="Kỹ năng theo dõi">
                        {dataInit?.skills?.map((skill: string) => {
                            let color = skill.length > 5 ? 'geekblue' : 'green';
                            if (skill === 'loser') {
                                color = 'volcano';
                            }
                            return (
                                <Tag color={color} key={skill}>
                                    {skill.toUpperCase()}
                                </Tag>
                            );
                        })}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">{dataInit && dataInit.createdAt ? dayjs(dataInit.createdAt).format('DD-MM-YYYY HH:mm:ss') : ""}</Descriptions.Item>
                    <Descriptions.Item label="Ngày sửa">{dataInit && dataInit.updatedAt ? dayjs(dataInit.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ""}</Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    )
}

export default ViewDetailSubcriber;