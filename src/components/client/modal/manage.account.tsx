import { Button, Col, Form, Input, Modal, Row, Select, Table, Tabs, message, notification } from "antd";
import { isMobile } from "react-device-detect";
import type { TabsProps } from 'antd';
import { IResume, IUser } from "@/types/backend";
import { useState, useEffect } from 'react';
import { callFetchResumeByUser, callFetchSkill, callGetInforByUser, callGetSubscriberSkills, callResetPass, callUpdateInforByUser, callUpdateSubscriber } from "@/config/api";
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { MonitorOutlined } from "@ant-design/icons";
import { useAppSelector } from "@/redux/hooks";
import { ProFormDigit, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { useNavigate } from "react-router-dom";

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
}

const UserResume = (props: any) => {
    const [listCV, setListCV] = useState<IResume[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    useEffect(() => {
        const init = async () => {
            setIsFetching(true);
            const res = await callFetchResumeByUser();
            if (res && res.data) {
                setListCV(res.data as IResume[])
            }
            setIsFetching(false);
        }
        init();
    }, [])

    const columns: ColumnsType<IResume> = [
        {
            title: 'STT',
            key: 'index',
            width: 50,
            align: "center",
            render: (text, record, index) => {
                return (
                    <>
                        {(index + 1)}
                    </>)
            }
        },
        {
            title: 'Công Ty',
            dataIndex: ["companyId", "name"],

        },
        {
            title: 'Vị trí',
            dataIndex: ["jobId", "name"],

        },
        {
            title: 'Trạng thái',
            dataIndex: "status",
        },
        {
            title: 'Ngày Gởi CV',
            dataIndex: "createdAt",
            render(value, record, index) {
                return (
                    <>{dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}</>
                )
            },
        },
        {
            title: '',
            dataIndex: "",
            render(value, record, index) {
                return (
                    <a
                        href={`${import.meta.env.VITE_BACKEND_URL}/images/resume/${record?.url}`}
                        target="_blank"
                    >Chi tiết</a>
                )
            },
        },
    ];

    return (
        <div>
            <Table<IResume>
                columns={columns}
                dataSource={listCV}
                loading={isFetching}
                pagination={false}
            />
        </div>
    )
}

const UserUpdateInfo = (props: any) => {
    const [dataUser, setDataUser] = useState<IUser | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [form] = Form.useForm();
    const user = useAppSelector(state => state.account.user);

    useEffect(() => {
        const init = async () => {
            setIsFetching(true);
            const res = await callGetInforByUser();
            if (res && res.data) {
                setDataUser(res.data);
            }
            setIsFetching(false);
        }
        init();
    }, [])


    useEffect(() => {
        if (dataUser) {
            form.setFieldsValue({
                email: dataUser.email,
                name: dataUser.name,
                age: dataUser.age,
                gender: dataUser.gender,
                address: dataUser.address,
                phone: dataUser.phone
            });
        }
    }, [dataUser]);

    const onFinish = async (values: any) => {
        const { email, name, age, gender, address, phone } = values;
        console.log("value: ", values);
        const res = await callUpdateInforByUser({
            _id: user._id,
            email: email,
            name: name,
            age: age,
            gender: gender,
            address: address,
            phone: phone
        });
        if (res.data) {
            message.success("Cập nhật thông tin thành công");
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            });
        }

    }

    return (
        <>
            <Form
                onFinish={onFinish}
                form={form}
                className="vertical-form"
            >
                <Row gutter={[20, 20]}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng không bỏ trống' },
                                { type: 'email', message: 'Vui lòng nhập email hợp lệ' }
                            ]}
                            placeholder="Nhập email"
                            disabled
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Tên hiển thị"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập tên hiển thị"
                        />
                    </Col>

                </Row>
                <Row gutter={[20, 20]}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormDigit
                            label="Tuổi"
                            name="age"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập nhập tuổi"
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormSelect
                            name="gender"
                            label="Giới Tính"
                            valueEnum={{
                                MALE: 'Nam',
                                FEMALE: 'Nữ',
                                OTHER: 'Khác',
                            }}
                            placeholder="Please select a gender"
                            rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                        />
                    </Col>

                </Row>
                <Row>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Địa chỉ"
                            name="address"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập địa chỉ"
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Số điện thoại"
                            name="phone"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập số điện thoại"
                        />
                    </Col>

                </Row>
                <Row>
                    <Col span={12}>

                    </Col>
                    <Col span={12}>
                        <Button onClick={() => form.submit()}>Cập nhật</Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

