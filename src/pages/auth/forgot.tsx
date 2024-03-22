import { Button, Divider, Form, Input, message, notification } from 'antd';
import { useState } from 'react';
import styles from 'styles/auth.module.scss';
import { callGetUserByEmail } from '@/config/api';
import { IUser } from '@/types/backend';
import ConfirmForgotPage from './confirmForgot';

const ForgotPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const [showNewComponent, setShowNewComponent] = useState(false);
    const [dataforgot, setDataForgot] = useState<IUser | null>(null);

    const onFinish = async (values: any) => {
        const { email } = values;
        setIsSubmit(true);
        const res = await callGetUserByEmail(email);
        setIsSubmit(false);
        if (res?.data?._id) {
            setDataForgot(res?.data);
            setShowNewComponent(true);
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
                < main className={styles.main}>
                    <div className={styles.container}>
                        <section className={styles.wrapper}>
                            <div className={styles.heading}>
                                <h1>Quên mật khẩu</h1>
                                <div style={{ fontSize: "16px", marginTop: "20px" }}>
                                    <p>
                                        Bạn quên mật khẩu của mình? Đừng lo lắng! Hãy cung cấp cho chúng tôi email bạn sử dụng để đăng ký tài khoản Nice Job. Chúng tôi sẽ gửi cho bạn một mã xác nhận để xác nhận danh tính của bạn, sau đó bạn có thể đặt lại mật khẩu của bạn.
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
                                    label="Email Xác Nhận"
                                    name="email"
                                    rules={[{ required: true, message: 'Email xác nhận không được để trống!' }]}
                                >
                                    <Input />
                                </Form.Item>

                                < Form.Item
                                // wrapperCol={{ offset: 6, span: 16 }}
                                >
                                    <Button type="primary" htmlType="submit" loading={isSubmit}>
                                        Xác Nhận
                                    </Button>
                                </Form.Item>
                            </Form>
                        </section>
                    </div>
                </main>
            }
            {showNewComponent &&
                <ConfirmForgotPage
                    dataforgot={dataforgot}
                />
            }
        </div>
    )
}

export default ForgotPage;