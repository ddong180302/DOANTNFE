import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { ICompany, IJob } from "@/types/backend";
import { callFetchCompanyById, callFetchJobByIdCompany } from "@/config/api";
import styles from 'styles/client.module.scss';
import parse from 'html-react-parser';
import { Card, Col, Divider, Empty, Row, Skeleton, Tag } from "antd";
import { EnvironmentOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { convertSlug, getLocationName } from "@/config/utils";
import dayjs from "dayjs";


const ClientCompanyDetailPage = (props: any) => {
    const [companyDetail, setCompanyDetail] = useState<ICompany | null>(null);
    const [listJob, setListJob] = useState<IJob[]>([]);
    const [countJob, setCountJob] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // company id


    useEffect(() => {
        const init = async () => {
            if (id) {
                setIsLoading(true)
                const res = await callFetchCompanyById(id);
                const resCom = await callFetchJobByIdCompany(id);
                if (res?.data) {
                    setCompanyDetail(res.data)
                }

                if (resCom?.data && resCom?.data?.count && resCom?.data?.jobs) {
                    setCountJob(resCom?.data?.count)
                    setListJob(resCom?.data?.jobs)
                }
                setIsLoading(false)
            }
        }
        init();
    }, [id]);
    const handleViewDetailJob = (item: IJob) => {
        const slug = convertSlug(item.name);
        navigate(`/job/${slug}?id=${item._id}`)
    }

    return (
        <div className={`${styles["container"]} ${styles["detail-company-section"]}`}>
            {isLoading ?
                <Skeleton />
                :
                <Row gutter={[20, 20]}>
                    {companyDetail && companyDetail._id &&
                        <>
                            <Col span={24} md={16} className={styles["company-detail"]}>
                                <div className={styles["company"]}>
                                    <div className={styles["company-logo"]}>
                                        <img
                                            alt="example"
                                            src={`${import.meta.env.VITE_BACKEND_URL}/images/company/${companyDetail?.logo}`}
                                        />
                                    </div>
                                    <div className={styles["name-location"]}>
                                        <div className={styles["company-name"]}>
                                            {companyDetail?.name}
                                        </div>
                                        <div className={styles["company-location"]}>
                                            <EnvironmentOutlined style={{ color: '#58aaab' }} />&nbsp;{(companyDetail?.address)}
                                        </div>
                                    </div>
                                </div>

                                <div className={styles["company-introduce"]}>
                                    <div className={styles["header"]}>
                                        Giới thiệu công ty
                                    </div>
                                    <Divider />
                                    <div className={styles["intro-detail"]}>
                                        <div>
                                            <div>
                                                Mô hình công ty
                                            </div>
                                            <div className={styles["detail"]} >
                                                {companyDetail?.companyType}
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                Quy mô công ty
                                            </div>
                                            <div className={styles["detail"]}>
                                                {companyDetail?.companySize}
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                Quốc gia
                                            </div>
                                            <div className={styles["detail"]}>
                                                {companyDetail?.country}
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                Thời gian làm việc
                                            </div>
                                            <div className={styles["detail"]}>
                                                {companyDetail?.workingDays}
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                Làm việc ngoài giờ
                                            </div>
                                            <div className={styles["detail"]}>
                                                {companyDetail?.overtimePolicy}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className={styles["company-introduce"]}>
                                    <div className={styles["header"]}>
                                        Kỹ Năng Của Chúng Tôi


                                    </div>
                                    <Divider />
                                    <div className={styles["skills"]}>
                                        {companyDetail?.ourkeyskills?.map((item, index) => {
                                            return (
                                                <Tag key={`${index}-key`} color="gold" className={styles["skill-tag"]}>
                                                    {item}
                                                </Tag>
                                            )
                                        })}
                                    </div>

                                </div>
                                <div className={styles["company-introduce"]}>
                                    <div className={styles["header"]}>
                                        Thông tin chung
                                    </div>
                                    <Divider />
                                    {parse(companyDetail?.description ?? "")}
                                </div>
                            </Col>
                            <Col span={24} md={8} className={styles["job"]}>
                                <div className={styles["count-job"]}>{countJob} việc làm đang tuyển dụng</div>
                                {listJob?.map(item => {
                                    return (
                                        <div className={styles["job-detail"]} key={item._id} >
                                            <Card size="small" title={null} hoverable
                                                onClick={() => handleViewDetailJob(item)}
                                            >
                                                <div className={styles["card-job-content"]}>
                                                    <div className={styles["job-time"]}>{dayjs(item.updatedAt).fromNow()}</div>
                                                    <div className={styles["job-title"]}>
                                                        {item.name}
                                                    </div>
                                                    <div className={styles["job-logo-name"]}>
                                                        <div className={styles["logo"]}>
                                                            <img
                                                                alt="example"
                                                                src={`${import.meta.env.VITE_BACKEND_URL}/images/company/${item?.company?.logo}`}
                                                            />
                                                        </div>
                                                        <div className={styles["name"]}>
                                                            {item.company?.name}
                                                        </div>
                                                    </div>

                                                    <div className={styles["job-location"]}><EnvironmentOutlined style={{ color: '#58aaab' }} />
                                                        &nbsp;{getLocationName(item.location)}
                                                    </div>
                                                    <div>
                                                        <ThunderboltOutlined style={{ color: 'orange' }} />
                                                        &nbsp;{(item.salary + "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ
                                                    </div>

                                                </div>
                                            </Card>
                                        </div>
                                    )
                                })}


                                {(!listJob || listJob && listJob.length === 0)
                                    && !isLoading &&
                                    <div className={styles["empty"]}>
                                        <Empty description="Không có dữ liệu" />
                                    </div>
                                }
                            </Col>
                        </>
                    }
                </Row>
            }
        </div>
    )
}
export default ClientCompanyDetailPage;