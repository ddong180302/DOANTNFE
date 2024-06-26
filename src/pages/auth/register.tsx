import { Button, Divider, Form, Input, Row, Select, message, notification } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { callRegister } from 'config/api';
import styles from 'styles/auth.module.scss';
import { IUser } from '@/types/backend';
import ConfirmPage from './confirm';
import { ProFormDigit } from '@ant-design/pro-components';
const { Option } = Select;


const RegisterPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const [showNewComponent, setShowNewComponent] = useState(false);
    const [dataRegister, setDataRegister] = useState<IUser | null>(null);

    const onFinish = async (values: IUser) => {
        const { name, email, password, age, gender, address, phone } = values;
        setIsSubmit(true);
        const res = await callRegister(name, email, password as string, +age, gender, address, phone);
        setIsSubmit(false);
        if (res?.data?._id) {
            message.success('Đăng ký tài khoản thành công!');
            setDataRegister(res?.data);
            setShowNewComponent(true);
            //navigate('/confirm', { state: { name, email, _id } });
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
        <div className={styles["register-page"]} >

            {
                !showNewComponent && <main className={styles.main} >
                    <div className={styles.container} >
                        <section className={styles.wrapper} >
                            <div className={styles.heading} >
                                <h2 className={`${styles.text} ${styles["text-large"]}`}> Đăng Ký Tài Khoản </h2>
                                < Divider />
                            </div>
                            < Form<IUser>
                                name="basic"
                                // style={{ maxWidth: 600, margin: '0 auto' }}
                                onFinish={onFinish}
                                autoComplete="off"
                            >
                                <Form.Item
                                    labelCol={{ span: 24 }} //whole column
                                    label="Họ tên"
                                    name="name"
                                    rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                                >
                                    <Input />
                                </Form.Item>


                                <Form.Item
                                    labelCol={{ span: 24 }
                                    } //whole column
                                    label="Email"
                                    name="email"
                                    rules={[{ required: true, message: 'Email không được để trống!' }]}
                                >
                                    <Input type='email' />
                                </Form.Item>

                                <Form.Item
                                    labelCol={{ span: 24 }} //whole column
                                    label="Mật khẩu"
                                    name="password"
                                    rules={[
                                        {
                                            required: true, message: 'Mật khẩu không được để trống!'
                                        },
                                        {
                                            min: 6,
                                            max: 12,
                                            message: 'Mật khẩu phải có từ 6 đến 12 ký tự!'
                                        }
                                    ]}
                                >
                                    <Input.Password />
                                </Form.Item>


                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Tuổi"
                                    name="age"
                                    rules={[
                                        { required: true, message: 'Tuổi không được để trống!' },
                                        { type: 'number', min: 0, max: 99, message: 'Tuổi phải nhỏ hơn 100!' }
                                    ]}
                                >
                                    <ProFormDigit
                                        placeholder="Nhập số tuổi"
                                        fieldProps={{ max: 99 }}
                                    />
                                </Form.Item>


                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    name="gender"
                                    label="Giới tính"
                                    rules={[{ required: true, message: 'Giới tính không được để trống!' }]}
                                >
                                    <Select
                                        allowClear
                                        popupMatchSelectWidth
                                    >
                                        <Option value="MALE">Nam</Option>
                                        <Option value="FEMALE">Nữ</Option>
                                        <Option value="OTHER">Khác</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    labelCol={{ span: 24 }} //whole column
                                    label="Địa chỉ"
                                    name="address"
                                    rules={[{ required: true, message: 'Địa chỉ không được để trống!' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Số điện thoại"
                                    name="phone"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Số điện thoại không được để trống!'
                                        },
                                        {
                                            pattern: /^[0-9]+$/,
                                            message: 'Vui lòng chỉ nhập số điện thoại!'
                                        },
                                        {
                                            min: 10,
                                            max: 11,
                                            message: 'Số điện thoại phải có từ 10 đến 11 số!'
                                        }
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

                                < Form.Item
                                // wrapperCol={{ offset: 6, span: 16 }}
                                >
                                    <Button type="primary" htmlType="submit" loading={isSubmit} >
                                        Đăng ký
                                    </Button>
                                </Form.Item>
                                <Divider> Or </Divider>
                                <p className="text text-normal" > Đã có tài khoản ?
                                    <span>
                                        <Link to='/login' > Đăng Nhập </Link>
                                    </span>
                                </p>
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

export default RegisterPage;