import { ModalForm, ProForm, ProFormDigit, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row, message, notification } from "antd";
import { isMobile } from 'react-device-detect';
import { useState, useEffect } from "react";
import { callCreateUser, callCreateUserHr, callFetchCompany, callFetchRole, callUpdateUser, callUpdateUserHr } from "@/config/api";
import { IUser } from "@/types/backend";
import { DebounceSelect } from "./debouce.select";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IUser | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

export interface ICompanySelect {
    label: string;
    value: string;
    key?: string;
}

const ModalUser = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const [companies, setCompanies] = useState<ICompanySelect[]>([]);
    const [roles, setRoles] = useState<ICompanySelect[]>([]);
    const [form] = Form.useForm();

    useEffect(() => {
        if (openModal && dataInit?._id) {
            if (dataInit?.company) {
                const companyObject = {
                    label: dataInit.company.name,
                    value: dataInit.company._id,
                    key: dataInit.company._id,
                };
                setCompanies([companyObject]);
            }
            if (dataInit?.role) {
                const roleObject = {
                    label: dataInit.role.name,
                    value: dataInit.role._id,
                    key: dataInit.role._id,
                };
                setRoles([roleObject]);
            }
            form.setFieldsValue({
                email: dataInit.email,
                password: dataInit.password,
                name: dataInit.name,
                age: dataInit.age,
                gender: dataInit.gender,
                address: dataInit.address,
                phone: dataInit.phone,
            });
        } else {
            // Clear form data when dataInit is null or undefined
            setCompanies([]);
            setRoles([]);
            form.setFieldsValue({
                email: "",
                password: "",
                name: "",
                age: "",
                gender: "",
                address: "",
                phone: "",
            });
        }
    }, [openModal, dataInit, form]);

    const submitUser = async (valuesForm: any) => {
        const { name, email, password, address, age, gender, role, company, phone } = valuesForm;

        if (dataInit?._id) {
            //update
            if (role && role?.label !== "HR") {
                if (company) {
                    message.warning("Bạn không được chọn tên công ty!");
                    return;
                }
                if (role?._id) {
                    const user = {
                        _id: dataInit?._id,
                        name,
                        email,
                        password,
                        age,
                        company: null as any,
                        gender,
                        address,
                        phone,
                        role: role?._id
                    }
                    const res = await callUpdateUser(user);
                    if (res.data) {
                        message.success("Cập nhật user thành công");
                        handleReset();
                        reloadTable();
                    } else {
                        notification.error({
                            message: 'Có lỗi xảy ra',
                            description: res.message
                        });
                    }
                } else {
                    const user = {
                        _id: dataInit?._id,
                        name,
                        email,
                        password,
                        age,
                        gender,
                        address,
                        company: null as any,
                        phone,
                        role: role?.value
                    }
                    const res = await callUpdateUser(user);
                    if (res.data) {
                        message.success("Cập nhật user thành công");
                        handleReset();
                        reloadTable();
                    } else {
                        notification.error({
                            message: 'Có lỗi xảy ra',
                            description: res.message
                        });
                    }
                }
            } else {
                if (!company) {
                    message.warning("Bạn cần chọn tên công ty!");
                    return;
                }
                if (company?._id && role?._id) {
                    const user = {
                        _id: dataInit?._id,
                        name,
                        email,
                        password,
                        age,
                        gender,
                        address,
                        phone,
                        role: role?._id,
                        company: {
                            _id: company?._id,
                            name: company?.name
                        }
                    }
                    const res = await callUpdateUserHr(user);
                    if (res.data) {
                        message.success("Cập nhật user thành công");
                        handleReset();
                        reloadTable();
                    } else {
                        notification.error({
                            message: 'Có lỗi xảy ra',
                            description: res.message
                        });
                    }
                } else if (!company?._id && !role?._id) {
                    const user = {
                        _id: dataInit?._id,
                        name,
                        email,
                        password,
                        age,
                        gender,
                        address,
                        phone,
                        role: role?.value,
                        company: {
                            _id: company?.value,
                            name: company?.label
                        }
                    }
                    const res = await callUpdateUserHr(user);
                    if (res.data) {
                        message.success("Cập nhật user thành công");
                        handleReset();
                        reloadTable();
                    } else {
                        notification.error({
                            message: 'Có lỗi xảy ra',
                            description: res.message
                        });
                    }
                }
                else if (role?._id && !company?._id) {
                    const user = {
                        _id: dataInit?._id,
                        name,
                        email,
                        password,
                        age,
                        gender,
                        address,
                        phone,
                        role: role?._id,
                        company: {
                            _id: company?.value,
                            name: company?.label,
                        }
                    }
                    const res = await callUpdateUserHr(user);
                    if (res.data) {
                        message.success("Cập nhật user thành công");
                        handleReset();
                        reloadTable();
                    } else {
                        notification.error({
                            message: 'Có lỗi xảy ra',
                            description: res.message
                        });
                    }
                }
                else if (!role?._id && company?._id) {
                    const user = {
                        _id: dataInit?._id,
                        name,
                        email,
                        password,
                        age,
                        gender,
                        address,
                        phone,
                        role: role?.value,
                        company: {
                            _id: company?._id,
                            name: company?.name
                        }
                    }
                    const res = await callUpdateUserHr(user);
                    if (res.data) {
                        message.success("Cập nhật user thành công");
                        handleReset();
                        reloadTable();
                    } else {
                        notification.error({
                            message: 'Có lỗi xảy ra',
                            description: res.message
                        });
                    }
                }

            }
        } else {
            //create
            if (role && role?.label !== "HR") {
                if (company) {
                    message.warning("Bạn không được chọn tên công ty!");
                    return;
                }
                const user = {
                    name,
                    email,
                    password,
                    age,
                    gender,
                    address,
                    phone,
                    role: role.value,
                }
                const res = await callCreateUser(user);
                if (res.data) {
                    message.success("Thêm mới user thành công");
                    handleReset();
                    reloadTable();
                } else {
                    notification.error({
                        message: 'Có lỗi xảy ra',
                        description: res.message
                    });
                }
            } else {
                if (!company) {
                    message.warning("Bạn cần chọn tên công ty!");

                    return;
                }
                const user = {
                    name,
                    email,
                    password,
                    age,
                    gender,
                    address,
                    phone,
                    role: role.value,
                    company: {
                        _id: company?.value,
                        name: company?.label
                    }
                }
                const res = await callCreateUserHr(user);
                if (res.data) {
                    message.success("Thêm mới user thành công");
                    handleReset();
                    reloadTable();
                } else {
                    notification.error({
                        message: 'Có lỗi xảy ra',
                        description: res.message
                    });
                }
            }
        }
    }

    const handleReset = async () => {
        form.resetFields();
        form.setFieldsValue(null);
        setDataInit(null);
        setCompanies([]);
        setRoles([]);
        setOpenModal(false);
    }

    // Usage of DebounceSelect
    async function fetchCompanyList(name: string): Promise<ICompanySelect[]> {
        const res = await callFetchCompany(`current=1&pageSize=100&name=/${name}/i`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    label: item.name as string,
                    value: item._id as string
                }
            })
            return temp;
        } else return [];
    }

    async function fetchRoleList(name: string): Promise<ICompanySelect[]> {
        const res = await callFetchRole(`current=1&pageSize=100&name=/${name}/i`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    label: item.name as string,
                    value: item._id as string
                }
            })
            return temp;
        } else return [];
    }

    return (
        <>
            <ModalForm
                title={<>{dataInit?._id ? "Cập nhật User" : "Tạo mới User"}</>}
                visible={openModal}
                modalProps={{
                    onCancel: handleReset,
                    afterClose: handleReset,
                    destroyOnClose: true,
                    width: isMobile ? "100%" : 900,
                    keyboard: false,
                    maskClosable: false,
                    okText: <>{dataInit?._id ? "Cập nhật" : "Tạo mới"}</>,
                    cancelText: "Hủy"
                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={submitUser}
                initialValues={openModal ? (dataInit?._id ? dataInit : {}) : {}}
            >
                <Row gutter={16}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng không bỏ trống' },
                                { type: 'email', message: 'Vui lòng nhập email hợp lệ' }
                            ]}
                            placeholder={"Vui lòng nhập email"}
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText.Password
                            disabled={dataInit?._id ? true : false}
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: dataInit?._id ? false : true,
                                    message: 'Vui lòng không bỏ trống'
                                },
                                {
                                    min: 6,
                                    max: 12,
                                    message: 'Mật khẩu phải có từ 6 đến 12 ký tự!'
                                }
                            ]}
                            placeholder="Nhập password"
                        />
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ProFormText
                            label="Tên hiển thị"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder={"Vui lòng nhập name"}
                        />
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ProFormDigit
                            label="Tuổi"
                            name="age"
                            rules={[
                                { required: true, message: 'Vui lòng không bỏ trống' },
                                { type: 'number', min: 0, max: 99, message: 'Tuổi phải nhỏ hơn 100!' }
                            ]}
                            placeholder="Nhập nhập tuổi"
                            fieldProps={{ max: 99 }}
                        />
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
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
                    {
                        dataInit &&
                        <Col lg={6} md={6} sm={24} xs={24}>
                            <ProForm.Item
                                name="role"
                                label="Vai trò"
                                rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                            >
                                <DebounceSelect
                                    allowClear
                                    showSearch
                                    defaultValue={roles}
                                    value={roles}
                                    placeholder="Chọn vai trò"
                                    fetchOptions={fetchRoleList}
                                    onChange={(newValue: any) => {
                                        setRoles(newValue ? [newValue] : []);
                                    }}
                                    style={{ width: '100%' }}
                                    disabled
                                />
                            </ProForm.Item>
                        </Col>
                    }

                    {
                        dataInit &&
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <ProForm.Item
                                name="company"
                                label="Thuộc Công Ty"
                                rules={[{ required: false, message: 'Vui lòng chọn company!' }]}
                            >
                                <DebounceSelect
                                    allowClear
                                    showSearch
                                    defaultValue={companies}
                                    value={companies}
                                    placeholder="Chọn công ty"
                                    fetchOptions={fetchCompanyList}
                                    onChange={(newValue: any) => {
                                        setCompanies(newValue ? [newValue] : []);
                                    }}
                                    style={{ width: '100%' }}
                                    disabled
                                />
                            </ProForm.Item>
                        </Col>
                    }
                    {
                        !dataInit &&
                        <Col lg={6} md={6} sm={24} xs={24}>
                            <ProForm.Item
                                name="role"
                                label="Vai trò"
                                rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                            >
                                <DebounceSelect
                                    allowClear
                                    showSearch
                                    defaultValue={roles}
                                    value={roles}
                                    placeholder="Chọn vai trò"
                                    fetchOptions={fetchRoleList}
                                    onChange={(newValue: any) => {
                                        setRoles(newValue ? [newValue] : []);
                                    }}
                                    style={{ width: '100%' }}
                                />
                            </ProForm.Item>
                        </Col>

                    }

                    {
                        !dataInit &&
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <ProForm.Item
                                name="company"
                                label="Thuộc Công Ty"
                                rules={[{ required: false, message: 'Vui lòng chọn company!' }]}
                            >
                                <DebounceSelect
                                    allowClear
                                    showSearch
                                    defaultValue={companies}
                                    value={companies}
                                    placeholder="Chọn công ty"
                                    fetchOptions={fetchCompanyList}
                                    onChange={(newValue: any) => {
                                        setCompanies(newValue ? [newValue] : []);
                                    }}
                                    style={{ width: '100%' }}
                                />
                            </ProForm.Item>
                        </Col>
                    }
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
                            rules={[
                                { required: true, message: 'Vui lòng không bỏ trống' },
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
                            placeholder="Nhập số điện thoại"
                        />
                    </Col>
                </Row>
            </ModalForm>
        </>
    )
}

export default ModalUser;
