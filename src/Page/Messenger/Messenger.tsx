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
import { json, useFetcher } from "react-router-dom";
import moment from "moment";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { MdCancel } from "react-icons/md";
import { DOCOTEAM_API } from "../../config";
import AgoTime from "../../Component/AgoTime";
import { MdGroupAdd } from "react-icons/md";
import UploadChatFile from "../../Component/UploadFile/UploadChatFile";
import { MdOutlineFilterList } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa6";





interface IChatMessage {
  id: number;
  email: string;
  message: string;
  is_image: string | number | boolean;
  created_at: string;
}

const Messenger = () => {
  
  
  
  const singleChatDivRef = useRef<HTMLDivElement>(null);
  const afterPreviewImgRef = useRef<HTMLDivElement>(null);
  const currentUser = useAppSelector(selectAuthUser); // this object contain email,role,name -->focus
  const [selectedUser, setSelectedUser] = useState<any>(null); // this object contain email,role,name -->focus
  const [distUserEmail, setDistUserEmail] = useState<string | null>(null);
  const socketContext = useSocket();
  const socket = socketContext ? socketContext.socket : null;

  const dispatch = useAppDispatch();
  const [load, setLoad] = useState(false);
  // modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [fileUplaodOnServer, setFileUplaodOnServer] = useState(false);
  const handleUploadClose = () => {
    setShowUploadModal(false);
  };
  const handleUploadClick = () => {
    setShowUploadModal(true);
  };
  // modal
  const [selectedUserName, setSelectedUserName] = useState<string | null>();
  const [selectedUserRole, setSelectedUserRole] = useState<string | null>();
  const [messages, setMessages] = useState<string[]>([]);
  const [chatMessage, setChatMessage] = useState<string[]>([]);
  const [bothChatMessages, setBothChatMessages] = useState<any>({});
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
  const [previewImage, setPreviewImage] = useState<any>(undefined);
  const [groupChatLoad, setGroupChatLoad] = useState<any>(false);
  const [allContacts, setAllContacts] = useState<any[]>([]);

  const handleShowGroupNameChange = () => {
    setChangeGroupName("");
    setShowGroupSaveButton(true);
    setShowGroupName((prevState) => !prevState);
  };
  const handleSaveGroupName = () => {
    post("/saveGroup", {
      name: changeGroupName,
      created_by: currentUser.email,
    }).then((data) => {
      setShowGroupSaveButton(false);
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
    setSelectedGroup(null);
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
  const handleToSender = useCallback(
    (data: any) => {
      handleUploadClose();
      setFileUplaodOnServer(true);
      cancelPreview();

      setLoad(true);
      post("/getAllChats", {
        sender: currentUser.email,
        reciever: selectedUser && selectedUser.email,
      }).then((data) => {
        setBothChatMessages(data);
      });
    },
    [currentUser.email, selectedUser]
  );
  const handleToDist = useCallback(
    (data: any) => {
      cancelPreview();
      setLoad(true);
      setDistUserEmail(data.email);
      post("/getAllChats", {
        sender: currentUser.email,
        reciever: selectedUser && selectedUser.email,
      }).then((data) => {
        setBothChatMessages(data);
      });
      // setBothChatMessages((bothChatMessage) => [...bothChatMessage, data]);
    },
    [currentUser.email, selectedUser]
  );
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
      file: previewImage,

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
    setSelectedUser(null);
  };
  const handleGroupIdToLoadLastMsg = useCallback((groupId: any) => {
    // alert('group click by other browser' + groupId)
    setGroupChatLoad(true);
  }, []);
  const handleUserAdded = useCallback((data: any) => {
    alert("you are added to Group:" + data.lastAddedGroupMember.group_id);
  }, []);
  const handleToRecieversMessageGroup = useCallback((data: any) => {
    setGroupChatLoad(true);
  }, []);
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
    socket?.on("groupIdToLoadLastMsg", handleGroupIdToLoadLastMsg);
    socket?.on("userAdded", handleUserAdded);
    socket?.on("toRecieversMessageGroup", handleToRecieversMessageGroup);

    return () => {
      socket?.off("toSender", handleToSender);
      socket?.off("toReciever", handleToDist);
      socket?.off("online", handleOnline);
      socket?.off("userOnline", handleUserOnline);
      socket?.off("userOffline", handleUserOffline);
      socket?.off("chatDeleted", handleChatDeleted);
      socket?.off("groupIdToLoadLastMsg", handleGroupIdToLoadLastMsg);
      socket?.off("userAdded", handleUserAdded);
      socket?.off("toRecieversMessageGroup", handleToRecieversMessageGroup);
    };
  }, [
    handleGroupIdToLoadLastMsg,
    handleOnline,
    handleToDist,
    handleToRecieversMessageGroup,
    handleToSender,
    handleUserAdded,
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
    post("/allContacts", { currentUserEmail: currentUser.email }).then(
      (data) => {
        setAllContacts(data);
      }
    );
  }, [currentUser, userOnline, load]);

  useEffect(() => {
    currentUser.email &&
      post("/allGroups", { currentUserEmail: currentUser.email }).then(
        (data) => {
          setAllGroups(data);
        }
      );
    post("/allContacts", { currentUserEmail: currentUser.email }).then(
      (data) => {
        setAllContacts(data);
      }
    );
  }, [currentUser.email, groupChatLoad]);

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
        post("/allContacts", { currentUserEmail: currentUser.email }).then(
          (data) => {
            setAllContacts(data);
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
  // handle arrow down 
  interface DownArrowIcons {
    [key: number]: boolean;
  }
  const [downArrowIcons, setDownArrowIcons] = useState<DownArrowIcons>({});
  const handleMouseEnterContact1 = (index: any) => {
    setDownArrowIcons({ ...downArrowIcons, [index]: true });
  };

  const handleMouseLeaveContact1 = (index: any) => {
    setDownArrowIcons({ ...downArrowIcons, [index]: false });
  };

  // handle arrow down 
  



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

  // emoji picker
  const [showPicker, setShowPicker] = useState(false);
  const handleEmojiSelect = (emoji: any) => {
    setInput(input + emoji.native);
  };

  useEffect(() => {
    setLoad(false);
  }, [usersWithLastChat]);
  // file upload=============================================================

  const previewImgFormRef = useRef<any>();

  // Function to handle file input change
  const handleFileInputChange = (event: any) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setPreviewImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const cancelPreview = () => {
    setPreviewImage(undefined);
    const fileInput = document.getElementById(
      "fileInput"
    ) as HTMLInputElement | null;
    if (fileInput) {
      fileInput.value = "";
    }
  };
  useEffect(() => {
    afterPreviewImgRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [previewImage]);

  useEffect(() => {
    setGroupChatLoad(false);
  }, [groupChatLoad]);
  useEffect(() => {
    console.log("=======================");
    console.log(allContacts);
    console.log("=======================");
  }, [allContacts]);

  const [showArrowAngle,setShowArrowAngle] =useState(false)

  // disabled mouse right button click 
  const [dropDownsContact , setDropDownsContact ] = useState<any>({})

  const handleRightClick =  useCallback( (event:any) => {
    event.preventDefault(); // Prevent default right-click behavior
    if(event.button === 2  &&  (event.target.classList.contains('contact1') || event.target.closest('.contact1'))){
      const groupId = event.target.closest('.contact1')?.getAttribute('data-id');
      
      if(dropDownsContact[groupId]){
      setDropDownsContact({...dropDownsContact,[groupId]: false})
      return
      }

      // setDropDownsContact({...dropDownsContact,[groupId]: true})
      const updatedDropDownsContact = Object.fromEntries(
        Object.keys(dropDownsContact).map((key) => [key, false])
      );
      
      // Set the specific key to true
      updatedDropDownsContact[groupId] = true;
      setDropDownsContact(updatedDropDownsContact);

      
    }
    
  },[dropDownsContact]);

  

  useEffect(() => {
    document.addEventListener('contextmenu', handleRightClick);
    return () => document.removeEventListener('contextmenu', handleRightClick);
  }, [handleRightClick]);

  const handleArchiveChat = useCallback( (recieverEmail:any,conactId:any)=>{
    setDropDownsContact({...dropDownsContact,[conactId]:false})

    post('/makeChatArchive',{sender:currentUser.email,reciever:recieverEmail}).then((data)=>{
      // alert(recieverEmail + 'archived successfully')

      post('/allContacts',{currentUserEmail:currentUser.email}).then((data)=>{
        setAllContacts(data)
      })
      
    })
    

  },[currentUser.email, dropDownsContact])

  // disabled mouse right button click 
  const [optionsDropdown,setOptionsDropdown]  = useState(false)

  const handleOptionsDropDown = () =>{

    if(optionsDropdown){
      setOptionsDropdown(false)
      return
    }
    setOptionsDropdown(true)


    

  }
  const getArchivedChats = () =>{
    setOptionsDropdown(false)
    post('/getArchivedChats',{currentUserEmail:currentUser.email}).then((data)=>{
      setAllContacts(data)
    })

    
  }
  const getAllMessages = () =>{
    setOptionsDropdown(false)
    post('/allContacts',{currentUserEmail:currentUser.email}).then((data)=>{
      setAllContacts(data)
    })

    
  }




  
  return (
    <Layout>
      <div className="mainContent">
        <div className="chat">

        

          


          

          

          
          
        
          {/* <button onClick={handleUploadClick}>Upload File</button> */}
          <UploadChatFile
            uploadShow={showUploadModal}
            setUploadShow={setShowUploadModal}
            handleUploadClose={handleUploadClose}
            setPreviewImage={setPreviewImage}
            messageStart={messageStart}
            fileUplaodOnServer={fileUplaodOnServer}
            setFileUplaodOnServer={setFileUplaodOnServer}
          />
          {/* modal */}
          {/* current */}
          <div className="contacts custom_scroll">
            <div className="all-messages-parent">
            
              <div className="all-messages all-messages-custom"> <span className="filter_list" onClick={handleOptionsDropDown} ><MdOutlineFilterList /></span>  <span>All Messages</span> 
              { optionsDropdown && <span className="optionsDropdown"  > <Dropdown.Menu show>
      <Dropdown.Item eventKey="3"  onClick={getAllMessages} >All Messages</Dropdown.Item>
      <Dropdown.Item eventKey="3"  onClick={getArchivedChats} >Archived</Dropdown.Item>
    </Dropdown.Menu>  </span>}
              </div>
              <div className="single_group_chat_icon_parent">
                <div
                  className="button showGroupNameButton group_add_button"
                  onClick={handleShowGroupNameChange}
                  id="group_add_button"
                >
                  {/* <img className="info-circle-icon" alt="" src={plusBtn} /> */}

                  <MdGroupAdd />
                </div>
                <div className="">
                  {/* <img className="info-circle-icon" alt="" src={plusBtn} /> */}

                  <Dropdown>
                    <Dropdown.Toggle id="chat_create_button">
                      {" "}
                      <FontAwesomeIcon icon={faPlus} />{" "}
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                      id=""
                      className="custom_scroll chat_create_dropdown"
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
                                  <div>{contact.name}</div>
                                </div>
                              </div>
                            </Dropdown.Item>
                          );
                        })}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
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

            {/* =================================== */}

            {
                allContacts.map((contact,index)=>{
                  if(contact.group_id !== undefined){
                    
                    return (
                      
                            <div
                            data-id={contact.group_id}
                              className="contact1"
                              style={{
                                marginLeft: "auto",
                                marginRight: "auto",
                                backgroundColor:
                                  checkSelectedGroup !== null
                                    ? ""
                                    : selectedGroup &&
                                      selectedGroup.group_id === contact.group_id
                                    ? "#6366F1"
                                    : "white",
                              }}
                              
                              onClick={(event) =>
                                 {
                                  handleSelectedGroup(contact)
                                  handleRightClick(event)
                                }
                                }
                              key={contact.id}
                              
                              onMouseEnter={() =>
                                handleMouseEnterContact1(contact.id)
                              }
                              onMouseLeave={() =>
                                handleMouseLeaveContact1(contact.id)
                              }
                            >
                              {
                               downArrowIcons[contact.id] &&   <span className="down_arrow">
                                <FaAngleDown />
                              </span>

                              }

                              {
                                dropDownsContact[contact.group_id] &&  
                            <Dropdown.Menu show>
                                  <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                  <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                  <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                </Dropdown.Menu>
                              
                              }
                              

                               



                              <div className="avatar-parent">
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
                                      selectedGroup === contact ? "" : "bogdan-krivenchenko"
                                    }
                                    style={
                                      selectedGroup &&
                                      selectedGroup.group_id === contact.group_id
                                        ? { color: "white" }
                                        : {}
                                    }
                                  >
                                    {contact.group_name}
                                  </div>
                                  <div
                                    className="hi-how-are"
                                    style={
                                      selectedGroup &&
                                      selectedGroup.group_id === contact.group_id
                                        ? { color: "white" }
                                        : {}
                                    }
                                  >
                                    {contact.message}
                                  </div>
                                </div>
                              </div>
                              <div className="parent">
                                <div
                                  className="div16"
                                  style={
                                    selectedGroup &&
                                    selectedGroup.group_id === contact.group_id
                                      ? { color: "white" }
                                      : {}
                                  }
                                >
                                  <AgoTime date={contact.message_created_at} />
                                </div>
                                <div className="ellipse" />
                              </div>
                            </div>
                      
                          
                        





                        )
                  }
                  else{
                    return (
                      <div className="contact">
              
                      
                      
                            <div
                              className="contact1"
                              data-id={contact.id}
                              onClick={(event) => {
                                handleSelectUser(contact)
                                handleRightClick(event)
                              }}
                              key={contact.id}
                              style={{
                                backgroundColor:
                                  checkSelectedGroup === null
                                    ? ""
                                    : selectedUser &&
                                      selectedUser.email === contact.email
                                    ? "#6366F1"
                                    : "white",
                              }}
                              onMouseEnter={() =>
                                handleMouseEnterContact1(contact.id)
                              }
                              onMouseLeave={() =>
                                handleMouseLeaveContact1(contact.id)
                              }
                            >
                              {
                               downArrowIcons[contact.id] &&   <span className="down_arrow">
                                <FaAngleDown />
                              </span>
                              }
                              {
                                dropDownsContact[contact.id] &&  
                            <Dropdown.Menu show>
                                  <Dropdown.Item href="#/action-1" onClick={(e) => {
                                    (e as any).stopPropagation()
                                     handleArchiveChat(contact.email,contact.id)
                                  }} >Archive</Dropdown.Item>
                           
                                </Dropdown.Menu>
                              
                              }
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
                                      selectedUser &&
                                      selectedUser.email === contact.email
                                        ? { color: "white" }
                                        : {}
                                    }
                                  >
                                    {contact.name}
                                  </div>
                                  <div
                                    className="hi-how-are"
                                    id="hi-how-are"
                                    style={
                                      selectedUser &&
                                      selectedUser.email === contact.email
                                        ? { color: "white" }
                                        : {}
                                    }
                                  >
                                    {contact.message}
                                  </div>
                                </div>
                              </div>
                              <div className="parent">
                                <div
                                  className="div16"
                                  style={
                                    selectedUser && selectedUser.email === contact.email
                                      ? { color: "white" }
                                      : {}
                                  }
                                >
                                  {<AgoTime date={contact.last_message_date} />}
                                </div>
                                <div className="ellipse" />
                              </div>
                            </div>
                      
                      
                    </div>
                      
                      
                      )

                  }

                })
              }

            

            {/* =================================== */}
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
              setGroupChatLoad={setGroupChatLoad}
              groupChatLoad={groupChatLoad}
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
                  {/* ------------------------------------ */}
                  {Object.keys(bothChatMessages).map((date) => {
                    return (
                      <>
                        <div
                          className="friday-january-26th"
                          style={{ background: "white" }}
                        >
                          {moment(date).format("MMM dddd DD")}
                        </div>
                        {bothChatMessages[date].map((data: any) => {
                          if (data.email === selectedUser.email) {
                            return (
                              <div
                                className="div24 single_dist_chat"
                                key={data.id}
                              >
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
                                    <div
                                      className="hihow-are-things-with-our-ill-wrapper"
                                      style={{ background: "transparent" }}
                                    >
                                      {data.is_image === 0 ? (
                                        <div className="hihow-are-things">
                                          {" "}
                                          {data.message}
                                        </div>
                                      ) : (
                                        <div
                                          className="hihow-are-things"
                                          style={{ background: "white" }}
                                        >
                                          <div className="preview_img_parent">
                                            <img
                                              src={`${DOCOTEAM_API}/chat_images/${data.message}`}
                                              alt="Preview"
                                              id="preview_img"
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    <div className="wrapper3">
                                      <div className="div16">
                                        {moment(data.created_at).format(
                                          "h:mm a"
                                        )}
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
                                    onMouseEnter={() =>
                                      handleMouseEnter(data.id)
                                    }
                                    onMouseLeave={() =>
                                      handleMouseLeave(data.id)
                                    }
                                  >
                                    {deleteIcons[data.id] && (
                                      <div className="delete_button">
                                        <RiDeleteBin6Line
                                          className="delete-icon"
                                          onClick={() =>
                                            handleDeleteMessage(data.id)
                                          }
                                        />
                                      </div>
                                    )}

                                    {data.is_image === 0 ? (
                                      <div className="hihow-are-things">
                                        {" "}
                                        {data.message}
                                      </div>
                                    ) : (
                                      <div
                                        className="hihow-are-things"
                                        style={{ background: "white" }}
                                      >
                                        <div className="preview_img_parent">
                                          <img
                                            src={`${DOCOTEAM_API}/chat_images/${data.message}`}
                                            alt="Preview"
                                            id="preview_img"
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <div className="wrapper6">
                                    <div className="div16">
                                      {moment(data.created_at).format("h:mm a")}
                                    </div>
                                  </div>
                                </div>
                                <img
                                  className="avatar-icon1"
                                  alt=""
                                  src={avatar}
                                />
                              </div>
                            );
                          }
                        })}
                      </>
                    );
                  })}
                  {/* ------------------------------------ */}

                  <div ref={singleChatDivRef}></div>
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

                      {/* =========== */}
                      <img
                        className="file_upload_icon"
                        alt=""
                        src={fileShare}
                        id="file_upload_button"
                        onClick={handleUploadClick}
                      />

                      {/* <span>
                        <form
                          ref={previewImgFormRef}
                          encType="multipart/form-data"
                        >
                          <div className="file_upload_parent">
                            <label
                              htmlFor="fileInput"
                              className="file_upload_label"
                            >
                              {/* onChange={handleFileInputChange} */}

                      {/* </label> */}
                      {/* <input
                              type="file"
                              id="fileInput"
                              className="file_upload_input"
                              {/* onChange={handleFileInputChange} */}

                      {/* />  */}
                      {/* </div> */}
                      {/* </form> */}
                      {/* </span> } */}
                      {/* ============================ */}
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