const UserResetPassword = (props: any) => {

    const navigate = useNavigate();
    const [passwordMatchError, setPasswordMatchError] = useState("");
    const [isSubmit, setIsSubmit] = useState(false);
    const user = useAppSelector(state => state.account.user);


    const onFinish = async (values: any) => {
        const { password, confirmPassword } = values;
        if (password !== confirmPassword) {
            setPasswordMatchError("Mật khẩu và xác nhận mật khẩu không khớp.");
            return; // Dừng hàm nếu mật khẩu không khớp
        } else {
            setPasswordMatchError(""); // Reset thông báo lỗi nếu mật khẩu và xác nhận mật khẩu khớp nhau
        }
        setIsSubmit(true);
        const _id = user?._id;
        const email = user?.email;
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
        <div>
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
        </div>
    )
}

const JobByEmail = (props: any) => {
    const [form] = Form.useForm();
    const user = useAppSelector(state => state.account.user);
    const [skills, setSkills] = useState<Array<{ label: string; value: string; }>>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentSkills, setCurrentSkills] = useState(1);
    const [pageSizeSkills, setPageSizeSkills] = useState(1000);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    useEffect(() => {
        const init = async () => {
            const res = await callGetSubscriberSkills();
            if (res && res.data) {
                form.setFieldValue("skills", res.data.skills);
            }
        }
        init();
    }, [])

    useEffect(() => {
        const fetchSkills = async () => {
            try {

                setIsLoading(true)
                let query = `current=${currentSkills}&pageSize=${pageSizeSkills}`;

                const res = await callFetchSkill(query);
                if (res && res.data) {

                    const transformedSkills = res?.data?.result.map(skill => ({
                        label: skill.name, // Assuming 'name' is the skill name
                        value: skill.name, // Remove spaces and convert to uppercase
                    }));

                    setSkills(transformedSkills);
                    //setTotal(res.data.meta.total);
                }
                setIsLoading(false)

            } catch (err) {
                setError('Failed to fetch skills');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);


    const onFinish = async (values: any) => {
        const { skills } = values;
        const res = await callUpdateSubscriber({
            email: user.email,
            name: user.name,
            skills: skills ? skills : []
        });
        if (res.data) {
            message.success("Cập nhật thông tin thành công");
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            });
        }

    }

    return (
        <>
            <Form
                onFinish={onFinish}
                form={form}
            >
                <Row gutter={[20, 20]}>
                    <Col span={24}>
                        <Form.Item
                            label={"Kỹ năng"}
                            name={"skills"}
                            rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 skill!' }]}

                        >
                            <Select
                                mode="multiple"
                                allowClear
                                showArrow={false}
                                style={{ width: '100%' }}
                                placeholder={
                                    <>
                                        <MonitorOutlined /> Tìm theo kỹ năng...
                                    </>
                                }
                                optionLabelProp="label"
                                options={skills}
                                popupMatchSelectWidth
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Button onClick={() => form.submit()}>Cập nhật</Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

const ManageAccount = (props: IProps) => {
    const { open, onClose } = props;

    const onChange = (key: string) => {
        // console.log(key);
    };

    const items: TabsProps['items'] = [
        {
            key: 'user-resume',
            label: `Gởi CV`,
            children: <UserResume />,
        },
        {
            key: 'email-by-skills',
            label: `Nhận Jobs qua Email`,
            children: <JobByEmail />,
        },
        {
            key: 'user-update-info',
            label: `Cập nhật thông tin`,
            children: <UserUpdateInfo />,
        },
        {
            key: 'user-password',
            label: `Thay đổi mật khẩu`,
            children: <UserResetPassword />,
        },
    ];


    return (
        <>
            <Modal
                title="Quản lý tài khoản"
                open={open}
                onCancel={() => onClose(false)}
                maskClosable={false}
                footer={null}
                destroyOnClose={true}
                width={isMobile ? "100%" : "1000px"}
            >

                <div style={{ minHeight: 400 }}>
                    <Tabs
                        defaultActiveKey="user-resume"
                        items={items}
                        onChange={onChange}
                    />
                </div>

            </Modal>
        </>
    )
}

export default ManageAccount;