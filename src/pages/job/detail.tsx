import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { ICompany, IJob } from "@/types/backend";
import { callCreateChat, callFetchCompanyById, callFetchIdUser, callFetchJobById } from "@/config/api";
import styles from 'styles/client.module.scss';
import parse from 'html-react-parser';
import { Col, Divider, Row, Skeleton, Tag } from "antd";
import { DollarOutlined, EnvironmentOutlined, HistoryOutlined } from "@ant-design/icons";
import { getLocationName } from "@/config/utils";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ApplyModal from "@/components/client/modal/apply.modal";
import { useAppSelector } from "@/redux/hooks";
dayjs.extend(relativeTime)


const ClientJobDetailPage = (props: any) => {
    const [jobDetail, setJobDetail] = useState<IJob | null>(null);
    const [companyDetail, setCompanyDetail] = useState<ICompany | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [firstId, setFirstId] = useState<string>();
    const [secondId, setSecondId] = useState<string>();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // job id
    const user = useAppSelector(state => state.account.user);
    const userId = user?._id;
    const userRole = user?.role?.name;
    const navigate = useNavigate();
    console.log("user: ", user)


    useEffect(() => {
        const init = async () => {
            if (id && !jobDetail) {
                const res = await callFetchJobById(id);
                if (res?.data) {
                    setJobDetail(res.data);
                    setFirstId(userId)
                }
            }
        };
        init();
    }, [id, jobDetail]);

    useEffect(() => {
        const init = async () => {
            if (jobDetail?.company?._id && !companyDetail) {
                const idCom = jobDetail.company._id;
                const resCom = await callFetchCompanyById(idCom);
                if (resCom?.data) {
                    setCompanyDetail(resCom.data);
                }
            }
        };
        init();
    }, [jobDetail, companyDetail]);

    useEffect(() => {
        const init = async () => {
            if (companyDetail && !secondId) {
                const idCom = companyDetail?._id || "";
                const resCom = await callFetchIdUser(idCom);
                if (resCom?.data) {
                    setSecondId(resCom.data._id);
                    //setFirstId(userId);
                }
            }
        };
        init();
    }, [companyDetail, secondId]);

    // Định nghĩa hàm xử lý sự kiện
    const handleChat = async () => {
        if (isAuthenticated) {
            navigate('/messages', { state: { firstId, secondId } });
        } else {
            navigate('/login');
        }
    };

    return (
        <div className={`${styles["container"]} ${styles["detail-job-section"]}`}>
            {isLoading ?
                <Skeleton />
                :
                <Row gutter={[20, 20]}>
                    {jobDetail && jobDetail._id &&
                        <>
                            <Col className={styles["left-col"]} span={24} md={15}>
                                <div className={styles["header"]}>
                                    {jobDetail.name}
                                </div>
                                <div>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className={styles["btn-apply"]}
                                    >Ứng Tuyển</button>
                                </div>
                                <Divider />
                                <div className={styles["skills"]}>
                                    {jobDetail?.skills?.map((item, index) => {
                                        return (
                                            <Tag key={`${index}-key`} color="gold" >
                                                {item}
                                            </Tag>
                                        )
                                    })}
                                </div>
                                <div className={styles["salary"]}>
                                    <DollarOutlined />
                                    <span>&nbsp;{(jobDetail.salary + "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ</span>
                                </div>
                                <div className={styles["location"]}>
                                    <EnvironmentOutlined style={{ color: '#58aaab' }} />&nbsp;{getLocationName(jobDetail.location)}
                                </div>
                                <div>
                                    <HistoryOutlined /> {dayjs(jobDetail.updatedAt).fromNow()}
                                </div>
                                {userRole === "USER"
                                    &&
                                    <div>
                                        <button className={styles["btn-chat"]} onClick={() => handleChat()}>
                                            Chat ngay
                                        </button>
                                    </div>
                                }
                                <Divider />
                                {parse(jobDetail.description)}
                            </Col>

                            {companyDetail && companyDetail._id &&
                                <Col span={24} md={8} className={styles["right-col"]}>
                                    <div className={styles["company"]}>
                                        <div className={styles["logo-name"]}>
                                            <div className={styles["logo"]}>
                                                <img
                                                    alt="example"
                                                    src={`${import.meta.env.VITE_BACKEND_URL}/images/company/${jobDetail.company?.logo}`}
                                                />
                                            </div>
                                            <div className={styles["name"]}>
                                                {companyDetail?.name}
                                            </div>
                                        </div>
                                        <Divider />
                                        <div className={styles["detail"]}>
                                            <div className={styles["detail-label"]}>
                                                Địa chỉ
                                            </div>
                                            <div className={styles["detail-content"]}>
                                                {companyDetail?.address}
                                            </div>
                                        </div>
                                        <div className={styles["detail"]}>
                                            <div className={styles["detail-label"]}>
                                                Quy mô công ty
                                            </div>
                                            <div className={styles["detail-content"]}>
                                                {companyDetail?.companySize}
                                            </div>
                                        </div>
                                        <div className={styles["detail"]}>
                                            <div className={styles["detail-label"]}>
                                                Mô hình công ty
                                            </div>
                                            <div className={styles["detail-content"]}>
                                                {companyDetail?.companyType}
                                            </div>
                                        </div>
                                        <div className={styles["detail"]}>
                                            <div className={styles["detail-label"]}>
                                                Quốc gia
                                            </div>
                                            <div className={styles["detail-content"]}>
                                                {companyDetail?.country}
                                            </div>
                                        </div>
                                        <div className={styles["detail"]}>
                                            <div className={styles["detail-label"]}>
                                                Thời gian làm việc
                                            </div>
                                            <div className={styles["detail-content"]}>
                                                {companyDetail?.workingDays}
                                            </div>
                                        </div>
                                        <div className={styles["detail"]}>
                                            <div className={styles["detail-label"]}>
                                                Làm việc ngoài giờ
                                            </div>
                                            <div className={styles["detail-content"]}>
                                                {companyDetail?.overtimePolicy}
                                            </div>
                                        </div>
                                    </div>
                                </Col>

                            }
                        </>
                    }
                </Row>
            }
            <ApplyModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                jobDetail={jobDetail}
            />
        </div>
    )
}
export default ClientJobDetailPage;