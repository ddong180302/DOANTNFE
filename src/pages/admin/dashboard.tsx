import { callCountCompany, callCountCompanyWithDate, callCountJob, callCountJobWithDate, callCountResume, callCountResumeWithDate, callCountUser, callCountUserWithDate } from "@/config/api";
import { Button, Card, Col, DatePicker, Form, Row, Statistic } from "antd";
import { useEffect, useState } from "react";
import CountUp from 'react-countup';
import dayjs from 'dayjs';

const DashboardPage = (props: any) => {
    const [user, setUser] = useState<number | undefined>();
    const [company, setCompany] = useState<number | undefined>();
    const [job, setJob] = useState<number | undefined>();
    const [resume, setResume] = useState<number | undefined>();
    const [startDate, setStartDate] = useState<any>(null);
    const [startDateSelected, setStartDateSelected] = useState<boolean>(false);
    const [form] = Form.useForm();



    const formatter = (value: number | string) => {
        return (
            <CountUp end={Number(value)} separator="," />
        );
    };

    useEffect(() => {
        fetchData();
    }, [])


    const fetchData = async () => {
        const resUser = await callCountUser();
        setUser(resUser?.data);

        const resCompany = await callCountCompany();
        setCompany(resCompany?.data);

        const resJob = await callCountJob();
        setJob(resJob?.data);

        const resResume = await callCountResume();
        setResume(resResume?.data);
    };

    const onFinish = async (values: any) => {
        const { startDate, endDate } = values;
        const formattedStartDate = dayjs(startDate).toISOString();
        const formattedEndDate = dayjs(endDate).toISOString();
        if (formattedStartDate && formattedEndDate) {
            const dataJob = await callCountJobWithDate(formattedStartDate, formattedEndDate);
            setJob(dataJob?.data);

            const dataUser = await callCountUserWithDate(formattedStartDate, formattedEndDate);
            setUser(dataUser?.data);

            const dataCompany = await callCountCompanyWithDate(formattedStartDate, formattedEndDate);
            setCompany(dataCompany?.data);

            const dataResume = await callCountResumeWithDate(formattedStartDate, formattedEndDate);
            setResume(dataResume?.data);

        }
    };


    const handleChangeStartDate = (date: dayjs.Dayjs | null) => {
        setStartDate(date);
        setStartDateSelected(true);
    };

    const disabledEndDate = (current: dayjs.Dayjs | null) => {
        if (!startDateSelected) return true;
        return current ? current.isBefore(startDate!.startOf('day')) : false;
    };

    const onReset = () => {
        form.resetFields();
        fetchData();
    };


    return (
        <>
            <Row gutter={[20, 20]} style={{ background: "#fff", borderRadius: "5px", marginTop: "20px", marginLeft: "5px", marginRight: "5px", padding: "20px" }}>
                <Form
                    form={form}
                    layout="inline"
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Ngày bắt đầu"
                        name="startDate"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
                    >
                        <DatePicker onChange={handleChangeStartDate} format="DD/MM/YYYY" />
                    </Form.Item>
                    <Form.Item
                        label="Ngày kết thúc"
                        name="endDate"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
                    >
                        <DatePicker disabledDate={disabledEndDate} format="DD/MM/YYYY" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="button" onClick={onReset}>
                            Reset
                        </Button>
                    </Form.Item>
                </Form>
            </Row>
            <Row gutter={[20, 20]} style={{ marginTop: "20px" }}>
                <Col span={24} md={8}>
                    <Card title="Tất cả người dùng" bordered={false} >
                        <Statistic
                            title="Users"
                            value={user}
                            formatter={formatter}
                        />

                    </Card>
                </Col>
                <Col span={24} md={8}>
                    <Card title="Tất cả công ty" bordered={false} >
                        <Statistic
                            title="Company"
                            value={company}
                            formatter={formatter}
                        />
                    </Card>
                </Col>
                <Col span={24} md={8}>
                    <Card title="Tất cả các Job" bordered={false} >
                        <Statistic
                            title="Jobs"
                            value={job}
                            formatter={formatter}
                        />
                    </Card>
                </Col>

                <Col span={24} md={8}>
                    <Card title="Tất cả các Hồ Sơ" bordered={false} >
                        <Statistic
                            title="Resume"
                            value={resume}
                            formatter={formatter}
                        />
                    </Card>
                </Col>

            </Row>
        </>
    )
}

export default DashboardPage;