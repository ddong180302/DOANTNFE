
import DataTable from "@/components/client/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchCompany } from "@/redux/slice/companySlide";
import { ICompany } from "@/types/backend";
import { DeleteOutlined, EditOutlined, EnvironmentOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Col, Divider, Row, Popconfirm, Space, message, notification, Skeleton } from "antd";
import { useState, useRef, useEffect } from 'react';
import parse from 'html-react-parser';
import dayjs from 'dayjs';
import ModalCompany from "@/components/hr/company/modal.company";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import styles from 'styles/client.module.scss';
import { callGetCompanyByUser } from "@/config/api";

const CompanyPageHr = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<ICompany | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const user = useAppSelector(state => state.account.user);
    const [companyDetail, setCompanyDetail] = useState<ICompany | null>(null);

    const userId = user?._id;

    const tableRef = useRef<ActionType>();

    useEffect(() => {
        const init = async () => {
            if (userId) {
                setIsLoading(true)
                const res = await callGetCompanyByUser();
                if (res?.data) {
                    setCompanyDetail(res.data)
                }
                setIsLoading(false)
            }
        }
        init();
    }, [userId]);


    const reloadTable = () => {
        tableRef?.current?.reload();
    }

    return (
        <div className={`${styles["container"]} ${styles["detail-job-section"]}`}>
            {isLoading ?
                <Skeleton />
                :
                <Row gutter={[20, 20]}>
                    {companyDetail && companyDetail._id &&
                        <>
                            <Col>
                                <div>
                                    <button>chỉnh sủa thông tin</button>
                                </div>
                                <div className={styles["company"]}>

                                    <div className={styles["company-logo"]}>
                                        <div>
                                            <img
                                                alt="example"
                                                src={`${import.meta.env.VITE_BACKEND_URL}/images/company/${companyDetail?.logo}`}
                                            />
                                        </div>
                                        <div>
                                            {companyDetail?.name}
                                        </div>
                                        <div className={styles["location"]}>
                                            <EnvironmentOutlined style={{ color: '#58aaab' }} />&nbsp;{(companyDetail?.address)}
                                        </div>
                                    </div>

                                </div>

                                <div className={styles["company"]}  >
                                    <div className={styles["header"]}>
                                        Giới thiệu công ty
                                    </div>
                                    <Divider />
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
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

                                <div className={styles["company"]}  >
                                    <div className={styles["header"]}>
                                        Thông tin chung
                                    </div>
                                    <Divider />
                                    {parse(companyDetail?.description ?? "")}
                                </div>
                            </Col>

                        </>
                    }
                </Row>
            }
        </div>
    )
}

export default CompanyPageHr;