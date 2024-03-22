import { Button, Divider, Form, Input, message, notification } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { callConfirm, callGetUserByEmail } from 'config/api';
import { useState, useEffect } from 'react';
import styles from 'styles/auth.module.scss';
import { IUser } from '@/types/backend';

interface IProps {
    dataRegister?: IUser | null;
}


const ConfirmPage = (props: IProps) => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const [isSendMail, setIsSendMail] = useState(false);

    const { dataRegister } = props;

    console.log("check data register: ", dataRegister);

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const callback = params?.get("callback");
    const _id = dataRegister?._id ?? "";
    const email = dataRegister?.email ?? "";
    const name = dataRegister?.name ?? "";

    const onFinish = async (values: any) => {
        const { codeConfirm } = values;
        setIsSubmit(true);
        const res = await callConfirm(_id, email, codeConfirm);
        setIsSubmit(false);
        if (res?.data) {
            message.success('Xác thực tài khoản thành công!');
            window.location.href = callback ? callback : '/login';
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
            <main className={styles.main}>
                <div className={styles.container}>
                    <section className={styles.wrapper}>
                        <div className={styles.heading}>
                            <h1>Đăng ký tài khoản cho Nice Job</h1>
                            <div style={{ fontSize: "16px", marginTop: "20px" }}>
                                <p>
                                    Chào mừng bạn đến với Nice Job!
                                    Tham gia cùng chúng tôi để tìm kiếm những thông tin việc làm hữu ích cần thiết,
                                    để giúp cho bạn có được một công việt IT như mong muốn.
                                    Vui lòng điền thông tin của bạn vào biểu mẫu bên dưới để tiếp tục.
                                </p>
                            </div>
                            <Divider />

                        </div>
                        <Form
                            name="basic"
                            // style={{ maxWidth: 600, margin: '0 auto' }}
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                            >
                                <div style={{ background: "rgb(223 249 225)", borderRadius: "10px", padding: "10px", fontSize: "14px", color: "rgb(5 91 12)" }}>
                                    <p>
                                        Chào mừng <b>{name}</b>, tài khoản của bạn đã được đăng ký thành công. Chúng tôi đã gửi cho bạn một email bao gồm mã kích hoạt đến địa chỉ email <b>{email}</b>. Vui lòng kiểm tra hộp thư đến của bạn để lấy mã.
                                        Nếu bạn không nhận được email chứa mã kích hoạt từ chúng tôi, vui lòng ấn <Button loading={isSendMail} type='primary' style={{ padding: "0 6px" }} onClick={() => handleSendMail()}>gửi lại</Button> email kích hoạt.
                                    </p>
                                </div>
                            </Form.Item>
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Mã Xác Nhận"
                                name="codeConfirm"
                                rules={[{ required: true, message: 'Mã xác nhận không được để trống!' }]}
                            >
                                <Input disabled={isSendMail} />
                            </Form.Item>

                            < Form.Item
                            // wrapperCol={{ offset: 6, span: 16 }}
                            >
                                <Button type="primary" htmlType="submit" loading={isSubmit} disabled={isSendMail}>
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

export default ConfirmPage;