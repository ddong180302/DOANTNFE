import { Breadcrumb, Col, ConfigProvider, Divider, Form, Input, Modal, Radio, Row, message, notification } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FooterToolbar, ProForm, ProFormDigit, ProFormSelect, ProFormSwitch, ProFormText } from "@ant-design/pro-components";
import styles from 'styles/admin.module.scss';
import { LOCATION_LIST, SKILLS_LIST } from "@/config/utils";
import { useState, useEffect } from 'react';
import { callCreateJob, callFetchCompany, callFetchJobById, callFetchSkill, callGetCompanyByUser, callUpdateJob } from "@/config/api";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CheckSquareOutlined } from "@ant-design/icons";
import enUS from 'antd/lib/locale/en_US';
import dayjs from 'dayjs';
import { IJob } from "@/types/backend";
import { DebounceSelect } from "@/components/admin/user/debouce.select";
import { useAppSelector } from "@/redux/hooks";
import CheckOut from "./checkOut.job";

export interface ISkillSelect {
    label: string;
    value: string;
    key?: string;
}

const ViewUpsertJobHr = (props: any) => {
    const [skills, setSkills] = useState<ISkillSelect[]>([]);
    const user = useAppSelector(state => state.account.user);
    const [companyName, setCompanyName] = useState<string>();
    const [companyId, setCompanyId] = useState<string>();
    const [companyLogo, setCompanyLogo] = useState<string>();
    const navigate = useNavigate();
    const [value, setValue] = useState<string>("");
    const [expiredAt, setExpiredAt] = useState<any>(null);
    const [paymentAmount, setPaymentAmount] = useState<any>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [valueJob, setValueJob] = useState<any>();

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // job id
    const [dataUpdate, setDataUpdate] = useState<IJob | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const init = async () => {
            if (user && user?._id) {
                const res = await callGetCompanyByUser();
                if (res && res.data) {
                    setCompanyName(res.data.name);
                    setCompanyId(res.data._id);
                    setCompanyLogo(res.data.logo);
                }
            }
        }
        init();
    }, [user]);

    useEffect(() => {
        const init = async () => {
            if (id) {
                const res = await callFetchJobById(id);
                if (res && res.data) {
                    setDataUpdate(res.data);
                    setValue(res.data.description);

                    // Xử lý kỹ năng
                    const skillsData = res.data.skills.map((skill: any) => ({
                        label: skill,
                        value: skill,
                        key: skill
                    }));

                    setSkills(skillsData);

                    // Định dạng giá trị cho trường kỹ năng
                    const formattedSkills = res.data.skills.map((skill: any) => ({
                        label: skill,
                        value: skill,
                        key: skill
                    }));

                    form.setFieldsValue({
                        ...res.data,
                        company: {
                            label: res.data.company?.name as string,
                            value: `${res.data.company?._id}@#$${res.data.company?.logo}` as string,
                            key: res.data.company?._id
                        },
                        skills: formattedSkills // Đặt giá trị cho trường skills
                    });
                }
            }
        };
        init();
        return () => form.resetFields();
    }, [id]);

    // Usage of DebounceSelect
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
                level: values.level,
                paymentAmount: values.paymentAmount,
                description: value,
                expiredAt: /[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/.test(values.expiredAt) ? dayjs(values.expiredAt, 'DD/MM/YYYY').toDate() : values.expiredAt,
                isActive: values.isActive
            }

            const res = await callUpdateJob(job, dataUpdate._id);
            if (res.data) {
                message.success("Cập nhật job thành công");
                navigate('/hr/job')
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
            //create

            const valuesSkill = values.skills.map((item: any) => item.label);
            const job = {
                name: values.name,
                skills: valuesSkill,
                company: {
                    _id: companyId || "",
                    name: companyName || "",
                    logo: companyLogo || ""
                },
                location: values.location,
                salary: values.salary,
                quantity: values.quantity,
                level: values.level,
                description: value,
                expiredAt: expiredAt,
                paymentAmount: paymentAmount,
                isActive: values.isActive
            }

            setValueJob(job);

            setOpenModal(true)


            // const valuesSkill = values.skills.map((item: any) => item.label);
            // const job = {
            //     name: values.name,
            //     skills: valuesSkill,
            //     company: {
            //         _id: companyId || "",
            //         name: companyName || "",
            //         logo: companyLogo || ""
            //     },
            //     location: values.location,
            //     salary: values.salary,
            //     quantity: values.quantity,
            //     level: values.level,
            //     description: value,
            //     expiredAt: expiredAt,
            //     paymentAmount: paymentAmount,
            //     isActive: values.isActive
            // }

            // const res = await callCreateJob(job);
            // if (res.data) {
            //     message.success("Tạo mới job thành công");
            //     navigate('/hr/job')
            // } else {
            //     notification.error({
            //         message: 'Có lỗi xảy ra',
            //         description: res.message
            //     });
            // }
        }
    }

    const handleDurationChange = (e: any) => {
        const selectedDuration = e.target.value;
        const calculatedExpirationDate = dayjs().add(selectedDuration, 'day').toDate();
        setExpiredAt(calculatedExpirationDate);

        const expirationDateObj = dayjs(calculatedExpirationDate);
        const formattedExpirationDate = expirationDateObj.format('DD/MM/YYYY');

        const equivalentSalary = selectedDuration / 15;
        setPaymentAmount(equivalentSalary);
        const formattedSalaryEquivalent = `${equivalentSalary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' $';

        form.setFieldsValue({
            expiredAt: formattedExpirationDate,
            paymentAmount: formattedSalaryEquivalent
        });
    };


    return (
        <div className={styles["upsert-job-container"]}>
            <div className={styles["title"]}>
                <Breadcrumb
                    separator=">"
                    items={[
                        {
                            title: <Link to="/hr/job">Manage Job</Link>,
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
                                    submitText: <>{dataUpdate?._id ? "Cập nhật Job" : "Tạo mới Job"}</>
                                },
                                onReset: () => navigate('/hr/job'),
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
                            <Col span={24} md={6} >
                                <ProForm.Item
                                    name="company"
                                    label="Thuộc Công Ty"
                                >
                                    <p style={{ border: "1px solid #ddd", padding: "4px 5px", borderRadius: "5px" }}>
                                        {companyName}
                                    </p>
                                </ProForm.Item>
                            </Col>
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
                            {!id &&
                                <Col span={24} md={6}>
                                    <Form.Item
                                        label="Số tiền phải trả"
                                        name="paymentAmount"
                                    >
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                            }
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
                        <Divider />
                    </ProForm>
                </ConfigProvider>
            </div>
            <CheckOut
                valueJob={valueJob}
                openModal={openModal}
                setOpenModal={setOpenModal}
            />
        </div>
    )
}

export default ViewUpsertJobHr;