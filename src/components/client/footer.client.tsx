import styles from 'styles/client.module.scss';
import logo from '../../../public/logo/logo.jpg';

const Footer = () => {
    const newDate = new Date().getFullYear();
    return (
        <footer className={styles["footer-section"]} >
            <div className={styles["footer-content"]}>
                <div className={styles["content1"]}>
                    <img src={logo} alt="logo" />
                    <p>Danh sách việc làm trực tuyến số một</p>
                </div>
                <div className={styles["content2"]}>
                    <h2>Về Nice Job</h2>
                    <a href="#">Trang Chủ</a>
                    <a href="#">Liên Hệ</a>
                    <a href="#">Việc Làm IT</a>
                </div>
                <div className={styles["content3"]}>
                    <h2>Liên Hệ Để Đăng Tin Tuyển Dụng Tại</h2>
                    <p>Đà Nẵng: 0932562365</p>
                    <p>Email: trandangdong18032002@gmail.com</p>
                    <p><a href="#">Gửi Thông Tin Liên Hệ</a></p>
                </div>
            </div>
            <div style={{ padding: 15, textAlign: "center" }}>Đồ án tốt nghiệp - nhóm 29 - năm {newDate}</div>
        </footer>
    )
}

export default Footer;