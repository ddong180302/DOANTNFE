import { ModalForm } from "@ant-design/pro-components";
import { Col, Form, Input, Modal, Row, message, notification } from "antd";
import { FaCcPaypal } from "react-icons/fa";
import { PayPalButton } from "react-paypal-button-v2";
import { useEffect, useState } from "react";
import { callCreateJob, callUpdateJob } from "@/config/api";
import { useNavigate } from "react-router-dom";
interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    valueJob: any;
    valueJobUpdate: any;
    paymentAmountNew: any;
    idUpdate: any;
}


const CheckOut = (props: IProps) => {
    const { openModal, setOpenModal, valueJob, valueJobUpdate, paymentAmountNew, idUpdate } = props;
    const amount = valueJob?.paymentAmount || paymentAmountNew;
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const navigate = useNavigate();



    const addPaypalScript = () => {

        if (window.paypal) {
            setScriptLoaded(true)
            return
        }
        const script = document.createElement("script")
        script.src = "https://www.paypal.com/sdk/js?client-id=AeKY1AU4sXZR5LksiqtAytltxPWpB47o8z2IbA3CUUWKHBIhBaso72Rz9F1sajMbzMu5IdSsDvW-rSnQ";

        script.type = "text/javascript";
        script.async = true;
        script.onload = () => setScriptLoaded(true);
        document.body.appendChild(script);
    }

    useEffect(() => {
        addPaypalScript();
    }, [])

    const handlePaymentSuccess = async (details: any, data: any) => {
        if (details.status === "COMPLETED") {
            if (valueJob) {
                const res = await callCreateJob(valueJob);
                if (res.data) {
                    message.success("Tạo mới job thành công");
                    setOpenModal(false)
                    navigate('/hr/job')
                } else {
                    notification.error({
                        message: 'Có lỗi xảy ra',
                        description: res.message
                    });
                }
            }
            else if (valueJobUpdate) {
                const res = await callUpdateJob(valueJobUpdate, idUpdate);
                if (res.data) {
                    message.success("Cập nhật job thành công");
                    navigate('/hr/job')
                } else {
                    notification.error({
                        message: 'Có lỗi xảy ra',
                        description: res.message
                    });
                }
            }
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: "Thanh toán thất bại, vui lòng kiểm tra lại!"
            });
        }
    };

    return (
        <>

            <Modal
                title={"Thanh Toán"}
                open={openModal}
                footer={null}
                onCancel={() => setOpenModal(false)}
            >
                <Row gutter={16}>
                    <Col span={24} md={12}>
                        <FaCcPaypal style={{ fontSize: "200px" }} />
                    </Col>

                    {
                        valueJob &&
                        <Col span={24} md={12}>
                            <Form.Item
                                label="Tên Job"
                            >
                                <Input value={valueJob?.name} disabled />
                            </Form.Item>
                            <Form.Item
                                label="Số tiền phải trả"
                            >
                                <Input value={`${valueJob?.paymentAmount} $`} disabled />
                            </Form.Item>
                        </Col>
                    }
                    {
                        valueJobUpdate &&
                        <Col span={24} md={12}>
                            <Form.Item
                                label="Tên Job"
                            >
                                <Input value={valueJobUpdate?.name} disabled />
                            </Form.Item>
                            <Form.Item
                                label="Số tiền phải trả"
                            >
                                <Input value={`${paymentAmountNew} $`} disabled />
                            </Form.Item>
                        </Col>
                    }
                </Row>
                <Row>
                    {
                        scriptLoaded ? <PayPalButton
                            amount={amount}
                            onSuccess={handlePaymentSuccess}
                        /> : <span>loading...</span>
                    }
                </Row>
            </Modal>
        </>
    )
}

export default CheckOut;

