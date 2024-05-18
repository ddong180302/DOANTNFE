// import { useAppSelector } from "@/redux/hooks";
// import { IChat } from "@/types/backend";
// import { MessageOutlined } from "@ant-design/icons";
// import { Avatar, Col, List } from "antd";
// import styles from 'styles/client.module.scss';

// interface ListChatProps {
//     listChat: IChat[] | null;
//     selectedChatId: string | null;
//     handleChatClick: (id: string, name: string) => void;
//     onlineUsers: any[];
//     notifications: { [key: string]: number };
// }

// const ListChat = (props: ListChatProps) => {
//     const { selectedChatId, listChat, handleChatClick, onlineUsers, notifications } = props;
//     const user = useAppSelector(state => state.account.user);
//     const userRole = user?.role?.name;
//     const flatListChat = listChat ? listChat.flatMap(chat => chat) : [];

//     console.log("check nofi: ", notifications)
//     return (
//         <>
//             <Col span={24} md={8} className={styles.listchat}>
//                 {userRole === "HR" ? (
//                     <List
//                         dataSource={flatListChat}
//                         renderItem={(item) => (
//                             <List.Item
//                                 onClick={() => handleChatClick(item._id || "", item.firstName || "")}
//                                 className={`${styles.item} ${item._id === selectedChatId ? styles['selected-item'] : ''}`}
//                             >
//                                 <List.Item.Meta
//                                     avatar={<Avatar icon={<MessageOutlined />} />}
//                                     title={<a href="#">{item.firstName}</a>}
//                                 />
//                                 {
//                                     onlineUsers.includes(item.firstId) &&
//                                     <span className={styles.onlineDot} style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'blue' }}></span>
//                                 }
//                             </List.Item>
//                         )}
//                     />
//                 ) : (
//                     <List
//                         dataSource={flatListChat}
//                         renderItem={(item) => (
//                             <List.Item
//                                 onClick={() => handleChatClick(item._id || "", item.secondName || "")}
//                                 className={`${styles.item} ${item._id === selectedChatId ? styles['selected-item'] : ''}`}
//                             >
//                                 <List.Item.Meta
//                                     avatar={<Avatar icon={<MessageOutlined />} />}
//                                     title={<a href="#">{item.secondName}</a>}
//                                 />
//                                 {/* Tạo phần tử suffix tùy chỉnh */}
//                                 {
//                                     onlineUsers.includes(item.secondId) &&
//                                     <span className={styles.onlineDot} style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'blue' }}></span>
//                                 }
//                             </List.Item>
//                         )}
//                     />
//                 )}
//             </Col>
//         </>
//     );
// };

// export default ListChat;

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
}

const ListChat = (props: ListChatProps) => {
    const { selectedChatId, listChat, handleChatClick, onlineUsers, notifications } = props;
    const user = useAppSelector(state => state.account.user);
    const userRole = user?.role?.name;
    const flatListChat = listChat ? listChat.flatMap(chat => chat) : [];

    console.log("check nofi: ", notifications);
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

                    return (
                        <List.Item
                            onClick={() => handleChatClick(id || "", name || "")}
                            className={`${styles.item} ${isSelected ? styles['selected-item'] : ''}`}
                        >
                            <List.Item.Meta
                                avatar={<Avatar icon={<MessageOutlined />} />}
                                title={<a href="#">{name}</a>}
                            />
                            {isOnline && (
                                <span className={styles.onlineDot} style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'blue' }}></span>
                            )}
                            {notificationCount > 0 && (
                                <Badge count={notificationCount} overflowCount={99} className={styles.notificationBadge} />
                            )}
                        </List.Item>
                    );
                }}
            />
        </Col>
    );
};

export default ListChat;
