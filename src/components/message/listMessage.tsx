import { DeleteOutlined, EditOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Col, Input, Popconfirm, Typography } from 'antd';
import styles from 'styles/client.module.scss';
import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)
dayjs.locale('vi');
import moment from 'moment';

interface IProps {
    selectedChatId: string | null;
    selectedChatName: string | null;
    messageList: any[];
    inputMessage: string;
    setInputMessage: React.Dispatch<React.SetStateAction<string>>;
    sendMessage: () => void;
}


const ListMessage = (props: IProps) => {
    const { selectedChatId, messageList, inputMessage, setInputMessage, sendMessage, selectedChatName } = props;

    const user = useAppSelector(state => state.account.user);
    const userId = user?._id;
    const endOfMessagesRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messageList]);

    const formatMessageTime = (timestamp: Date) => {
        const messageTime = moment(timestamp);
        const today = moment().startOf('day');
        const yesterday = moment().subtract(1, 'days').startOf('day');

        if (messageTime.isSame(today, 'day')) {
            return `Hôm nay lúc ${messageTime.format('HH:mm')}`;
        } else if (messageTime.isSame(yesterday, 'day')) {
            return `Hôm qua lúc ${messageTime.format('HH:mm')}`;
        } else {
            return `Ngày ${messageTime.format('DD/MM/YYYY')} lúc ${messageTime.format('HH:mm')}`;
        }
    };

    return (
        <>
            <Col span={24} md={16} className={styles["listmess"]}>
                {selectedChatId &&
                    <div style={{ display: "flex", height: "40px", background: "black", color: "#fff", textAlign: "center", fontSize: "20px", justifyContent: "center", fontWeight: "bold", alignItems: "center", lineHeight: "100%" }}>
                        {selectedChatName}
                    </div>
                }
                <div className={styles['listtext']}>
                    {messageList.map((message, index) => (
                        <div key={index} className={`${styles.divtext} ${message.sender === userId ? styles.divtext1 : styles.divtext2}`}>
                            <div
                                ref={endOfMessagesRef}
                                style={{ backgroundColor: message.sender === userId ? '#1890ff' : '#f0f0f0' }}
                            >
                                <div>
                                    <Typography.Text>{message.message}</Typography.Text>
                                </div>
                                <div>
                                    <Typography.Text style={{ fontSize: 12, color: 'rgb(129 123 123)' }}>
                                        {formatMessageTime(message.updatedAt)}
                                    </Typography.Text>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles['input-section']}>
                    <Input
                        placeholder="Nhập tin nhắn..."
                        className={styles['ant-input']}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                sendMessage();
                            }
                        }}
                    />
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={sendMessage}
                        className={styles['ant-btn']}
                    >
                        Gửi
                    </Button>
                </div>
            </Col>
        </>
    )

}

export default ListMessage;