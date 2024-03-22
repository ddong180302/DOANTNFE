import { Button, Card, Col, Empty, Form, Pagination, Row, Select, Spin } from 'antd';
import { EnvironmentOutlined, MonitorOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { LOCATION_LIST, SKILLS_LIST, convertSlug, getLocationName } from '@/config/utils';
import { ProForm } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import CompanyCard from './card/company.card';
import { IJob } from '@/types/backend';
import { useNavigate } from 'react-router-dom';
import { callFetchJob } from '@/config/api';
import { isMobile } from 'react-device-detect';
import styles from 'styles/client.module.scss';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Link } from 'react-router-dom';
dayjs.extend(relativeTime)

interface IProps {
    showPagination?: boolean;
}

const SearchClient = (props: IProps) => {
    const { showPagination = false } = props;

    const optionsSkills = SKILLS_LIST;
    const optionsLocations = LOCATION_LIST;
    const [form] = Form.useForm();

    const [displayJob, setDisplayJob] = useState<IJob[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt");
    const navigate = useNavigate();

    useEffect(() => {
        fetchJob();
    }, [current, pageSize, filter, sortQuery]);

    const fetchJob = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await callFetchJob(query);
        if (res && res.data) {
            setDisplayJob(res.data.result);
            setTotal(res.data.meta.total);
        }
        setIsLoading(false)
    }

    const handleOnchangePage = (pagination: { current: number, pageSize: number }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1);
        }
    }

    const handleViewDetailJob = (item: IJob) => {
        const slug = convertSlug(item.name);
        navigate(`/job/${slug}?id=${item._id}`)
    }

    const onFinish = async (values: any) => {
        const { skills, location } = values;

        // Xử lý filter cho kỹ năng
        const skillsFilter = skills && skills.length > 0 ? `skills=${skills.join(',')}` : '';

        // Xử lý filter cho địa điểm
        const locationFilter = location && location.length > 0 ? `location=${location.join(',')}` : '';

        // Ghép các filter lại với nhau
        const filterQuery = [skillsFilter, locationFilter].filter(Boolean).join('&');

        setFilter(filterQuery);
    }

    return (
        <ProForm
            form={form}
            onFinish={onFinish}
            submitter={
                {
                    render: () =>
                        <>
                            <div className={`${styles["card-job-section"]}`}>
                                <div className={`${styles["job-content"]}`}>
                                    <Spin spinning={isLoading} tip="Loading...">
                                        <Row gutter={[20, 20]}>
                                            <Col span={24}>
                                                <div className={isMobile ? styles["dflex-mobile"] : styles["dflex-pc"]}>
                                                    <span className={styles["title"]}>Công Việc Mới Nhất</span>
                                                    {
                                                        !showPagination
                                                        &&
                                                        <Link to="job">Xem tất cả</Link>
                                                    }
                                                </div>
                                            </Col>

                                            {displayJob?.map(item => {
                                                return (
                                                    <Col span={24} md={12} key={item._id}>
                                                        <Card size="small" title={null} hoverable
                                                            onClick={() => handleViewDetailJob(item)}
                                                        >
                                                            <div className={styles["card-job-content"]}>
                                                                <div className={styles["card-job-left"]}>
                                                                    <img
                                                                        alt="example"
                                                                        src={`${import.meta.env.VITE_BACKEND_URL}/images/company/${item?.company?.logo}`}
                                                                    />
                                                                </div>
                                                                <div className={styles["card-job-right"]}>
                                                                    <div className={styles["job-title"]}>{item.name}</div>
                                                                    <div className={styles["job-location"]}><EnvironmentOutlined style={{ color: '#58aaab' }} />&nbsp;{getLocationName(item.location)}</div>
                                                                    <div><ThunderboltOutlined style={{ color: 'orange' }} />&nbsp;{(item.salary + "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ</div>
                                                                    <div className={styles["job-updatedAt"]}>{dayjs(item.updatedAt).fromNow()}</div>
                                                                </div>
                                                            </div>

                                                        </Card>
                                                    </Col>
                                                )
                                            })}


                                            {(!displayJob || displayJob && displayJob.length === 0)
                                                && !isLoading &&
                                                <div className={styles["empty"]}>
                                                    <Empty description="Không có dữ liệu" />
                                                </div>
                                            }
                                        </Row>
                                        {showPagination && <>
                                            <div style={{ marginTop: 30 }}></div>
                                            <Row style={{ display: "flex", justifyContent: "center" }}>
                                                <Pagination
                                                    current={current}
                                                    total={total}
                                                    pageSize={pageSize}
                                                    responsive
                                                    onChange={(p: number, s: number) => handleOnchangePage({ current: p, pageSize: s })}
                                                />
                                            </Row>
                                        </>}
                                    </Spin>
                                </div>
                            </div>
                        </>
                }
            }
        >
            <Row gutter={[20, 20]}>
                <Col span={24}><h2>Việc Làm IT Cho Developer "Chất"</h2></Col>
                <Col span={24} md={16}>
                    <ProForm.Item
                        name="skills"
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
                            options={optionsSkills}
                            popupMatchSelectWidth
                        />
                    </ProForm.Item>
                </Col>
                <Col span={12} md={4}>
                    <ProForm.Item name="location">
                        <Select
                            mode="multiple"
                            allowClear
                            showArrow={false}
                            style={{ width: '100%' }}
                            placeholder={
                                <>
                                    <EnvironmentOutlined /> Địa điểm...
                                </>
                            }
                            optionLabelProp="label"
                            options={optionsLocations}
                        />
                    </ProForm.Item>
                </Col>
                <Col span={12} md={4}>
                    <Button type='primary' onClick={() => form.submit()}>Search</Button>
                </Col>
            </Row>
        </ProForm>

    )
}
export default SearchClient;