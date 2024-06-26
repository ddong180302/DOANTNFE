import { CheckSquareOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { FooterToolbar, ModalForm, ProCard, ProForm, ProFormSelect, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Col, ConfigProvider, Form, Modal, Row, Select, Upload, message, notification } from "antd";
import 'styles/reset.scss';
import { isMobile } from 'react-device-detect';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from "react";
import { callCreateCompany, callFetchSkill, callUpdateCompany, callUploadSingleFile } from "@/config/api";
import { ICompany } from "@/types/backend";
import { v4 as uuidv4 } from 'uuid';
import enUS from 'antd/lib/locale/en_US';
import countryList, { Country } from 'country-list';
import { DebounceSelect } from "../user/debouce.select";
import { LOCATION_LIST } from "@/config/utils";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: ICompany | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

interface ICompanyForm {
    name: string;
    address: string;
    country: string;
    companyType: string;
    companySize: string;
    workingDays: string;
    overtimePolicy: string;
    ourkeyskills: string[];
}

interface ICompanyLogo {
    name: string;
    uid: string;
}

export interface ISkillSelect {
    label: string;
    value: string;
    key?: string;
}


const ModalCompany = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const [skills, setSkills] = useState<ISkillSelect[]>([]);

    //modal animation
    const [animation, setAnimation] = useState<string>('open');
    const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
    const [dataLogo, setDataLogo] = useState<ICompanyLogo[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [value, setValue] = useState<string>("");
    const [form] = Form.useForm();
    const countries: Country[] = countryList.getData();
    const renderCountryOptions = () => {
        return countries.map((country: Country) => ( // Chỉ định kiểu cho country
            <Select.Option key={country.code} value={country.name}>
                {country.name}
            </Select.Option>
        ));
    };

    const filterCountryOption = (inputValue: string, option: any) =>
        option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;


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

    useEffect(() => {
        if (dataInit?._id && dataInit?.description) {
            setValue(dataInit.description);
        }
        const init = async () => {
            if (dataInit?._id) {
                // Xử lý kỹ năng
                const skillsData = dataInit?.ourkeyskills?.map((skill: any) => ({
                    label: skill,
                    value: skill,
                    key: skill
                })) || [];

                setSkills(skillsData);

                // Định dạng giá trị cho trường kỹ năng
                const formattedSkills = dataInit?.ourkeyskills?.map((skill: any) => ({
                    label: skill,
                    value: skill,
                    key: skill
                }));

                form.setFieldsValue({
                    ...dataInit,
                    skills: formattedSkills // Đặt giá trị cho trường skills
                });

                // Set the logo data
                if (dataInit?.logo) {
                    setDataLogo([{
                        name: dataInit.logo,
                        uid: uuidv4()
                    }]);
                }
            }
        }

        init();
        return () => form.resetFields();

    }, [dataInit]);

    const submitCompany = async (valuesForm: ICompanyForm) => {
        const {
            name, address, companyType,
            companySize, workingDays,
            overtimePolicy, ourkeyskills
        } = valuesForm;
        const valuesSkill = ourkeyskills.map((item: any) => {
            if (item && item?.label) {
                return item.label;
            } else {
                return item;
            }
        });
        const country = form.getFieldValue('country');

        if (dataLogo.length === 0) {
            message.error('Vui lòng upload ảnh Logo')
            return;
        }

        if (dataInit?._id) {
            //update
            const res = await callUpdateCompany(dataInit._id, name, address, country, companyType, companySize, workingDays, overtimePolicy, valuesSkill, value, dataLogo[0].name);
            if (res.data) {
                message.success("Cập nhật company thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
            //create
            const res = await callCreateCompany(name, address, country, companyType, companySize, workingDays, overtimePolicy, valuesSkill, value, dataLogo[0].name);
            if (res.data) {
                message.success("Thêm mới company thành công");
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

    const handleReset = async () => {
        form.resetFields();
        setValue("");
        setDataInit(null);

        //add animation when closing modal
        setAnimation('close')
        await new Promise(r => setTimeout(r, 400))
        setOpenModal(false);
        setAnimation('open')
        setSkills([]);
    }

    const handleRemoveFile = (file: any) => {
        setDataLogo([])
    }

    const handlePreview = async (file: any) => {
        if (!file.originFileObj) {
            setPreviewImage(file.url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
            return;
        }
        getBase64(file.originFileObj, (url: string) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        });
    };

    const getBase64 = (img: any, callback: any) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file: any) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleChange = (info: any) => {
        if (info.file.status === 'uploading') {
            setLoadingUpload(true);
        }
        if (info.file.status === 'done') {
            setLoadingUpload(false);
        }
        if (info.file.status === 'error') {
            setLoadingUpload(false);
            message.error(info?.file?.error?.event?.message ?? "Đã có lỗi xảy ra khi upload file.")
        }
    };

    const handleUploadFileLogo = async ({ file, onSuccess, onError }: any) => {
        const res = await callUploadSingleFile(file, "company");
        if (res && res.data) {
            setDataLogo([{
                name: res.data.fileName,
                uid: uuidv4()
            }])
            if (onSuccess) onSuccess('ok')
        } else {
            if (onError) {
                setDataLogo([])
                const error = new Error(res.message);
                onError({ event: error });
            }
        }
    };


    return (
        <>
            {openModal &&
                <>
                    <ModalForm
                        title={<>{dataInit?._id ? "Cập nhật Company" : "Tạo mới Company"}</>}
                        open={openModal}
                        modalProps={{
                            onCancel: () => { handleReset() },
                            afterClose: () => handleReset(),
                            destroyOnClose: true,
                            width: isMobile ? "100%" : 900,
                            footer: null,
                            keyboard: false,
                            maskClosable: false,
                            className: `modal-company ${animation}`,
                            rootClassName: `modal-company-root ${animation}`
                        }}
                        scrollToFirstError={true}
                        preserve={false}
                        form={form}
                        onFinish={submitCompany}
                        initialValues={dataInit?._id ? dataInit : {}}
                        submitter={{
                            render: (_: any, dom: any) => <FooterToolbar>{dom}</FooterToolbar>,
                            submitButtonProps: {
                                icon: <CheckSquareOutlined />
                            },
                            searchConfig: {
                                resetText: "Hủy",
                                submitText: <>{dataInit?._id ? "Cập nhật" : "Tạo mới"}</>,
                            }
                        }}
                    >
                        <Row gutter={16}>
                            <Col span={24}>
                                <ProFormText
                                    label="Tên công ty"
                                    name="name"
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                    placeholder="Nhập tên công ty"
                                />
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Ảnh Logo"
                                    name="logo"
                                    rules={[{
                                        required: true,
                                        message: 'Vui lòng không bỏ trống',
                                        validator: () => {
                                            if (dataLogo.length > 0) return Promise.resolve();
                                            else return Promise.reject(false);
                                        }
                                    }]}
                                >
                                    <ConfigProvider locale={enUS}>
                                        <Upload
                                            name="logo"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            maxCount={1}
                                            multiple={false}
                                            customRequest={handleUploadFileLogo}
                                            beforeUpload={beforeUpload}
                                            onChange={handleChange}
                                            onRemove={(file) => handleRemoveFile(file)}
                                            onPreview={handlePreview}
                                            defaultFileList={
                                                dataInit?._id ?
                                                    [
                                                        {
                                                            uid: uuidv4(),
                                                            name: dataInit?.logo ?? "",
                                                            status: 'done',
                                                            url: `${import.meta.env.VITE_BACKEND_URL}/images/company/${dataInit?.logo}`,
                                                        }
                                                    ] : []
                                            }

                                        >
                                            <div>
                                                {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                                                <div style={{ marginTop: 8 }}>Upload</div>
                                            </div>
                                        </Upload>
                                    </ConfigProvider>
                                </Form.Item>

                            </Col>

                            <Col span={16}>
                                <ProFormSelect
                                    name="address"
                                    label="Địa điểm"
                                    options={LOCATION_LIST.filter(item => item.value !== 'ALL')}
                                    placeholder="Please select a location"
                                    rules={[{ required: true, message: 'Vui lòng chọn địa điểm!' }]}
                                />
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="Quốc gia"
                                    name="country"
                                    rules={[{ required: true, message: 'Vui lòng chọn quốc gia' }]}
                                >
                                    <Select
                                        placeholder="Chọn quốc gia"
                                        showSearch  // Cho phép hiển thị tính năng tìm kiếm
                                        filterOption={filterCountryOption} // Phương thức tìm kiếm tùy chỉnh
                                        popupMatchSelectWidth
                                    >
                                        {renderCountryOptions()}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <ProFormText
                                    label="Company type"
                                    name="companyType"
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                    placeholder="Nhập Company Type"
                                />
                            </Col>
                            <Col span={8}>
                                <ProFormText
                                    label="Company Size"
                                    name="companySize"
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                    placeholder="Nhập Company Size"
                                />
                            </Col>
                            <Col span={8}>
                                <ProFormText
                                    label="Working Days"
                                    name="workingDays"
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                    placeholder="Nhập Working Days"
                                />
                            </Col>

                            <Col span={8}>
                                <ProFormText
                                    label="Overtime Policy"
                                    name="overtimePolicy"
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                    placeholder="Nhập Overtime Policy"
                                />
                            </Col>

                            <Col span={24} md={6}>
                                <ProForm.Item
                                    name="ourkeyskills"
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

                            <ProCard
                                title="Miêu tả"
                                // subTitle="mô tả công ty"
                                headStyle={{ color: '#d81921' }}
                                style={{ marginBottom: 20 }}
                                headerBordered
                                size="small"
                                bordered
                            >
                                <Col span={24}>
                                    <ReactQuill
                                        theme="snow"
                                        value={value}
                                        onChange={setValue}
                                    />
                                </Col>
                            </ProCard>
                        </Row>
                    </ModalForm>
                    <Modal
                        open={previewOpen}
                        title={previewTitle}
                        footer={null}
                        onCancel={() => setPreviewOpen(false)}
                        style={{ zIndex: 1500 }}
                    >
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                </>
            }
        </>
    )
}

export default ModalCompany;
