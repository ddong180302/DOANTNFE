
import { useAppSelector } from "@/redux/hooks";
import { ICompany } from "@/types/backend";
import { EnvironmentOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Row, Skeleton, Tag } from "antd";
import { useState, useEffect } from 'react';
import parse from 'html-react-parser';
import styles from 'styles/client.module.scss';
import { callGetCompanyByUser } from "@/config/api";
import ModalCompany from "@/components/hr/company/modal.company";

const CompanyPageHr = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<ICompany | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const user = useAppSelector(state => state.account.user);
    const [companyDetail, setCompanyDetail] = useState<ICompany | null>(null);
    const [shouldReloadData, setShouldReloadData] = useState<boolean>(false);

    const userId = user?._id;

    useEffect(() => {
        const init = async () => {
            if (userId) {
                setIsLoading(true)
                const res = await callGetCompanyByUser();
                if (res?.data) {
                    setDataInit(res.data)
                    setCompanyDetail(res.data)
                }
                setIsLoading(false)
            }
        }
        init();
    }, [userId, shouldReloadData]);

    const handleClick = () => {
        setOpenModal(true);
    }

    const handleModalClose = async () => {
        setOpenModal(false);
        setShouldReloadData(true); // Khi modal được đóng, set shouldReloadData thành true để re-render dữ liệu
        if (userId) {
            setIsLoading(true)
            const res = await callGetCompanyByUser();
            if (res?.data) {
                setDataInit(res.data)
                setCompanyDetail(res.data)
            }
            setIsLoading(false)
        }
    };


    return (
        <div className={`${styles["container"]} ${styles["company-hr-section"]}`}>
            {isLoading ?
                <Skeleton />
                :
                <Row gutter={[20, 20]}>
                    {companyDetail && companyDetail._id &&
                        <>
                            <Col className={styles["company-detail"]}>
                                <div className={styles["edit-btn"]}>
                                    <Button onClick={() => handleClick()}>Sửa</Button>
                                </div>
                                <div className={styles["company"]}>
                                    <div className={styles["logo"]}>
                                        <img
                                            alt="example"
                                            src={`${import.meta.env.VITE_BACKEND_URL}/images/company/${companyDetail?.logo}`}
                                        />
                                    </div>
                                    <div className={styles["name-location"]}>
                                        <div className={styles["name"]}>
                                            {companyDetail?.name}
                                        </div>
                                        <div className={styles["location"]}>
                                            <EnvironmentOutlined style={{ color: '#58aaab' }} />&nbsp;{(companyDetail?.address)}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles["company-content"]}  >
                                    <div className={styles["header"]}>
                                        Giới thiệu công ty
                                    </div>
                                    <Divider />
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px" }}>
                                        <div>
                                            <div>
                                                Mô hình công ty
                                            </div>
                                            <div style={{ marginTop: "10px", fontWeight: "bold" }}>
                                                {companyDetail?.companyType}
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                Quy mô công ty
                                            </div>
                                            <div style={{ marginTop: "10px", fontWeight: "bold" }}>
                                                {companyDetail?.companySize}
                                            </div>
                                        </div>

                                        <div>
                                            <div>
                                                Quốc gia
                                            </div>
                                            <div style={{ marginTop: "10px", fontWeight: "bold" }}>
                                                {companyDetail?.country}
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                Thời gian làm việc
                                            </div>
                                            <div style={{ marginTop: "10px", fontWeight: "bold" }}>
                                                {companyDetail?.workingDays}
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                Làm việc ngoài giờ
                                            </div>
                                            <div style={{ marginTop: "10px", fontWeight: "bold" }}>
                                                {companyDetail?.overtimePolicy}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Divider />
                                <div className={styles["company-skills"]}>
                                    <div className={styles["header"]}>
                                        Thông tin chung
                                    </div>
                                    <Divider />
                                    {companyDetail?.ourkeyskills?.map((item, index) => {
                                        return (
                                            <Tag key={`${index}-key`} color="gold" style={{ padding: "2px 10px", marginBottom: "5px", fontSize: "16px" }} >
                                                {item}
                                            </Tag>
                                        )
                                    })}
                                </div>
                                <div className={styles["company-des"]}  >
                                    <div className={styles["header"]}>
                                        Thông tin chung
                                    </div>
                                    <Divider />
                                    <div className={styles["des"]}>
                                        {parse(companyDetail?.description ?? "")}
                                    </div>
                                </div>
                            </Col>
                        </>
                    }
                </Row>
            }

            <ModalCompany
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={dataInit}
                setDataInit={setDataInit}
                afterCloseModal={handleModalClose} // Truyền callback function để xử lý sau khi modal được đóng
            />
        </div>


    )
}

export default CompanyPageHr;