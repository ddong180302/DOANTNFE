import { useAppSelector } from "@/redux/hooks";
import { IChat } from "@/types/backend";
import { MessageOutlined } from "@ant-design/icons";
import { Avatar, Badge, Col, List } from "antd";
import styles from 'styles/client.module.scss';

interface ListChatProps {
    listChat: IChat[] | null;
    selectedChatId: string | null;
    handleChatClick: (id: string, name: string) => void;
    onlineUsers: any[];
    notifications: { [key: string]: number };
    latestMessages: { [key: string]: { id: string; sender: string; message: string; updatedAt: string; chatId: string } }; // Thêm prop này
}

const ListChat = (props: ListChatProps) => {
    const { selectedChatId, listChat, handleChatClick, onlineUsers, notifications, latestMessages } = props;
    const user = useAppSelector(state => state.account.user);
    const userRole = user?.role?.name;
    const flatListChat = listChat ? listChat.flatMap(chat => chat) : [];

    return (
        <Col span={24} md={8} className={styles.listchat}>
            <List
                dataSource={flatListChat}
                renderItem={(item) => {
                    const name = userRole === "HR" ? item.firstName : item.secondName;
                    const id = item._id || "";
                    const isSelected = id === selectedChatId;
                    const isOnline = onlineUsers.includes(userRole === "HR" ? item.firstId : item.secondId);
                    const notificationCount = notifications[id] || 0;
                    const latestMessage = latestMessages[id];

                    return (
                        <List.Item
                            onClick={() => handleChatClick(id || "", name || "")}
                            className={`${styles.item} ${isSelected ? styles['selected-item'] : ''}`}
                        >
                            <List.Item.Meta
                                avatar={<Avatar icon={<MessageOutlined />} />}
                                title={<a href="#">{name}</a>}
                                description={
                                    latestMessage
                                        ? latestMessage.sender === user?._id
                                            ? `Bạn: ${latestMessage.message}`
                                            : `${latestMessage.message}`
                                        : "No messages yet"
                                }
                                style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}
                            />
                            <div>
                                <div>
                                    {isOnline && (
                                        <span className={styles.onlineDot} style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'blue', marginRight: '5px' }}></span>
                                    )}
                                </div>
                                <div>
                                    {notificationCount > 0 && (
                                        <Badge count={notificationCount} overflowCount={99} className={styles.notificationBadge} style={{ marginRight: '5px' }} />
                                    )}
                                </div>
                            </div>
                        </List.Item>
                    );
                }}
            />
        </Col>
    );
};

export default ListChat;
