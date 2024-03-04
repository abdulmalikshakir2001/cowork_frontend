import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Messenger.css";
import Layout from "../../Component/Layout/Layout";
import avatar from "../../Assets/Images/icon/Avatar.png";
import emoji from "../../Assets/Images/icon/face-smile.png";
import fileShare from "../../Assets/Images/icon/link-01.png";
import plusBtn from "../../Assets/Images/icon/Button.png";
import onlineShow from "../../Assets/Images/icon/online.png";
import messageFile from "../../Assets/Images/icon/Mask Group.png";
import more from "../../Assets/Images/icon/more.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { useAppSelector, useAppDispatch } from "../../lib/hooks";

import {
  selectAuthUser,
  setAuthUser,
} from "../../lib/features/authUser/authUserSlice";
import { IUserState } from "../../lib/features/authUser/authUserSlice";
import { getAuthenticUser } from "../../api/auth";
import { post } from "../../api/base-api";
import { useSocket } from "../../providers/Socket";
import { MdGroup } from "react-icons/md";
import { IconContext } from "react-icons";
import Group from "../Groups/Group";
import defaultChatImg from "../../Assets/Images/chat/default_chat_page.png";
import { Dropdown } from "react-bootstrap";
import { RiDeleteBin6Line } from "react-icons/ri";
import { json } from "react-router-dom";
import moment from "moment";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface IChatMessage {
  id: number;
  email: string;
  message: string;
  created_at: string;
}

