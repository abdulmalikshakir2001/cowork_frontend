import React, { useCallback, useEffect, useRef, useState } from "react";
import avatar from "../../Assets/Images/icon/Avatar.png";
import onlineShow from "../../Assets/Images/icon/online.png";
import more from "../../Assets/Images/icon/more.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import emoji from "../../Assets/Images/icon/face-smile.png";
import fileShare from "../../Assets/Images/icon/link-01.png";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { post } from "../../api/base-api";
import { selectAuthUser } from "../../lib/features/authUser/authUserSlice";
import { useAppSelector } from "../../lib/hooks";
import { useSocket } from "../../providers/Socket";
import "./Group.css";
import { group } from "console";
import { RiDeleteBin6Line } from "react-icons/ri";
import moment from "moment";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { MdCancel } from "react-icons/md";
import {DOCOTEAM_API} from  "../../config";

function Group({
  lastInsertedGroupId,
  groupId,
  groupChatLoad,
  setGroupChatLoad,
}: any) {
  const groupChatDivRef = useRef<HTMLDivElement>(null);

  const socketContext = useSocket();
  const socket = socketContext ? socketContext.socket : null;
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const currentUser = useAppSelector(selectAuthUser); // this object contain email,role,name -->focus
  const [input, setInput] = useState<string>(""); // current user message -->focus
  const [initialDefaultOptions, setInitialDefaultOptions] = useState<any[]>([]); // current user message -->focus
  const [selectedOptions, setSelectedOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [groupUsers, setGroupUsers] = useState<any[]>([]);
  const [showUserGroup, setShowUserGroup] = useState(true);
  const [previewImage, setPreviewImage] = useState<any>(undefined);
  const handleChange = (selectedOptions: any) => {
    setSelectedOptions(selectedOptions);
    // lastInsertedGroupId
    setGroupUsers(selectedOptions);
    const lastSelectedUser = selectedOptions[selectedOptions.length - 1];
    console.log(lastSelectedUser);

    post("/saveGroupMember", {
      group_id: lastInsertedGroupId ? lastInsertedGroupId : groupId,
      email: lastSelectedUser.value,
    }).then((data) => {
      if (data.statusCode === 201) {
        socket?.emit("userAddedToGroup", data);
      }
    });
  };
  const [apiOptions, setApiOptions] = useState<any>();
  const [contacts, setContacts] = useState<any[]>([]);
  const loadOption = (inputValue: string, callBack: any) => {
    // getAllUsersBySearch
    post("/getAllUsersBySearch", {
      currentUserEmail: currentUser.email,
      inputValue: inputValue,
    }).then((data) => {
      const filtered_data = data.map((user: any) => {
        return { value: user.email, label: user.name };
      });
      callBack(filtered_data);
    });
  };

  const handleSenderMessageGroup = useCallback(
    (data: any) => {
      post("/getAllGroupChats", { group_id: data.groupId }).then((data) => {
        setContacts(data);
        setGroupChatLoad(true);
        cancelPreview()
      });
    },
    [setGroupChatLoad]
    
  );
  const toRecieversGroup = useCallback(
    (data: any) => {
      post("/getAllGroupChats", { group_id: data.groupId }).then((data) => {
        setContacts(data);
        setGroupChatLoad(true);
      });
    },
    [setGroupChatLoad]
  );

  useEffect(() => {
    console.log(selectedOptions);
  }, [selectedOptions]);
  const messageStart = () => {
    if (input.trim() !== "") {
      setInput("");
    }

    setShowUserGroup(false);
    // post("/saveGroupChats", {
    //   email: currentUser.email,
    //   message: input,
    //   group_id: groupId,
    // });

    socket?.emit("senderMessageSend", {
      email: currentUser.email,
      message: input,
      file: previewImage,
      groupId,
    });
  };
  const handleGroupChatDeleted = useCallback((data: any) => {
    post("/getAllGroupChats", { group_id: data.groupId }).then((data) => {
      setContacts(data);
    });
  }, []);

  useEffect(() => {
    socket?.on("senderMessageGroup", handleSenderMessageGroup);
    socket?.on("toRecieversMessageGroup", toRecieversGroup);
    socket?.emit("joinRoom", { email: currentUser.email, groupId });
    socket?.on("groupChatDeleted", handleGroupChatDeleted);

    return () => {
      socket?.off("senderMessageGroup", handleSenderMessageGroup);
      socket?.off("toRecieversMessageGroup", toRecieversGroup);
      socket?.off("groupChatDeleted", handleGroupChatDeleted);
    };
  }, [
    currentUser.email,
    groupId,
    handleGroupChatDeleted,
    handleSenderMessageGroup,
    socket,
    toRecieversGroup,
  ]);

  useEffect(() => {
    post("/getAllGroupChats", { group_id: groupId }).then((data) => {
      setContacts(data);
    });
  }, [groupId, contacts]);

  useEffect(() => {
    post("/getGroupMembers", { groupId }).then((data) => {
      setSelectedOptions(data);
    });
  }, [groupId]);
  // delete chat
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
    socket?.emit("deleteGroupChat", { groupChatId: id, groupId });
  };

  useEffect(() => {
    socket?.emit("setGroupId", groupId);
  }, [groupId, socket]);

  // emoji picker
  const [showPicker, setShowPicker] = useState(false);
  const handleEmojiSelect = (emoji: any) => {
    setInput(input + emoji.native);
  };
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

  return (
    <div className="chat1">
      <div className="user-header">
        <AsyncSelect
          loadOptions={loadOption}
          onChange={handleChange}
          defaultOptions={initialDefaultOptions}
          value={selectedOptions}
          isMulti
          placeholder="To"
        />
      </div>

      <div className="chat2 custom_scroll" ref={chatContainerRef}>
        {/* --------------------- */}

        <div className="friday-january-26th-parent">
        {showUserGroup && (
                  <div className="group_user_parent">
                    {groupUsers.map((groupUser) => {
                      return (
                        <div className="chat_user_card" key={groupUser.label}>
                          <img src={avatar} alt="User Image" />
                          <div className="card-content">
                            <p>{groupUser.label}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
          {Object.keys(contacts).map((date: any) => {
            return (
              <>
                <div
                  className="friday-january-26th"
                  style={{ background: "white" }}
                >
                  {moment(date).format("MMM dddd DD")}
                </div>

                
                {contacts[date].map((contact: any) => {
                  if (currentUser.email !== contact.email) {
                    return (
                      <div className="div24 single_dist_chat" key={contact.id}>
                        <div className="message">
                          <div className="avatar1">
                            <img className="avatar-icon1" alt="" src={avatar} />
                            <div className="avatar-online-indicator">
                              <img alt="" src={onlineShow} />
                            </div>
                          </div>
                          <div className="message1">
                            <div
                              className="hihow-are-things-with-our-ill-wrapper"
                              style={{ background: "transparent" }}
                            >
                              {
                                contact.is_image === 0 ?<div className="hihow-are-things"> {contact.message}</div>:<div className="hihow-are-things" style={{background:"white"}} ><div className="preview_img_parent">
                            <img
                              src={`${DOCOTEAM_API}/group_chat_images/${contact.message}`}
                              alt="Preview"
                              id="preview_img"
                            />
                          </div>
                          </div>
                                }


                              
                            </div>
                            <div className="wrapper3">
                              <div className="div16">
                                {moment(contact.created_at).format("h:mm a")}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="message7" key={contact.id}>
                        <div className="message8">
                          <div
                            className="hi-im-working-on-the-final-sc-wrapper for_delete"
                            onMouseEnter={() => handleMouseEnter(contact.id)}
                            onMouseLeave={() => handleMouseLeave(contact.id)}
                          >
                            {deleteIcons[contact.id] && (
                              <div className="delete_button_group">
                                <RiDeleteBin6Line
                                  className="delete-icon"
                                  onClick={() =>
                                    handleDeleteMessage(contact.id)
                                  }
                                />
                              </div>
                            )}
                            
                                 {
                                contact.is_image === 0 ?<div className="hihow-are-things"> {contact.message}</div>:<div className="hihow-are-things" style={{background:"white"}} ><div className="preview_img_parent">
                            <img
                              src={`${DOCOTEAM_API}/group_chat_images/${contact.message}`}
                              alt="Preview"
                              id="preview_img"
                            />
                          </div>
                          </div>
                                }
                        
                          </div>
                          <div className="wrapper6">
                            <div className="div16">
                              {moment(contact.created_at).format("h:mm a")}
                            </div>
                          </div>
                        </div>
                        <img className="avatar-icon1" alt="" src={avatar} />
                      </div>
                    );
                  }
                })}
              </>
            );
          })}

          <div ref={groupChatDivRef}></div>
          {previewImage && (
            <>
              <div className="preview_img_parent">
                <span onClick={cancelPreview} className="cancel-btn">
                  <MdCancel />
                </span>

                <img src={previewImage} alt="Preview" id="preview_img" />
              </div>
            </>
          )}
        </div>
        {/* ------------------- */}
      </div>
      <div className="avatar-parent7">
        <img className="avatar-icon" alt="" src={avatar} />
        <div className="input-field">
          <div className="input-with-label">
            <div className="label1">Email Address</div>
            <div className="input">
              <img className="search-md-icon" alt="" src="/searchmd.svg" />
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
                    <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                  </span>
                )}
                <img
                  className="info-circle-icon"
                  alt=""
                  src={emoji}
                  onClick={() => setShowPicker(!showPicker)}
                />
              </span>
              <span>
                <form ref={previewImgFormRef} encType="multipart/form-data">
                  <div className="file_upload_parent">
                    <label htmlFor="fileInput" className="file_upload_label">
                      <img
                        className="file_upload_icon"
                        alt=""
                        src={fileShare}
                        id="file_upload_button"
                      />
                    </label>
                    <input
                      type="file"
                      id="fileInput"
                      className="file_upload_input"
                      onChange={handleFileInputChange}
                    />
                  </div>
                </form>
              </span>

              
            </div>
          </div>
          <div className="hint-text">This is a hint text to help user.</div>
        </div>
      </div>
    </div>
  );
}

export default Group;
