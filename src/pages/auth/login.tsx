import { Button, Divider, Form, Input, message, notification } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { callGetUserByEmail, callLogin } from 'config/api';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserLoginInfo } from '@/redux/slice/accountSlide';
import styles from 'styles/auth.module.scss';
import { useAppSelector } from '@/redux/hooks';
import { IUser } from '@/types/backend';
import ConfirmPage from './confirm';

const LoginPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const [isSendMail, setIsSendMail] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [email, setEmail] = useState("");
    const [showNewComponent, setShowNewComponent] = useState(false);
    const [dataRegister, setDataRegister] = useState<IUser | null>(null);
    const dispatch = useDispatch();
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const callback = params?.get("callback");

    useEffect(() => {
        //đã login => redirect to '/'
        if (isAuthenticated) {
            // navigate('/');
            window.location.href = '/';
        }
    }, [])



    const onFinish = async (values: any) => {
        const { username, password } = values;
        setIsSubmit(true);
        const res = await callLogin(username, password);
        setIsSubmit(false);
        if (res?.data) {
            localStorage.setItem('access_token', res.data.access_token);
            dispatch(setUserLoginInfo(res.data.user))
            message.success('Đăng nhập tài khoản thành công!');
            window.location.href = callback ? callback : '/';
        } else if (res?.statusCode === 400) {
            setShowConfirm(true);
            setEmail(username);

            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
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
            setDataRegister(res?.data);
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
            {
                !showNewComponent &&
                <main className={styles.main}>
                    <div className={styles.container}>
                        <section className={styles.wrapper}>
                            <div style={{ alignItems: "center", display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                                <img style={{ width: "100px" }} src="/logo/logo.jpg" alt="Logo" />
                            </div>
                            <div style={{ alignItems: "center", display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                                <div className={styles.heading}>
                                    <h2 className={`${styles.text} ${styles["text-large"]}`}>Đăng Nhập Vào Nice Job</h2>
                                </div>
                            </div>
                            <Divider />
                            <Form
                                name="basic"
                                // style={{ maxWidth: 600, margin: '0 auto' }}
                                onFinish={onFinish}
                                autoComplete="off"
                            >
                                {showConfirm && ( // Hiển thị phần tử khi có lỗi
                                    <Form.Item style={{ color: 'red' }}>
                                        <div style={{ marginBottom: "10px" }}>Xác thực tài khoản</div>
                                        <Button type="primary" loading={isSendMail} onClick={() => handleSendMail()} style={{ textDecoration: "underline", cursor: "pointer" }}>Gửi lại email xác thực</Button>
                                    </Form.Item>
                                )}
                                <Form.Item
                                    labelCol={{ span: 24 }} //whole column
                                    label="Email"
                                    name="username"
                                    rules={[{ required: true, message: 'Email không được để trống!' }]}
                                >
                                    <Input disabled={isSendMail} />
                                </Form.Item>

                                <Form.Item
                                    labelCol={{ span: 24 }} //whole column
                                    label="Mật khẩu"
                                    name="password"
                                    rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}

                                >
                                    <Input.Password disabled={isSendMail} />
                                </Form.Item>

                                <Form.Item
                                // wrapperCol={{ offset: 6, span: 16 }}
                                >
                                    <Button style={{ width: "100%", marginTop: "10px" }} type="primary" htmlType="submit" loading={isSubmit} disabled={isSendMail}>
                                        Đăng nhập
                                    </Button>
                                </Form.Item>
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "0 20px" }}>
                                    <div>
                                        <p className="text text-normal">
                                            <span>
                                                <Link to='/forgot' > Quên mật khẩu? </Link>
                                            </span>
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text text-normal">
                                            <span>
                                                <Link to='/register' > Đăng Ký </Link>
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </Form>
                        </section>
                    </div>
                </main>
            }

            {
                showNewComponent
                &&
                <ConfirmPage
                    dataRegister={dataRegister}
                />
            }
        </div>
    )
}

export default LoginPage;