import { Avatar, Button, Col, Divider, Input, List, Row, Typography } from 'antd';
import styles from 'styles/client.module.scss';
import { useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { callCreateChat, callFetchMessageByChatId, callCreateMessage, callFetchChatById, callMessByFirstSecondId } from '@/config/api';
import { IChat } from '@/types/backend';
import { useAppSelector } from '@/redux/hooks';
import { io, Socket } from "socket.io-client";
import ListMessage from '@/components/message/listMessage';
import ListChat from '@/components/message/listChat';

type Notification = {
    senderId: string; // Đây có thể là kiểu dữ liệu thích hợp cho ID của người gửi
    isRead: boolean;
    date: Date;
};

type MySocketEvents = {
    message: string;
    connect: () => void;
    disconnect: () => void;
    getOnlineUsers: (users: any[]) => void;
    receiveMessage: (message: any) => void;
    sendMessage: (message: any) => void;
    getNotification: (notification: Notification) => void;
};

const MessagePage = (props: any) => {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [listChat, setListChat] = useState<IChat[] | null>(null);
    const { state } = location;
    const [currentChat, setCurrentChat] = useState('');
    const [messageList, setMessageList] = useState<any[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');
    const user = useAppSelector(state => state.account.user);
    const userId = user?._id;
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [selectedChatName, setSelectedChatName] = useState<string | null>(null);
    const [socket, setSocket] = useState<Socket<MySocketEvents> | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
    const socketRef = useRef<Socket | null>(null);

    const firstId = state?.firstId;
    const secondId = state?.secondId;
    const idUser = state?.userId;

    useEffect(() => {
        // Kết nối với server thông qua socket.io-client
        const newSocket = io("http://localhost:4000");
        socketRef.current = newSocket;
        setSocket(newSocket);

        // Gửi sự kiện connectUser khi người dùng kết nối
        newSocket.emit("connectUser", userId);

        // Lắng nghe sự kiện updateOnlineUsers để cập nhật danh sách người dùng đang online
        newSocket.on("updateOnlineUsers", (users) => {
            setOnlineUsers(users);
        });


        return () => {
            if (socketRef.current) {
                // Gửi sự kiện disconnectUser khi người dùng ngắt kết nối hoặc đóng tab
                socketRef.current.emit("disconnectUser", userId);
                socketRef.current.disconnect();
            }
        };
    }, [userId]);

    useEffect(() => {
        const init = async () => {
            setIsLoading(true);
            if (firstId && secondId) {
                const res = await callCreateChat({ firstId, secondId });
                if (res?.data instanceof Array && res.data.length > 0) {
                    setListChat([res.data]);
                    setSelectedChatId(res.data[0]._id);
                    setCurrentChat(res.data[0]._id);
                    setSelectedChatName(res.data[0].secondName)
                }
            } else if (idUser) {
                const res = await callFetchChatById(idUser);
                if (res?.data instanceof Array && res.data.length > 0) {
                    setListChat([res.data]);
                }
            }
            setIsLoading(false);
        };
        init();
    }, [firstId, secondId, idUser]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (firstId && secondId) {
                try {
                    const message = await callMessByFirstSecondId(firstId, secondId);
                    const newMessages = message?.data instanceof Array ? message.data.map((item, index) => ({
                        id: item._id,
                        sender: item.senderId,
                        message: item.text,
                        updatedAt: item.updatedAt,
                        chatId: item.chatId
                    })) : [];
                    setMessageList(newMessages);

                    if (message?.data instanceof Array && message.data.length > 0) {
                        setSelectedChatId(message.data[0].chatId);
                        setCurrentChat(message.data[0].chatId);
                    }
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            }
        };
        fetchMessages();
    }, [firstId, secondId]);


    const handleChatClick = async (id: string, name: string) => {
        setCurrentChat(id);
        setSelectedChatId(id);
        setSelectedChatName(name);

        try {
            const message = await callFetchMessageByChatId(id);
            const newMessages = message?.data instanceof Array ? message.data.map((item, index) => ({
                id: item._id,
                sender: item.senderId,
                message: item.text,
                updatedAt: item.updatedAt,
                chatId: item.chatId,
                name: name
            })) : [];
            setMessageList(newMessages);
            if (!newMessages.length) {
                // Xử lý khi không có tin nhắn nào trong danh sách
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = async () => {
        if (!inputMessage.trim()) return;
        try {
            const res = await callCreateMessage({
                chatId: currentChat,
                senderId: userId,
                text: inputMessage
            });
            if (res && res?.data) {
                // setCurrentChat(res?.data?.chatId || "");
                //setSelectedChatId(res.data.chatId || "");
                const newMessage = {
                    id: res.data._id,
                    sender: res.data.senderId,
                    message: res.data.text,
                    updatedAt: res.data.updatedAt,
                    chatId: res.data.chatId
                };
                setInputMessage('');
                if (socketRef.current) {
                    socketRef.current.emit('sendMessage', newMessage);
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    useEffect(() => {
        if (socket) {
            socket.on("receiveMessage", (message) => {
                if (message.chatId === selectedChatId) {
                    setSelectedChatId(message.chatId);
                    const newMessages = {
                        id: message.id,
                        sender: message.sender,
                        message: message.message,
                        updatedAt: message.updatedAt,
                        chatId: message.chatId
                    };
                    const updatedMessages = [...messageList, newMessages];
                    setMessageList(updatedMessages);
                } else {
                    return
                }
            });
        }
    }, [socket, messageList, selectedChatId]);
    return (
        <div className={`${styles.container} ${styles['message-section']}`}>
            <Row gutter={[20, 20]}>
                <ListChat
                    listChat={listChat}
                    selectedChatId={selectedChatId}
                    handleChatClick={handleChatClick}
                    onlineUsers={onlineUsers}
                />
                <ListMessage
                    selectedChatId={selectedChatId}
                    messageList={messageList}
                    inputMessage={inputMessage}
                    setInputMessage={setInputMessage}
                    sendMessage={sendMessage}
                    selectedChatName={selectedChatName}
                />
            </Row>
        </div>
    )


}

export default MessagePage;
