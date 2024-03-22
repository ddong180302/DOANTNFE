import { Button, Divider, Form, Input, message, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styles from 'styles/auth.module.scss';
import { IUser } from '@/types/backend';
import { callResetPass } from '@/config/api';

interface IProps {
    dataforgot?: IUser | null;
}

const ResetPassPage = (props: IProps) => {
    const { dataforgot } = props;
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const [passwordMatchError, setPasswordMatchError] = useState("");

    const _id = dataforgot?._id ?? "";
    const email = dataforgot?.email ?? "";

    const onFinish = async (values: any) => {
        const { password, confirmPassword } = values;
        if (password !== confirmPassword) {
            setPasswordMatchError("Mật khẩu và xác nhận mật khẩu không khớp.");
            return; // Dừng hàm nếu mật khẩu không khớp
        } else {
            setPasswordMatchError(""); // Reset thông báo lỗi nếu mật khẩu và xác nhận mật khẩu khớp nhau
        }
        setIsSubmit(true);
        const res = await callResetPass(_id, email, password);
        setIsSubmit(false);
        if (res?.data) {
            message.success('Thay đổi mật khẩu tài khoản thành công!');
            navigate("/login");
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
    };


    return (

        <div className={styles["login-page"]}>
            <main className={styles.main}>
                <div className={styles.container}>
                    <section className={styles.wrapper}>
                        <div style={{ alignItems: "center", display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                            <img style={{ width: "100px" }} src="/logo/logo.jpg" alt="Logo" />
                        </div>
                        <div style={{ alignItems: "center", display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                            <div className={styles.heading}>
                                <h2 className={`${styles.text} ${styles["text-large"]}`}>Quên Mật Khẩu</h2>
                            </div>
                        </div>
                        <Divider />
                        <Form
                            name="basic"
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            {passwordMatchError && (
                                <Form.Item style={{ color: 'red' }}>
                                    <div style={{ marginBottom: "10px" }}>{passwordMatchError}</div>
                                </Form.Item>
                            )}
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Mật khẩu Mới"
                                name="password"
                                rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Xác Nhận Mật khẩu Mới"
                                name="confirmPassword"
                                dependencies={['password']}
                                rules={[
                                    { required: true, message: 'Mật khẩu xác nhận không được để trống!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu xác nhận không khớp với mật khẩu đã nhập!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                            >
                                <Button style={{ width: "100%", marginTop: "10px" }} type="primary" htmlType="submit" loading={isSubmit}>
                                    Xác Nhận
                                </Button>
                            </Form.Item>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default ResetPassPage;