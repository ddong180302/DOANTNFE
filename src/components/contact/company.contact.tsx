import { callFetchCompany } from '@/config/api';
import { convertSlug } from '@/config/utils';
import { ICompany } from '@/types/backend';
import { Card, Col, Empty, Pagination, Row, Spin } from 'antd';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from 'styles/client.module.scss';

interface IProps {
    showPagination?: boolean;
}

const CompanyContact = (props: IProps) => {
    const { showPagination = false } = props;
    const [displayCompany, setDisplayCompany] = useState<ICompany[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCompany();
    }, [current, pageSize]);

    const fetchCompany = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`;

        const res = await callFetchCompany(query);
        if (res && res.data) {
            setDisplayCompany(res.data.result);
            setTotal(res.data.meta.total);
        }
        setIsLoading(false)
    }

    const handleOnchangePage = (pagination: { current: number, pageSize: number }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }
    }

    const handleViewDetailJob = (item: ICompany) => {
        if (item.name) {
            const slug = convertSlug(item.name);
            navigate(`/company/${slug}?id=${item._id}`)
        }
    }

    return (
        <div>
            <div>
                <Spin spinning={isLoading} tip="Loading...">
                    <Row gutter={[20, 20]}>
                        {
                            displayCompany?.map(item => {
                                return (
                                    <Col span={24} md={8} key={item._id}>
                                        <Card
                                            className={styles["card"]}
                                            onClick={() => handleViewDetailJob(item)}
                                        >
                                            <div className={styles["card-customize"]} >
                                                <img
                                                    alt="example"
                                                    src={`${import.meta.env.VITE_BACKEND_URL}/images/company/${item?.logo}`}
                                                />
                                            </div>
                                        </Card>
                                    </Col>
                                )
                            })
                        }

                        {
                            (!displayCompany || displayCompany && displayCompany.length === 0)
                            && !isLoading &&
                            <div className={styles["empty"]}>
                                <Empty description="Không có dữ liệu" />
                            </div>
                        }
                    </Row>
                    {
                        showPagination && <>
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
                        </>
                    }
                </Spin>
            </div>
        </div>
    )
}

export default CompanyContact;