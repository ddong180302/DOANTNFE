import { ModalForm, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row, message, notification } from "antd";
import { isMobile } from 'react-device-detect';
import { callCreateSkill, callUpdateSkill } from "@/config/api";
import { ISkill } from "@/types/backend";
import { useEffect } from "react";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: ISkill | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

const ModalSkill = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;

    const [form] = Form.useForm();

    useEffect(() => {
        if (openModal && dataInit) {
            form.setFieldsValue({
                name: dataInit.name,
            });
        } else {
            form.setFieldsValue({
                name: "",
            });
        }
    }, [openModal, dataInit, form]);


    const submitUser = async (valuesForm: any) => {
        const { name } = valuesForm;
        if (dataInit?._id) {
            //update
            const res = await callUpdateSkill(dataInit._id, name);
            if (res.data) {
                message.success("Cập nhật skill thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
            //create
            const res = await callCreateSkill(name);
            if (res.data) {
                message.success("Thêm mới skill thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    const handleReset = async () => {
        form.resetFields();
        setDataInit(null);
        setOpenModal(false);
    }
    return (
        <>
            <ModalForm
                title={<>{dataInit?._id ? "Cập nhật Skill" : "Tạo mới Skill"}</>}
                open={openModal}
                modalProps={{
                    onCancel: () => { handleReset() },
                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: isMobile ? "100%" : 900,
                    keyboard: false,
                    maskClosable: false,
                    okText: <>{dataInit?._id ? "Cập nhật" : "Tạo mới"}</>,
                    cancelText: "Hủy"
                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={submitUser}
                initialValues={dataInit?._id ? dataInit : {}}
            >
                <Row gutter={16}>

                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ProFormText
                            label="Tên skill"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập tên skill"
                        />
                    </Col>
                </Row>
            </ModalForm>
        </>
    )
}

export default ModalSkill;
