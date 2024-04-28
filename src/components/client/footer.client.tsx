import styles from 'styles/client.module.scss';
import logo from '../../../public/logo/logo.jpg';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { callgetUserAdmin } from '@/config/api';

const Footer = () => {
    const newDate = new Date().getFullYear();
    const [userData, setUserData] = useState<any>();
    useEffect(() => {
        fetchData();
    }, [])
    const fetchData = async () => {
        const resUser = await callgetUserAdmin();
        setUserData(resUser?.data);
    };

    return (
        <footer className={styles["footer-section"]} >
            <div className={styles["footer-content"]}>
                <div className={styles["content1"]}>
                    <img src={logo} alt="logo" />
                    <p>Danh sách việc làm trực tuyến số một</p>
                </div>
                <div className={styles["content2"]}>
                    <h2>Về Nice Job</h2>
                    <p><Link to={'/'} className={styles["link"]}>Trang Chủ</Link></p>
                    <p><Link to={'/'} className={styles["link"]}>Liên Hệ</Link></p>
                    <p><Link to={'/'} className={styles["link"]}>Việc Làm IT</Link></p>
                </div>
                <div className={styles["content3"]}>
                    <h2>Liên Hệ Để Đăng Tin Tuyển Dụng Tại</h2>
                    <p>{userData?.address}: {userData?.phone}</p>
                    <p>Email: {userData?.email}</p>
                    <p><Link to={'/contact'} className={styles["link"]}>Gửi Thông Tin Liên Hệ</Link></p>
                </div>
            </div>
            <div style={{ padding: 15, textAlign: "center" }}>Đồ án tốt nghiệp - nhóm 29 - năm {newDate}</div>
        </footer>
    )
}

export default Footer;