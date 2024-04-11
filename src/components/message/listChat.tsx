import { useAppSelector } from "@/redux/hooks";
import { IChat } from "@/types/backend";
import { MessageOutlined } from "@ant-design/icons";
import { Avatar, Col, List } from "antd";
import styles from 'styles/client.module.scss';

interface ListChatProps {
    listChat: IChat[] | null;
    selectedChatId: string | null;
    handleChatClick: (id: string, name: string) => void;
    onlineUsers: any[];
}

const ListChat = (props: ListChatProps) => {
    const { selectedChatId, listChat, handleChatClick, onlineUsers } = props;
    const user = useAppSelector(state => state.account.user);
    const userRole = user?.role?.name;
    const flatListChat = listChat ? listChat.flatMap(chat => chat) : [];

    return (
        <>
            <Col span={24} md={8} className={styles.listchat}>
                {userRole === "HR" ? (
                    <List
                        dataSource={flatListChat}
                        renderItem={(item) => (
                            <List.Item
                                onClick={() => handleChatClick(item._id || "", item.firstName || "")}
                                className={`${styles.item} ${item._id === selectedChatId ? styles['selected-item'] : ''}`}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar icon={<MessageOutlined />} />}
                                    title={<a href="#">{item.firstName}</a>}
                                />
                                {
                                    onlineUsers.includes(item.firstId) &&
                                    <span className={styles.onlineDot} style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'blue' }}></span>
                                }
                            </List.Item>
                        )}
                    />
                ) : (
                    <List
                        dataSource={flatListChat}
                        renderItem={(item) => (
                            <List.Item
                                onClick={() => handleChatClick(item._id || "", item.secondName || "")}
                                className={`${styles.item} ${item._id === selectedChatId ? styles['selected-item'] : ''}`}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar icon={<MessageOutlined />} />}
                                    title={<a href="#">{item.secondName}</a>}
                                />
                                {/* Tạo phần tử suffix tùy chỉnh */}
                                {
                                    onlineUsers.includes(item.secondId) &&
                                    <span className={styles.onlineDot} style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'blue' }}></span>
                                }
                            </List.Item>
                        )}
                    />
                )}
            </Col>
        </>
    );
};

export default ListChat;