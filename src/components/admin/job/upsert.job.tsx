import { Breadcrumb, Col, ConfigProvider, Divider, Form, Input, Radio, Row, message, notification } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DebounceSelect } from "../user/debouce.select";
import { FooterToolbar, ProForm, ProFormDatePicker, ProFormDigit, ProFormSelect, ProFormSwitch, ProFormText } from "@ant-design/pro-components";
import styles from 'styles/admin.module.scss';
import { LOCATION_LIST } from "@/config/utils";
import { ICompanySelect } from "../user/modal.user";
import { useState, useEffect } from 'react';
import { callFetchCompany, callFetchJobById, callFetchSkill, callUpdateJob } from "@/config/api";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CheckSquareOutlined } from "@ant-design/icons";
import enUS from 'antd/lib/locale/en_US';
import dayjs from 'dayjs';
import { IJob } from "@/types/backend";

export interface ISkillSelect {
    label: string;
    value: string;
    key?: string;
}

const ViewUpsertJob = (props: any) => {
    const [companies, setCompanies] = useState<ICompanySelect[]>([]);
    const [skills, setSkills] = useState<ISkillSelect[]>([]);
    const navigate = useNavigate();
    const [value, setValue] = useState<string>("");
    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // job id
    const [dataUpdate, setDataUpdate] = useState<IJob | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const init = async () => {
            if (id) {
                const res = await callFetchJobById(id);
                if (res && res.data) {
                    setDataUpdate(res.data);
                    setValue(res.data.description);
                    setCompanies([
                        {
                            label: res.data.company?.name as string,
                            value: `${res.data.company?._id}@#$${res.data.company?.logo}` as string,
                            key: res.data.company?._id
                        }
                    ]);

                    const skillsData = res.data.skills.map((skill: any) => ({
                        label: skill,
                        value: skill,
                        key: skill
                    }));

                    setSkills(skillsData);

                    const formattedSkills = res.data.skills.map((skill: any) => ({
                        label: skill,
                        value: skill,
                        key: skill
                    }));

                    // Convert expiredAt to "dd/mm/yyyy" format
                    const expiredAtDate = new Date(res.data.expiredAt);
                    const formattedExpiredAt = `${expiredAtDate.getDate().toString().padStart(2, '0')}/${(expiredAtDate.getMonth() + 1).toString().padStart(2, '0')}/${expiredAtDate.getFullYear()}`;



                    form.setFieldsValue({
                        ...res.data,
                        company: {
                            label: res.data.company?.name as string,
                            value: `${res.data.company?._id}@#$${res.data.company?.logo}` as string,
                            key: res.data.company?._id
                        },
                        skills: formattedSkills, // Đặt giá trị cho trường skills
                        expiredAt: formattedExpiredAt
                    });
                }
            }
        };
        init();
        return () => form.resetFields();
    }, [id]);
    async function fetchCompanyList(name: string): Promise<ICompanySelect[]> {
        const res = await callFetchCompany(`current=1&pageSize=100&name=/${name}/i`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    label: item.name as string,
                    value: `${item._id}@#$${item.logo}` as string
                }
            })
            return temp;
        } else return [];
    }

    async function fetchSkillList(name: string): Promise<ISkillSelect[]> {
        const res = await callFetchSkill(`current=1&pageSize=100&name=/${name}/i`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    label: item.name as string,
                    value: item.name as string
                }
            })
            return temp;
        } else return [];
    }

    const onFinish = async (values: any) => {
        if (dataUpdate?._id) {
            //update
            const cp = values?.company?.value?.split('@#$');
            const valuesSkill = values.skills.map((item: any) => item.label);
            const job = {
                name: values.name,
                skills: valuesSkill,
                company: {
                    _id: cp && cp.length > 0 ? cp[0] : "",
                    name: values.company.label,
                    logo: cp && cp.length > 1 ? cp[1] : ""
                },
                location: values.location,
                salary: values.salary,
                quantity: values.quantity,
                paymentAmount: values.paymentAmount,
                level: values.level,
                description: value,
                expiredAt: /[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/.test(values.expiredAt) ? dayjs(values.expiredAt, 'DD/MM/YYYY').toDate() : values.expiredAt,
                isActive: values.isActive
            }

            const res = await callUpdateJob(job, dataUpdate._id);
            if (res.data) {
                message.success("Cập nhật job thành công");
                navigate('/admin/job')
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }

    }


    const handleDurationChange = (e: any) => {
        const selectedDuration = e.target.value;
        const calculatedExpirationDate = dayjs().add(selectedDuration, 'day').toDate();
        const expirationDateObj = dayjs(calculatedExpirationDate);
        const formattedExpirationDate = expirationDateObj.format('DD/MM/YYYY');

        form.setFieldsValue({
            expiredAt: formattedExpirationDate,
        });
    };

    return (
        <div className={styles["upsert-job-container"]}>
            <div className={styles["title"]}>
                <Breadcrumb
                    separator=">"
                    items={[
                        {
                            title: <Link to="/admin/job">Manage Job</Link>,
                        },
                        {
                            title: 'Upsert Job',
                        },
                    ]}
                />
            </div>
            <div >

                <ConfigProvider locale={enUS}>
                    <ProForm
                        form={form}
                        onFinish={onFinish}
                        submitter={
                            {
                                searchConfig: {
                                    resetText: "Hủy",
                                    submitText: <>{dataUpdate?._id ? "Cập nhật Job" : ""}</>
                                },
                                onReset: () => navigate('/admin/job'),
                                render: (_: any, dom: any) => <FooterToolbar>{dom}</FooterToolbar>,
                                submitButtonProps: {
                                    icon: <CheckSquareOutlined />
                                },
                            }
                        }
                    >
                        <Row gutter={[20, 20]}>
                            <Col span={24} md={12}>
                                <ProFormText
                                    label="Tên Job"
                                    name="name"
                                    rules={[
                                        { required: true, message: 'Vui lòng không bỏ trống' },
                                    ]}
                                    placeholder="Nhập tên job"
                                />
                            </Col>
                            {(dataUpdate?._id || !id) &&
                                <Col span={24} md={6}>
                                    <ProForm.Item
                                        name="skills"
                                        label="Kỹ năng yêu cầu"
                                        rules={[{ required: true, message: 'Vui lòng chọn kỹ năng!' }]}
                                    >
                                        <DebounceSelect
                                            defaultActiveFirstOption
                                            allowClear
                                            showSearch
                                            autoFocus={true}
                                            defaultValue={skills}
                                            value={skills}
                                            placeholder="Chọn kỹ năng"
                                            fetchOptions={fetchSkillList}
                                            mode="multiple" // Chỉnh sửa mode thành "multiple"
                                            onChange={(newValue: any) => {
                                                setSkills(newValue as ISkillSelect[]);
                                            }}
                                            style={{ width: '100%' }}
                                        />
                                    </ProForm.Item>
                                </Col>
                            }

                            <Col span={24} md={6}>
                                <ProFormSelect
                                    name="location"
                                    label="Địa điểm"
                                    options={LOCATION_LIST.filter(item => item.value !== 'ALL')}
                                    placeholder="Please select a location"
                                    rules={[{ required: true, message: 'Vui lòng chọn địa điểm!' }]}
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormDigit
                                    label="Mức lương"
                                    name="salary"
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                    placeholder="Nhập mức lương"
                                    fieldProps={{
                                        addonAfter: " đ",
                                        formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                                        parser: (value) => +(value || '').replace(/\$\s?|(,*)/g, '')
                                    }}
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormDigit
                                    label="Số lượng"
                                    name="quantity"
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                    placeholder="Nhập số lượng"
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormSelect
                                    name="level"
                                    label="Trình độ"
                                    valueEnum={{
                                        INTERN: 'INTERN',
                                        FRESHER: 'FRESHER',
                                        JUNIOR: 'JUNIOR',
                                        MIDDLE: 'MIDDLE',
                                        SENIOR: 'SENIOR',
                                    }}
                                    placeholder="Please select a level"
                                    rules={[{ required: true, message: 'Vui lòng chọn level!' }]}
                                />
                            </Col>
                            {(dataUpdate?._id || !id) &&
                                <Col span={24} md={6}>
                                    <ProForm.Item
                                        name="company"
                                        label="Thuộc Công Ty"
                                        rules={[{ required: true, message: 'Vui lòng chọn company!' }]}
                                    >
                                        <DebounceSelect
                                            allowClear
                                            showSearch
                                            defaultValue={companies}
                                            value={companies}
                                            placeholder="Chọn công ty"
                                            fetchOptions={fetchCompanyList}
                                            onChange={(newValue: any) => {
                                                if (newValue?.length === 0 || newValue?.length === 1) {
                                                    setCompanies(newValue as ICompanySelect[]);
                                                }
                                            }}
                                            style={{ width: '100%' }}
                                        />
                                    </ProForm.Item>
                                </Col>
                            }

                        </Row>

                        <Row gutter={[20, 20]}>
                            {!id &&
                                <Col span={24} md={6}>
                                    <Form.Item
                                        label="Thời hạn (ngày)"
                                        name="duration"
                                        rules={[{ required: true, message: 'Vui lòng chọn thời hạn!' }]}
                                    >
                                        <Radio.Group onChange={handleDurationChange}>
                                            <Radio.Button value={15}>15</Radio.Button>
                                            <Radio.Button value={30}>30</Radio.Button>
                                            <Radio.Button value={45}>45</Radio.Button>
                                            <Radio.Button value={60}>60</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            }
                            <Col span={24} md={6}>
                                <Form.Item
                                    label="Ngày hết hạn"
                                    name="expiredAt"
                                >
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormSwitch
                                    label="Trạng thái"
                                    name="isActive"
                                    checkedChildren="ACTIVE"
                                    unCheckedChildren="INACTIVE"
                                    initialValue={true}
                                    fieldProps={{
                                        defaultChecked: true,
                                    }}
                                />
                            </Col>
                            <Col span={24}>
                                <ProForm.Item
                                    name="description"
                                    label="Miêu tả job"
                                    rules={[{ required: true, message: 'Vui lòng nhập miêu tả job!' }]}
                                >
                                    <ReactQuill
                                        theme="snow"
                                        value={value}
                                        onChange={setValue}
                                    />
                                </ProForm.Item>
                            </Col>
                        </Row>
                        <Divider />
                    </ProForm>
                </ConfigProvider>

            </div>
        </div>
    )
}

export default ViewUpsertJob;