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

interface IChatMessage {
  email: string;
  message: string;
}

const Messenger = () => {
  const currentUser = useAppSelector(selectAuthUser); // this object contain email,role,name -->focus
  const [selectedUser, setSelectedUser] = useState<IUserState>(); // this object contain email,role,name -->focus
  const [distUserEmail, setDistUserEmail] = useState<string | null>(null);
  const socketContext = useSocket();
  const socket = socketContext ? socketContext.socket : null;

  const dispatch = useAppDispatch();
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
  const [showChats, setShowChats] = useState(false);
  
  // group start
  const [showGroupName,setShowGroupName] = useState(false)
  const [changeGroupName, setChangeGroupName] =useState<string|undefined>(undefined);
  const [showGroupSaveButton,setShowGroupSaveButton] = useState(true)
  const [showGroups,setShowGroups] = useState(false);
  const[lastInsertedGroupId,setLastInsertedGroupId] = useState<number|string|null>(null)
  const [allGroups,setAllGroups] = useState<any>(null);
  const [groupId,setGroupId] = useState<any>(null);
    const  handleShowGroupNameChange = ()=>{
      setChangeGroupName("")
      setShowGroupSaveButton(true)
      setShowGroupName(true)
    }
    const  handleSaveGroupName = ()=>{
      post('/saveGroup',{name:changeGroupName,created_by:currentUser.email}).then((data)=>{
        setShowGroupSaveButton(false)
        
        console.log(data)
        if(data.statusCode === 201){
          setLastInsertedGroupId(data.lastInsertedGroupId)
          setShowGroups(true)
          setShowChats(false)
          
        }
      })
    }

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
    setShowGroups(false)
    
    setSelectedUser(selectedUser);
    

    setSelectedUserName(selectedUser.name);
    setSelectedUserRole(selectedUser.role);
    setShowChats(true)
    
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
    // socket?.emit('recieverMessage',{email:selectedUser?.email,message:data.message})
  }, []);
  const handleToDist = useCallback((data: any) => {
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
  }, []);

  const messageStart = () => {
    if (input.trim() !== "") {
      setChatMessage((prevMessages) => [...prevMessages, input]);
      setInput("");
    }

    post("/saveChat", {
      sender: currentUser.email,
      reciever: selectedUser?.email,
      message: input,
    }).then((data) => {
      console.log(data);
    });
    socket?.emit("senderMessage", {
      sender: currentUser.email,
      reciever: selectedUser?.email,
      message: input,
    });
  };

  const handleSelectedGroup = (group:any)=>{
    setGroupId(group.group_id) 
    
    setShowGroups(true)
    setShowChats(false)
    

  }
  useEffect(() => {
    socket?.emit("userLogin", currentUser);
  }, [currentUser, socket]);

  useEffect(() => {
    socket?.on("toSender", handleToSender);
    socket?.on("toReciever", handleToDist);
    socket?.on("online", handleOnline);
    socket?.on("userOnline", handleUserOnline);
    socket?.on("userOffline", handleUserOffline);

    return () => {
      socket?.off("toSender", handleToSender);
      socket?.off("toReciever", handleToDist);
      socket?.off("online", handleOnline);
      socket?.off("userOnline", handleUserOnline);
      socket?.off("userOffline", handleUserOffline);
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
  }, [currentUser, userOnline]);

  useEffect(()=>{
    currentUser.email &&
      post("/allGroups", { currentUserEmail: currentUser.email }).then(
        (data) => {
          setAllGroups(data)
          
        }
      );

  },[currentUser.email])
  

  useEffect(()=>{
    post('/saveGroupMember',{email:currentUser.email,group_id:lastInsertedGroupId}).then((data)=>{
      if(data.statusCode===201){
        // socket?.emit('joinRoom',{email:currentUser.email,groupId:data.group_id})
        currentUser.email &&
      post("/allGroups", { currentUserEmail: currentUser.email }).then(
        (data) => {
          setAllGroups(data)
          
        }
      );
        handleSelectedGroup({group_id:data.group_id})
      }
    })
  },[currentUser.email, lastInsertedGroupId, socket])
  
  return (
  
    <Layout>
      <div className="mainContent">
        <div className="chat">
          {/* current */}
          <div className="contacts">
            <div className="all-messages-parent">
              <div className="all-messages">All Messages</div>
              <div className="button showGroupNameButton" onClick={handleShowGroupNameChange}>
                {/* <img className="info-circle-icon" alt="" src={plusBtn} /> */}
                <FontAwesomeIcon icon={faPlus} />
              </div>
            </div>
            <div className="contacts-child" />
            {/* group */}

            {showGroupName &&  <div className="group-name-wrapper">
            <div
              className="group-name-parent"
              style={{
                backgroundColor: "#F8FAFB",
              }}
            >
              { showGroupSaveButton && <span className="badge position_absolute"  style={{cursor:"pointer"}} onClick={handleSaveGroupName} >save</span> }
              <div className="center-group-badge" >
              
              <div className="group-name-icon-parent">

                
                  <IconContext.Provider
                    value={{ color: "black", className: "global-class-name",size:"2em"}}
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
}
            {/* all group */}


          { allGroups &&   allGroups.map((group:any)=>{
            return (
              <div
              className="contact1"
              style={{margin:"auto"}}
              onClick={ () => handleSelectedGroup(group)}
              
              key={group.email}
              // style={{
              //   backgroundColor:
              //     selectedUser === contact ? "#6366F1" : "white",
              // }}
            >
              <div className="avatar-parent">
                
                <IconContext.Provider
                    value={{ color: "black", className: "global-class-name",size:"2em"}}
                  >
                    <div>
                      <MdGroup />
                    </div>
                  </IconContext.Provider>
                  
                  
                

                <div className="text">
                  <div
                    // className={
                    //   selectedUser === contact
                    //     ? ""
                    //     : "bogdan-krivenchenko"
                    // }
                    // style={
                    //   selectedUser === contact ? { color: "white" } : {}
                    // }
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

              



            )
          }) 
}
            {/* all group */}

            {/* group */}
            <div className="contact">
              {contacts &&
                contacts.map((contact) => {
                  return (
                    <div
                      className="contact1"
                      onClick={() => handleSelectUser(contact)}
                      key={contact.email}
                      style={{
                        backgroundColor:
                          selectedUser === contact ? "#6366F1" : "white",
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
                          <div className="hi-how-are">
                            Hi! this is {contact.name}
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
            </div>
          </div>
          {
            showGroups && <Group lastInsertedGroupId={lastInsertedGroupId}  groupId={groupId && groupId}/>
          }
           { selectedUser && showChats && (
            <div className="chat1">
              <div className="user-header">
                <div className="user-parent">
                  <div className="user">
                    <div className="avatar-parent6">
                      <div className="avatar1">
                        <img className="avatar-icon1" alt="" src={avatar} />
                        <div className="avatar-online-indicator">
                          <img alt="" src={onlineShow} />
                        </div>
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

              <div className="chat2" ref={chatContainerRef}>
                <div className="friday-january-26th-parent">
                  <div className="friday-january-26th">
                    Friday, January 26th
                  </div>

                  {bothChatMessages.map((data) => {
                    if (data.email === selectedUser.email) {
                      return (
                        <div className="div24">
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
                              <div className="hihow-are-things-with-our-ill-wrapper">
                                <div className="hihow-are-things">
                                  {data.message}
                                </div>
                              </div>
                              <div className="wrapper3">
                                <div className="div16">8:30 AM</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div className="message7">
                          <div className="message8">
                            <div className="hi-im-working-on-the-final-sc-wrapper">
                              <div className="hihow-are-things">
                                {data.message}
                              </div>
                            </div>
                            <div className="wrapper6">
                              <div className="div16">10:25 AM</div>
                            </div>
                          </div>
                          <img className="avatar-icon1" alt="" src={avatar} />
                        </div>
                      );
                    }
                  })}
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
                        <img className="info-circle-icon" alt="" src={emoji} />
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
            </div>
          )}
          

          


          

                


        </div>
      </div>
    </Layout>
  );
};

export default Messenger;
