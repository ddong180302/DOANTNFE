import { Row } from 'antd';
import styles from 'styles/client.module.scss';
import { useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
    callCreateChat,
    callFetchMessageByChatId,
    callCreateMessage,
    callFetchChatById,
    callMessByFirstSecondId,
    callFetchNotifications,
    callResetNotification,
    callCreateOrUpdateNotification
} from '@/config/api';
import { IChat } from '@/types/backend';
import { useAppSelector } from '@/redux/hooks';
import { io, Socket } from "socket.io-client";
import ListMessage from '@/components/message/listMessage';
import ListChat from '@/components/message/listChat';

type Notification = {
    senderId: string;
    isRead: boolean;
    date: Date;
};

type Message = {
    id: string;
    sender: string;
    message: string;
    updatedAt: string;
    chatId: string;
};

type MySocketEvents = {
    message: string;
    connect: () => void;
    disconnect: () => void;
    getOnlineUsers: (users: any[]) => void;
    receiveMessage: (message: Message) => void;
    sendMessage: (message: Message) => void;
    getNotification: (notification: Notification) => void;
};

const MessagePage = (props: any) => {
    const location = useLocation();
    const { state } = location;
    const firstId = state?.userId;
    const secondId = state?.secondId;

    const [listChat, setListChat] = useState<IChat[] | null>(null);
    const [currentChat, setCurrentChat] = useState<string>('');
    const [messageList, setMessageList] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');
    const user = useAppSelector(state => state.account.user);
    const userId = user?._id;
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [selectedChatName, setSelectedChatName] = useState<string | null>(null);
    const [socket, setSocket] = useState<Socket<MySocketEvents> | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
    const socketRef = useRef<Socket | null>(null);
    const [latestMessages, setLatestMessages] = useState<{ [key: string]: Message }>({});
    const [notifications, setNotifications] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        const newSocket = io("http://localhost:4000");
        socketRef.current = newSocket;
        setSocket(newSocket);

        newSocket.emit("connectUser", userId);

        newSocket.on("updateOnlineUsers", (users) => {
            setOnlineUsers(users);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.emit("disconnectUser", userId);
                socketRef.current.disconnect();
            }
        };
    }, [userId]);

    useEffect(() => {
        const init = async () => {
            if (firstId && secondId) {
                const res = await callCreateChat({ firstId, secondId });
                if (res?.data instanceof Array && res.data.length > 0) {
                    const existingChat = res.data.find(chat => chat.firstId === firstId && chat.secondId === secondId);
                    if (existingChat) {
                        setListChat([res.data]);
                        setSelectedChatId(existingChat._id);
                        setCurrentChat(existingChat._id);
                        setSelectedChatName(existingChat.secondName);

                        // Fetch latest messages for each chat
                        const latestMessages = await Promise.all(
                            res.data.map(async (chat) => {
                                const messageRes = await callFetchMessageByChatId(chat._id);
                                if (messageRes?.data instanceof Array && messageRes.data.length > 0) {
                                    const latestMessage = messageRes.data[messageRes.data.length - 1];
                                    return {
                                        [chat._id]: {
                                            id: latestMessage._id,
                                            sender: latestMessage.senderId,
                                            message: latestMessage.text,
                                            updatedAt: latestMessage.updatedAt,
                                            chatId: chat._id
                                        }
                                    };
                                }
                                return {};
                            })
                        );

                        // Merge all latest messages into one object
                        const mergedLatestMessages = latestMessages.reduce((acc, curr) => ({ ...acc, ...curr }), {});
                        setLatestMessages(mergedLatestMessages);
                    }
                }
            } else if (userId) {
                const res = await callFetchChatById(userId);
                if (res?.data instanceof Array && res.data.length > 0) {
                    setListChat(res.data);
                    // Fetch latest messages for each chat
                    const latestMessages = await Promise.all(
                        res.data.map(async (chat) => {
                            const messageRes = await callFetchMessageByChatId(chat._id);
                            if (messageRes?.data instanceof Array && messageRes.data.length > 0) {
                                const latestMessage = messageRes.data[messageRes.data.length - 1];
                                return {
                                    [chat._id]: {
                                        id: latestMessage._id,
                                        sender: latestMessage.senderId,
                                        message: latestMessage.text,
                                        updatedAt: latestMessage.updatedAt,
                                        chatId: chat._id
                                    }
                                };
                            }
                            return {};
                        })
                    );

                    // Merge all latest messages into one object
                    const mergedLatestMessages = latestMessages.reduce((acc, curr) => ({ ...acc, ...curr }), {});
                    setLatestMessages(mergedLatestMessages);
                }
            }
        };
        init();
    }, [firstId, secondId, userId]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (firstId && secondId) {
                try {
                    const message = await callMessByFirstSecondId(firstId, secondId);
                    const newMessages = message?.data instanceof Array ? message.data.map((item) => ({
                        id: item._id,
                        sender: item.senderId,
                        message: item.text,
                        updatedAt: item.updatedAt,
                        chatId: item.chatId
                    })) : [];
                    setMessageList(newMessages);
                    if (newMessages.length > 0) {
                        const latestMessage = newMessages[newMessages.length - 1];
                        setLatestMessages(prev => ({ ...prev, [latestMessage.chatId]: latestMessage }));
                    }
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            }
        };
        fetchMessages();
    }, [firstId, secondId]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await callFetchNotifications(userId);
                if (res?.data) {
                    const notificationData = res.data.reduce<{ [key: string]: number }>((acc, notification) => {
                        acc[notification.chatId] = notification.count;
                        return acc;
                    }, {});
                    setNotifications(notificationData);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };
        if (userId) {
            fetchNotifications();
        }
    }, [userId]);

    const handleChatClick = async (id: string, name: string) => {
        setCurrentChat(id);
        setSelectedChatId(id);
        setSelectedChatName(name);

        try {
            const message = await callFetchMessageByChatId(id);
            const newMessages = message?.data instanceof Array ? message.data.map((item) => ({
                id: item._id,
                sender: item.senderId,
                message: item.text,
                updatedAt: item.updatedAt,
                chatId: item.chatId,
                name: name
            })) : [];
            setMessageList(newMessages);

            // Reset notifications for the selected chat
            setNotifications((prevNotifications) => {
                const updatedNotifications = {
                    ...prevNotifications,
                    [id]: 0,
                };

                // Gọi API để reset thông báo
                callResetNotification({ userId, chatId: id });

                return updatedNotifications;
            });

            if (newMessages.length > 0) {
                const latestMessage = newMessages[newMessages.length - 1];
                setLatestMessages(prev => ({ ...prev, [latestMessage.chatId]: latestMessage }));
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
                const newMessage: Message = {
                    id: res.data._id || "",
                    sender: res.data.senderId || "",
                    message: res.data.text || "",
                    updatedAt: res.data.updatedAt || "",
                    chatId: res.data.chatId || ""
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
            const handleReceiveMessage = (message: Message) => {
                if (message.chatId === selectedChatId) {
                    setMessageList((prevMessages) => [...prevMessages, message]);
                } else {
                    setNotifications((prevNotifications) => {
                        const updatedNotifications = {
                            ...prevNotifications,
                            [message.chatId]: (prevNotifications[message.chatId] || 0) + 1,
                        };
                        // Gọi API để cập nhật thông báo
                        callCreateOrUpdateNotification({
                            userId,
                            chatId: message.chatId,
                            count: updatedNotifications[message.chatId],
                            lastMessage: message.message
                        });

                        return updatedNotifications;
                    });
                }
                setLatestMessages((prevLatestMessages) => ({
                    ...prevLatestMessages,
                    [message.chatId]: message,
                }));
            };

            socket.on("receiveMessage", handleReceiveMessage);

            return () => {
                socket.off("receiveMessage", handleReceiveMessage);
            };
        }
    }, [socket, selectedChatId]);

    return (
        <div className={`${styles.container} ${styles['message-section']}`}>
            <Row gutter={[20, 20]}>
                <ListChat
                    listChat={listChat}
                    selectedChatId={selectedChatId}
                    handleChatClick={handleChatClick}
                    onlineUsers={onlineUsers}
                    notifications={notifications}
                    latestMessages={latestMessages}
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
