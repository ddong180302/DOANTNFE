import SearchClient from '@/components/client/search.client';
import { Col, Divider, Input, Row, Form, Select, Button } from 'antd';
import { Option } from 'antd/es/mentions';
import { Link } from 'react-router-dom';
import styles from 'styles/client.module.scss';

const ContactPage = (props: any) => {
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
                        <p>Hotline Đà Nẵng     0932562365</p>
                    </div>
                    <div className={styles["bottom"]}>
                        sadgajsdhgj
                    </div>


                </Col>
                <Col span={11} className={styles["contact-right"]}>
                    < Form
                        name="basic"
                        // style={{ maxWidth: 600, margin: '0 auto' }}
                        //onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            className={styles["item"]}
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
                            name="gender"
                            label="Giới tính"
                            rules={[{ required: true, message: 'Giới tính không được để trống!' }]}
                        >
                            <Select
                                // placeholder="Select a option and change input text above"
                                // onChange={onGenderChange}
                                allowClear
                                popupMatchSelectWidth
                            >
                                <Option value="male">Nam</Option>
                                <Option value="female">Nữ</Option>
                                <Option value="other">Khác</Option>
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
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        < Form.Item
                        // wrapperCol={{ offset: 6, span: 16 }}
                        >
                            <Button type="primary" htmlType="submit" >
                                Liên hệ tôi
                            </Button>
                            Or Đã có tài khoản khách hàng ?<Link to='/login' > Đăng Nhập </Link>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}

export default ContactPage;