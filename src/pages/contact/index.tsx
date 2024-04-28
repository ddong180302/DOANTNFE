import { ProFormSelect } from '@ant-design/pro-components';
import { Col, Input, Row, Form, Button, message, notification } from 'antd';
import { Link } from 'react-router-dom';
import styles from 'styles/client.module.scss';
import { LOCATION_LIST } from "@/config/utils";
import CompanyContact from '@/components/contact/company.contact';
import { useEffect, useState } from 'react';
import { callCreateContact, callgetUserAdmin } from '@/config/api';


const ContactPage = (props: any) => {
    const [form] = Form.useForm();

    const [userData, setUserData] = useState<any>();
    useEffect(() => {
        fetchData();
    }, [])
    const fetchData = async () => {
        const resUser = await callgetUserAdmin();
        setUserData(resUser?.data);
    };

    const onFinish = async (values: any) => {
        const { name, position, email, location, phone, nameCompany, websiteAddress } = values;
        const response = await callCreateContact(
            name, position, email, location, phone, nameCompany, websiteAddress
        );

        if (response.data) {
            form.resetFields();
            message.success("Gửi thông tin liên hệ thành công");
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: "Hãy thử lại một lần nữa!"
            });
        }
    };
    return (
        <div className={`${styles["container"]} ${styles["contact-section"]}`} style={{ marginTop: 20 }}>
            <Row gutter={[24, 24]} className={styles["contact"]}>
                <Col span={12} className={styles["contact-left"]}>

                    <div className={styles["top"]}>
                        <h2>Chiêu mộ nhân tài công nghệ cùng Nice Job</h2>
                        <p>Để lại thông tin liên hệ để nhận tư vấn từ Phòng Chăm sóc Khách hàng của Nice Job:</p>
                        <p>&#x2713;  Giúp bạn củng cố thương hiệu tuyển dụng với các giải pháp của Nice Job</p>
                        <p>&#x2713;  Tạo JD hấp dẫn để tiếp cận ứng viên IT chất lượng</p>
                        <p>&#x2713;  Thấu hiểu thị trường tuyển dụng ngành IT với những cập nhật mới nhất</p>
                        <p>Hotline: {userData?.address}    {userData?.phone}</p>
                        {/* //<p>Email: {userData?.email}</p> */}
                    </div>
                    <div className={styles["bottom"]}>
                        <div className={styles["header"]}>
                            Công ty hàng đầu sử dụng Nice Job
                        </div>
                        <div className={styles["body"]}>
                            <CompanyContact />
                        </div>
                    </div>
                </Col>
                <Col span={11} className={styles["contact-right"]}>
                    < Form
                        form={form}
                        name="basic"
                        autoComplete="off"
                        onFinish={onFinish}
                    >
                        <Form.Item
                            className={styles["item"]}
                            labelCol={{ span: 24 }}
                            label="Họ và tên"
                            name="name"
                            rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                        >
                            <Input placeholder='Công Nguyễn' />
                        </Form.Item>

                        <Form.Item
                            className={styles["item"]}
                            labelCol={{ span: 24 }}
                            label="Chức vụ"
                            name="position"
                            rules={[{ required: true, message: 'Chức vụ không được để trống!' }]}
                        >
                            <Input placeholder='Trưởng phòng nhân sự' />
                        </Form.Item>

                        <Form.Item
                            className={styles["item"]}
                            labelCol={{ span: 24 }}
                            label="Email công ty"
                            name="email"
                            rules={[{ required: true, message: 'Email không được để trống!' }]}
                        >
                            <Input type='email' placeholder='nicejob@gmail.com' />
                        </Form.Item>



                        <Form.Item
                            className={styles["item"]}
                            labelCol={{ span: 24 }}
                            label="Địa chỉ"
                        >
                            <ProFormSelect
                                name="location"
                                options={LOCATION_LIST.filter(item => item.value !== 'ALL')}
                                placeholder="Da Nang"
                                rules={[{ required: true, message: 'Vui lòng chọn địa điểm!' }]}
                            />
                        </Form.Item>


                        <Form.Item
                            className={styles["item"]}
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
                                }
                            ]}
                        >
                            <Input placeholder='0933235689' />
                        </Form.Item>

                        <Form.Item
                            className={styles["item"]}
                            labelCol={{ span: 24 }}
                            label="Tên Công ty"
                            name="nameCompany"
                            rules={[{ required: true, message: 'Tên Công ty không được để trống!' }]}
                        >
                            <Input placeholder='Công ty cổ phần Nice Job' />
                        </Form.Item>

                        <Form.Item
                            className={styles["item"]}
                            labelCol={{ span: 24 }}
                            label="Địa chỉ Website"
                            name="websiteAddress"
                            rules={[{
                                required: true, message: 'Địa chỉ Website không được để trống!'
                            }]}
                        >
                            <Input placeholder='https://nicejob.com' />
                        </Form.Item>

                        < Form.Item>
                            <Button type="primary" htmlType="submit" style={{ marginRight: "20px" }} >
                                Liên hệ tôi
                            </Button>
                            Đã có tài khoản khách hàng ?<Link to='/login' > Đăng Nhập </Link>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}

export default ContactPage;