import { callCountCompany, callCountJob, callCountResume, callCountUser } from "@/config/api";
import { Card, Col, DatePicker, Form, Row, Statistic } from "antd";
import moment from "moment";
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



    const formatter = (value: number | string) => {
        return (
            <CountUp end={Number(value)} separator="," />
        );
    };

    useEffect(() => {
        const countUser = async () => {
            const res = await callCountUser();
            if (res && res.data) {
                setUser(res.data);
            }
        }

        countUser();
    }, [])

    useEffect(() => {
        const countCompany = async () => {
            const res = await callCountCompany();
            if (res && res.data) {
                setCompany(res.data);
            }
        }

        countCompany();
    }, [])

    useEffect(() => {
        const countJob = async () => {
            const res = await callCountJob();
            if (res && res.data) {
                setJob(res.data);
            }
        }

        countJob();
    }, [])

    useEffect(() => {
        const countResume = async () => {
            const res = await callCountResume();
            if (res && res.data) {
                setResume(res.data);
            }
        }

        countResume();
    }, [])



    const handleDateRangeChange = (values: any) => {
        const { startDate, endDate } = values;
        const formattedStartDate = dayjs(startDate).toISOString(); // Định dạng ngày bắt đầu
        const formattedEndDate = dayjs(endDate).toISOString(); // Định dạng ngày kết thúc
        console.log(formattedStartDate, formattedEndDate);
        setStartDate(values.startDate);
    };


    const handleChangeStartDate = (date: dayjs.Dayjs | null) => {
        setStartDate(date);
        setStartDateSelected(true);
    };

    const disabledEndDate = (current: dayjs.Dayjs | null) => {
        if (!startDateSelected) return true;
        return current ? current.isBefore(startDate!.startOf('day')) : false;
    };

    return (
        <>
            <Row gutter={[20, 20]} style={{ background: "#fff", height: "50px", borderRadius: "5px" }}>
                <Form layout="inline" onFinish={handleDateRangeChange}>
                    <Form.Item label="Ngày bắt đầu" name="startDate">
                        <DatePicker onChange={handleChangeStartDate} />
                    </Form.Item>
                    <Form.Item label="Ngày kết thúc" name="endDate">
                        <DatePicker disabledDate={disabledEndDate} />
                    </Form.Item>
                    <Form.Item>
                        <button type="submit">Lọc</button>
                    </Form.Item>
                </Form>
            </Row>
            <Row gutter={[20, 20]}>
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