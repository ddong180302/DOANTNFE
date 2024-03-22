import { Button, Divider, Form, Input, message, notification } from 'antd';
import { useState } from 'react';
import styles from 'styles/auth.module.scss';
import { callConfirm, callGetUserByEmail } from '@/config/api';
import { IUser } from '@/types/backend';
import ResetPassPage from './resetPass';

interface IProps {
    dataforgot?: IUser | null;
}


const ConfirmForgotPage = (props: IProps) => {
    const { dataforgot } = props;
    const [isSubmit, setIsSubmit] = useState(false);
    const [isSendMail, setIsSendMail] = useState(false);
    const [showNewComponent, setShowNewComponent] = useState(false);
    const _id = dataforgot?._id ?? "";
    const email = dataforgot?.email ?? "";
    const name = dataforgot?.name ?? "";

    const onFinish = async (values: any) => {
        const { codeConfirm } = values;
        setIsSubmit(true);
        const res = await callConfirm(_id, email, codeConfirm);
        setIsSubmit(false);
        if (res?.data) {
            message.success('Xác thực tài khoản thành công!');
            setShowNewComponent(true);
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
    };

    const handleSendMail = async () => {
        setIsSendMail(true);
        const res = await callGetUserByEmail(email);
        setIsSendMail(false);
        if (res?.data?._id) {
            message.success('Gởi email xác thực tài khoản thành công!');
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
    }
    return (
        <div className={styles["login-page"]}>
            {!showNewComponent &&
                <main className={styles.main}>
                    <div className={styles.container}>
                        <section className={styles.wrapper}>
                            <div className={styles.heading}>
                                <h1>Xác Thực Tài Khoản</h1>
                                <div style={{ fontSize: "16px", marginTop: "20px" }}>
                                    <p>
                                        Chào mừng <b>{name}</b>. Chúng tôi đã gửi cho bạn một email bao gồm mã xác thực đến địa chỉ email của bạn. Vui lòng kiểm tra hộp thư đến của bạn để lấy mã.
                                        Nếu bạn không nhận được email chứa mã kích hoạt từ chúng tôi, vui lòng ấn <Button loading={isSendMail} type='primary' style={{ padding: "0 6px" }} onClick={() => handleSendMail()}>gửi lại</Button> email kích hoạt.
                                    </p>
                                </div>
                                <Divider />

                            </div>
                            <Form
                                name="basic"
                                onFinish={onFinish}
                                autoComplete="off"
                            >
                                <Form.Item
                                    labelCol={{ span: 24 }} //whole column
                                    label="Mã xác nhận"
                                    name="codeConfirm"
                                    rules={[{ required: true, message: 'Mã xác nhận không được để trống!' }]}
                                >
                                    <Input disabled={isSendMail} />
                                </Form.Item>

                                < Form.Item
                                >
                                    <Button type="primary" htmlType="submit" loading={isSubmit} disabled={isSendMail}>
                                        Xác Nhận
                                    </Button>
                                </Form.Item>
                            </Form>
                        </section>
                    </div>
                </main>
            }

            {
                showNewComponent &&
                <ResetPassPage
                    dataforgot={dataforgot}
                />
            }
        </div>
    )
}

export default ConfirmForgotPage;