const Messenger = () => {
  const singleChatDivRef = useRef<HTMLDivElement>(null);
  const currentUser = useAppSelector(selectAuthUser); // this object contain email,role,name -->focus
  const [selectedUser, setSelectedUser] = useState<IUserState>(); // this object contain email,role,name -->focus
  const [distUserEmail, setDistUserEmail] = useState<string | null>(null);
  const socketContext = useSocket();
  const socket = socketContext ? socketContext.socket : null;

  const dispatch = useAppDispatch();
  const [load, setLoad] = useState(false);
  const [selectedUserName, setSelectedUserName] = useState<string | null>();
  const [selectedUserRole, setSelectedUserRole] = useState<string | null>();
  const [messages, setMessages] = useState<string[]>([]);
  const [chatMessage, setChatMessage] = useState<string[]>([]);
  const [bothChatMessages, setBothChatMessages] = useState<IChatMessage[]>([]);
  const [userOnline, setUserOnline] = useState<string | null>(null);
  const [input, setInput] = useState<string>(""); // current user message -->focus
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [currentUserMessages, setCurrentUserMessages] = useState<string[] | []>(
    []
  );
  const [distUserMessages, setDistUserMessages] = useState<string[] | []>([]);
  const [contacts, setContacts] = useState<IUserState[]>();
  const [usersWithLastChat, setUsersWithLastChat] = useState<IUserState[]>();
  const [showChats, setShowChats] = useState(false);

  // group start
  const [showGroupName, setShowGroupName] = useState(false);
  const [changeGroupName, setChangeGroupName] = useState<string | undefined>(
    undefined
  );
  const [showGroupSaveButton, setShowGroupSaveButton] = useState(true);
  const [showGroups, setShowGroups] = useState(false);
  const [showDefaultChatPage, setShowDefaultChatPage] = useState(true);
  const [chatDeleted, setChatDeleted] = useState(false);

  const [showDeleteIcon, setShowDeleteIcon] = useState(true);
  const [selectedUserOnlineStatus, setSelectedUserOnlineStatus] =
    useState(false);
  const [lastInsertedGroupId, setLastInsertedGroupId] = useState<
    number | string | null
  >(null);
  const [allGroups, setAllGroups] = useState<any>(null);
  const [groupId, setGroupId] = useState<any>(null);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [checkSelectedGroup, setCheckSelectedGroup] = useState<null | boolean>(
    null
  );

  const handleShowGroupNameChange = () => {
    setChangeGroupName("");
    setShowGroupSaveButton(true);
    setShowGroupName(true);
  };
  const handleSaveGroupName = () => {
    post("/saveGroup", {
      name: changeGroupName,
      created_by: currentUser.email,
    }).then((data) => {
      setShowGroupSaveButton(false);
      console.log(data);
      if (data.statusCode === 201) {
        setLastInsertedGroupId(data.lastInsertedGroupId);

        setGroupId(data.lastInsertedGroupId);

        setShowGroups(true);
        setShowChats(false);
        handleSelectedGroup({ group_id: data.lastInsertedGroupId });
      }
    });
  };
  // group end
  useEffect(() => {
    scrollToBottom();
  }, [messages, input]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const handleSelectUser = (selectedUser: IUserState) => {
    setShowGroups(false);

    setShowDefaultChatPage(false);
    setSelectedUser(selectedUser);
    setSelectedUserName(selectedUser.name);
    setSelectedUserRole(selectedUser.role);
    setCheckSelectedGroup(true);

    if (selectedUser.online_status === 0) {
      setSelectedUserOnlineStatus(false);
    } else if (selectedUser.online_status === 1) {
      setSelectedUserOnlineStatus(true);
    }
    setShowChats(true);

    // current

    post("/getAllChats", {
      sender: currentUser.email,
      reciever: selectedUser.email,
    }).then((data) => {
      setBothChatMessages(data);
    });
  };
  const handleToSender = useCallback((data: any) => {
    // current

    setBothChatMessages((bothChatMessage) => [...bothChatMessage, data]);
    setLoad(true)
    // After content is loaded

    // socket?.emit('recieverMessage',{email:selectedUser?.email,message:data.message})
  }, []);
  const handleToDist = useCallback((data: any) => {
    setLoad(true)
    setDistUserEmail(data.email);
    setBothChatMessages((bothChatMessage) => [...bothChatMessage, data]);
  }, []);
  const handleOnline = useCallback(
    (data: any) => {
      socket?.emit("changeOnlineStatus", { email: data.onelineUserEmail });
    },
    [socket]
  );
  const handleUserOnline = useCallback((data: any) => {
    setUserOnline("online");
  }, []);
  const handleUserOffline = useCallback((data: any) => {
    setUserOnline("offline");
    setSelectedUserOnlineStatus(false);
  }, []);

  const messageStart = () => {
    if (input.trim() !== "") {
      setChatMessage((prevMessages) => [...prevMessages, input]);
      setInput("");
    }

    socket?.emit("senderMessage", {
      sender: currentUser.email,
      reciever: selectedUser?.email,
      message: input,
      id: currentUser.id,
    });
  };

  const handleSelectedGroup = (group: any) => {
    setCheckSelectedGroup(null);
    setSelectedGroup(group);
    setGroupId(group.group_id);

    setShowGroups(true);
    setShowDefaultChatPage(false);
    setShowChats(false);
  };

  const handleChatDeleted = (data: any) => {
    post("/getAllChats", {
      sender: data.currentUserEmail,
      reciever: data.email,
    }).then((data) => {
      setBothChatMessages(data);
    });
  };

  useEffect(() => {
    socket?.emit("userLogin", currentUser);
  }, [currentUser, socket]);

  useEffect(() => {
    socket?.on("toSender", handleToSender);
    socket?.on("toReciever", handleToDist);
    socket?.on("online", handleOnline);
    socket?.on("userOnline", handleUserOnline);
    socket?.on("userOffline", handleUserOffline);
    socket?.on("chatDeleted", handleChatDeleted);

    return () => {
      socket?.off("toSender", handleToSender);
      socket?.off("toReciever", handleToDist);
      socket?.off("online", handleOnline);
      socket?.off("userOnline", handleUserOnline);
      socket?.off("userOffline", handleUserOffline);
      socket?.off("chatDeleted", handleChatDeleted);
    };
  }, [
    handleOnline,
    handleToDist,
    handleToSender,
    handleUserOffline,
    handleUserOnline,
    socket,
    userOnline,
  ]);

  useEffect(() => {
    dispatch(setAuthUser(getAuthenticUser()));
  }, [dispatch]);

  useEffect(() => {
    currentUser.email &&
      post("/allUsers", { currentUserEmail: currentUser.email }).then(
        (data) => {
          setContacts(data);
        }
      );
    post("/lastChatWithUser", { currentUserEmail: currentUser.email }).then(
      (data) => {
        setUsersWithLastChat(data);
      }
    );
  }, [currentUser, userOnline,load]);

  useEffect(() => {
    currentUser.email &&
      post("/allGroups", { currentUserEmail: currentUser.email }).then(
        (data) => {
          setAllGroups(data);
        }
      );
  }, [currentUser.email]);

  useEffect(() => {
    post("/saveGroupMember", {
      email: currentUser.email,
      group_id: lastInsertedGroupId,
    }).then((data) => {
      if (data.statusCode === 201) {
        // socket?.emit('joinRoom',{email:currentUser.email,groupId:data.group_id})
        currentUser.email &&
          post("/allGroups", { currentUserEmail: currentUser.email }).then(
            (data) => {
              setAllGroups(data);
            }
          );
      }
    });
  }, [currentUser.email, lastInsertedGroupId, socket]);

  interface DeleteIcons {
    [key: number]: boolean;
  }
  const [deleteIcons, setDeleteIcons] = useState<DeleteIcons>({});

  const handleMouseEnter = (index: any) => {
    setDeleteIcons({ ...deleteIcons, [index]: true });
  };

  const handleMouseLeave = (index: any) => {
    setDeleteIcons({ ...deleteIcons, [index]: false });
  };
  const handleDeleteMessage = (id: any) => {
    socket?.emit("deleteSingleChat", {
      id,
      email: selectedUser?.email,
      currentUserEmail: currentUser.email,
    });
  };

  useEffect(() => {
    singleChatDivRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [bothChatMessages]);

  useEffect(() => {
    console.log(selectedGroup);
  }, [selectedGroup]);
  // emoji picker
  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiSelect = (emoji: any) => {
    console.log(emoji);
    setInput(input + emoji.native);
  };

  useEffect(()=>{
    setLoad(false)

  },[usersWithLastChat])

  return (
    <Layout>
      <div className="mainContent">
        <div className="chat">
          {/* current */}
          <div className="contacts custom_scroll">
            <div className="all-messages-parent">
              <div className="all-messages">All Messages</div>
              <div
                className="button showGroupNameButton"
                onClick={handleShowGroupNameChange}
              >
                {/* <img className="info-circle-icon" alt="" src={plusBtn} /> */}
                <FontAwesomeIcon icon={faPlus} />
              </div>
            </div>
            <div className="contacts-child" />
            {/* group */}

            {showGroupName && (
              <div className="group-name-wrapper">
                <div
                  className="group-name-parent"
                  style={{
                    backgroundColor: "#F8FAFB",
                  }}
                >
                  {showGroupSaveButton && (
                    <span
                      className="badge position_absolute"
                      style={{ cursor: "pointer" }}
                      onClick={handleSaveGroupName}
                    >
                      save
                    </span>
                  )}
                  <div className="center-group-badge">
                    <div className="group-name-icon-parent">
                      <IconContext.Provider
                        value={{
                          color: "black",
                          className: "global-class-name",
                          size: "2em",
                        }}
                      >
                        <div>
                          <MdGroup />
                        </div>
                      </IconContext.Provider>

                      <div className="text">
                        <div style={{ color: "black" }}>
                          <input
                            type="text"
                            value={changeGroupName}
                            className="changeGroupName"
                            placeholder="Edit group Name"
                            onChange={(e) => setChangeGroupName(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {allGroups &&
              allGroups.map((group: any) => {
                return (
                  <div
                    className="contact1"
                    style={{
                      margin: "auto",

                      backgroundColor:
                        checkSelectedGroup !== null
                          ? ""
                          : selectedGroup === group
                          ? "#6366F1"
                          : "white",
                    }}
                    onClick={() => handleSelectedGroup(group)}
                    key={group.id}
                  >
                    <div className="avatar-parent all_group_avatar_parent">
                      <IconContext.Provider
                        value={{
                          color: "black",
                          className: "global-class-name",
                          size: "2em",
                        }}
                      >
                        <div>
                          <MdGroup />
                        </div>
                      </IconContext.Provider>

                      <div className="text">
                        <div
                          className={
                            selectedGroup === group ? "" : "bogdan-krivenchenko"
                          }
                          style={
                            selectedGroup === group ? { color: "white" } : {}
                          }
                        >
                          {group.group_name}
                        </div>
                        <div className="hi-how-are">
                          Hi! this is {group.group_name}
                        </div>
                      </div>
                    </div>
                    <div className="parent">
                      <div className="div16">10:30 AM</div>
                      <div className="ellipse" />
                    </div>
                  </div>
                );
              })}

            {/* group */}

            <div className="contact">
              {usersWithLastChat &&
                usersWithLastChat.map((contact) => {
                  return (
                    <div
                      className="contact1"
                      onClick={() => handleSelectUser(contact)}
                      key={contact.id}
                      style={{
                        backgroundColor:
                          checkSelectedGroup === null
                            ? ""
                            : selectedUser === contact
                            ? "#6366F1"
                            : "white",
                      }}
                    >
                      <div className="avatar-parent">
                        <div className="avatar">
                          <img className="avatar-icon1" alt="" src={avatar} />
                          <div className="avatar-online-indicator">
                            <img
                              alt=""
                              src={
                                contact.online_status === 1
                                  ? onlineShow
                                  : "offline"
                              }
                            />
                          </div>
                        </div>

                        <div className="text">
                          <div
                            className={
                              selectedUser === contact
                                ? ""
                                : "bogdan-krivenchenko"
                            }
                            style={
                              selectedUser === contact ? { color: "white" } : {}
                            }
                          >
                            {contact.name}
                          </div>
                          <div className="hi-how-are" id="hi-how-are">
                            {contact.message}
                          </div>
                        </div>
                      </div>
                      <div className="parent">
                        <div className="div16">
                          {moment(contact.last_message_date).format("h:mm a")}
                        </div>
                        <div className="ellipse" />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* default  */}
          {showDefaultChatPage && (
            <div className="chat1">
              <div className="user-header">
                <div className="user-parent">
                  <div className="user">
                    {/* custom dropdown */}

                    <Dropdown>
                      <Dropdown.Toggle id="user_drop_down">To</Dropdown.Toggle>
                      <Dropdown.Menu
                        id="user_drop_down_menu"
                        className="custom_scroll"
                      >
                        {contacts &&
                          contacts.map((contact) => {
                            return (
                              <Dropdown.Item href="#" key={contact.id}>
                                <div
                                  className="avatar-parent"
                                  onClick={() => handleSelectUser(contact)}
                                >
                                  <div className="avatar">
                                    <img
                                      className="avatar-icon1"
                                      alt=""
                                      src={avatar}
                                    />
                                    <div className="avatar-online-indicator">
                                      <img alt="" src="" />
                                    </div>
                                  </div>

                                  <div className="text">
                                    <div>{contact.name}</div>
                                  </div>
                                </div>
                              </Dropdown.Item>
                            );
                          })}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <img className="more-icon" alt="" src={more} />
                </div>
              </div>

              <div className="chat2 custom_scroll" ref={chatContainerRef}>
                <div className="friday-january-26th-parent">
                  <img
                    src={defaultChatImg}
                    alt="default chat image"
                    className="default_chat_img"
                  />
                </div>
              </div>
              <div className="avatar-parent7">
                <img className="avatar-icon" alt="" src={avatar} />
                <div className="input-field">
                  <div className="input-with-label">
                    <div className="label1">Email Address</div>
                    <div className="input">
                      <img
                        className="search-md-icon"
                        alt=""
                        src="/searchmd.svg"
                      />
                      <div className="content3">
                        <textarea
                          className="text9 form-control"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Send a message..."
                        />
                      </div>
                      <FontAwesomeIcon
                        className="info-circle-icon"
                        onClick={messageStart}
                        icon={faPaperPlane}
                      />
                      <span>
                        {showPicker && (
                          <Picker
                            data={data}
                            onEmojiSelect={handleEmojiSelect}
                          />
                        )}
                        <img
                        className="info-circle-icon"
                        alt=""
                        src={emoji}
                        onClick={() => setShowPicker(!showPicker)}
                      />
                      </span>
                      <img
                        className="info-circle-icon"
                        alt=""
                        src={fileShare}
                      />
                    </div>
                  </div>
                  <div className="hint-text">
                    This is a hint text to help user.
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* default  */}
          {showGroups && (
            <Group
              lastInsertedGroupId={lastInsertedGroupId}
              groupId={groupId && groupId}
            />
          )}
          {selectedUser && showChats && (
            <div className="chat1">
              <div className="user-header">
                <div className="user-parent">
                  <div className="user">
                    <div className="avatar-parent6">
                      <div className="avatar1">
                        <img className="avatar-icon1" alt="" src={avatar} />

                        {selectedUserOnlineStatus && (
                          <div className="avatar-online-indicator">
                            <img alt="" src={onlineShow} />
                          </div>
                        )}
                      </div>
                      <div className="dropdown">
                        <div className="sarah-kline">{selectedUserName}</div>
                        <div className="member">{selectedUserRole}</div>
                      </div>
                    </div>
                  </div>
                  <img className="more-icon" alt="" src={more} />
                </div>
              </div>

              <div className="chat2 custom_scroll">
                <div className="friday-january-26th-parent">
                  <div className="friday-january-26th">
                    Friday, January 26th
                  </div>

                  {bothChatMessages.map((data) => {
                    if (data.email === selectedUser.email) {
                      return (
                        <div className="div24 single_dist_chat" key={data.id}>
                          <div className="message">
                            <div className="avatar1">
                              <img
                                className="avatar-icon1"
                                alt=""
                                src={avatar}
                              />
                              <div className="avatar-online-indicator">
                                <img alt="" src={onlineShow} />
                              </div>
                            </div>
                            <div className="message1">
                              <div className="hihow-are-things-with-our-ill-wrapper ">
                                <div className="hihow-are-things">
                                  {data.message}
                                </div>
                              </div>
                              <div className="wrapper3">
                                <div className="div16">
                                  {moment(data.created_at).format("h:mm a")}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div className="message7">
                          <div className="message8">
                            <div
                              className="hi-im-working-on-the-final-sc-wrapper for_delete"
                              onMouseEnter={() => handleMouseEnter(data.id)}
                              onMouseLeave={() => handleMouseLeave(data.id)}
                            >
                              {deleteIcons[data.id] && (
                                <div className="delete_button">
                                  <RiDeleteBin6Line
                                    className="delete-icon"
                                    onClick={() => handleDeleteMessage(data.id)}
                                  />
                                </div>
                              )}

                              <div className="hihow-are-things">
                                {data.message}
                              </div>
                            </div>
                            <div className="wrapper6">
                              <div className="div16">
                                {moment(data.created_at).format("h:mm a")}
                              </div>
                            </div>
                          </div>
                          <img className="avatar-icon1" alt="" src={avatar} />
                        </div>
                      );
                    }
                  })}
                </div>

                <div ref={singleChatDivRef}></div>
              </div>
              <div className="avatar-parent7">
                <img className="avatar-icon" alt="" src={avatar} />
                <div className="input-field">
                  <div className="input-with-label">
                    <div className="label1">Email Address</div>
                    <div className="input">
                      <img
                        className="search-md-icon"
                        alt=""
                        src="/searchmd.svg"
                      />
                      <div className="content3">
                        <textarea
                          className="text9 form-control"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Send a message..."
                        />
                      </div>
                      <FontAwesomeIcon
                        className="info-circle-icon"
                        onClick={messageStart}
                        icon={faPaperPlane}
                      />
                      <span className="emoji_parent">
                        {showPicker && (
                          <span className="picker_parent">
                          <Picker
                            data={data}
                            onEmojiSelect={handleEmojiSelect}
                          />
                          </span>
                        )}
                        <img
                        className="info-circle-icon"
                        alt=""
                        src={emoji}
                        onClick={() => setShowPicker(!showPicker)}
                      />
                      </span>
                      
                      <img
                        className="info-circle-icon"
                        alt=""
                        src={fileShare}
                      />
                    </div>
                  </div>
                  <div className="hint-text">
                    This is a hint text to help user.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Messenger;
