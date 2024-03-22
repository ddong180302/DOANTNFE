import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { ICompany } from "@/types/backend";
import { callFetchCompanyById } from "@/config/api";
import styles from 'styles/client.module.scss';
import parse from 'html-react-parser';
import { Col, Divider, Row, Skeleton } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";


const ClientCompanyDetailPage = (props: any) => {
    const [companyDetail, setCompanyDetail] = useState<ICompany | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // job id

    useEffect(() => {
        const init = async () => {
            if (id) {
                setIsLoading(true)
                const res = await callFetchCompanyById(id);
                if (res?.data) {
                    setCompanyDetail(res.data)
                }
                setIsLoading(false)
            }
        }
        init();
    }, [id]);

    return (
        <div className={`${styles["container"]} ${styles["detail-job-section"]}`}>
            {isLoading ?
                <Skeleton />
                :
                <Row gutter={[20, 20]}>
                    {companyDetail && companyDetail._id &&
                        <>
                            <Col span={24} md={16}>
                                <div style={{ background: "#ddd", padding: "20px", borderRadius: "5px", margin: "20px 0" }}>
                                    <div className={styles["header"]}>
                                        {companyDetail.name}
                                    </div>

                                    <div className={styles["location"]}>
                                        <EnvironmentOutlined style={{ color: '#58aaab' }} />&nbsp;{(companyDetail?.address)}
                                    </div>
                                </div>

                                <div style={{ background: "#ddd", padding: "20px", borderRadius: "5px", margin: "20px 0" }}>
                                    <div className={styles["header"]}>
                                        Giới thiệu công ty
                                    </div>
                                    <Divider />
                                    <div>
                                        <div>
                                            <div>
                                                Mô hình công ty
                                            </div>
                                            {companyDetail?.companyType}
                                        </div>
                                        <div>
                                            <div>
                                                Quy mô công ty
                                            </div>
                                            {companyDetail?.companySize}
                                        </div>

                                        <div>
                                            <div>
                                                Quốc gia
                                            </div>
                                            {companyDetail?.country}
                                        </div>
                                        <div>
                                            <div>
                                                Thời gian làm việc
                                            </div>
                                            {companyDetail?.workingDays}
                                        </div>
                                        <div>
                                            <div>
                                                Làm việc ngoài giờ
                                            </div>
                                            {companyDetail?.overtimePolicy}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ background: "#ddd", padding: "20px", borderRadius: "5px" }}>
                                    <div className={styles["header"]}>
                                        Thông tin chung
                                    </div>
                                    <Divider />
                                    {parse(companyDetail?.description ?? "")}
                                </div>


                            </Col>

                            <Col style={{ background: "#ddd", padding: "20px", borderRadius: "5px", marginTop: "20px" }} span={24} md={8}>
                                <div className={styles["company"]}>
                                    <div>
                                        <img
                                            alt="example"
                                            src={`${import.meta.env.VITE_BACKEND_URL}/images/company/${companyDetail?.logo}`}
                                        />
                                    </div>
                                    <div>
                                        {companyDetail?.name}
                                    </div>
                                </div>
                            </Col>
                        </>
                    }
                </Row>
            }
        </div>
    )
}
export default ClientCompanyDetailPage;