import React, { useEffect, useRef, useState } from "react";
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

function Group({ lastInsertedGroupId, groupId }: any) {
  
  const singleChatDivRef = useRef<HTMLDivElement>(null);
  
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
  const handleChange = (selectedOptions: any) => {
    setSelectedOptions(selectedOptions);
    // lastInsertedGroupId
    setGroupUsers(selectedOptions);
    const lastSelectedUser = selectedOptions[selectedOptions.length - 1];
    console.log(lastSelectedUser)
    
    post("/saveGroupMember", {
      group_id: lastInsertedGroupId ? lastInsertedGroupId : groupId,
      email: lastSelectedUser.value,
    }).then((data) => {
      if (data.statusCode === 201) {
        alert('user added in the group')
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
  const handleSenderMessageGroup = (data: any) => {
    setContacts((prev) => [...prev, data]);
  };
  const toRecieversGroup = (data: any) => {
    setContacts((prev) => [...prev, data]);
  };

  useEffect(() => {
    console.log(selectedOptions);
  }, [selectedOptions]);
  const messageStart = () => {
    if (input.trim() !== "") {
      setInput("");
    }
    
    
    setShowUserGroup(false)
    post("/saveGroupChats", {
      email: currentUser.email,
      message: input,
      group_id: groupId,
    });

    socket?.emit("senderMessageSend", {
      email: currentUser.email,
      message: input,
      groupId,
    });
  };

  useEffect(() => {
    socket?.on("senderMessageGroup", handleSenderMessageGroup);
    socket?.on("toRecieversGroup", toRecieversGroup);
    socket?.emit("joinRoom", { email: currentUser.email, groupId });

    return () => {
      socket?.off("senderMessageGroup", handleSenderMessageGroup);
      socket?.off("toRecieversGroup", toRecieversGroup);
    };
  }, [currentUser.email, groupId, socket]);

  useEffect(() => {
    
    post("/getAllGroupChats", { group_id: groupId }).then((data) => {
      setContacts(data);
      console.log('on click load group chats')
      console.log(data)
      console.log('on click load group chats')

    });
  }, [groupId]);
  useEffect(()=>{
    singleChatDivRef.current?.scrollIntoView({ behavior: 'smooth' });
  },[contacts])

  // useEffect(()=>{
  //   // alert('groupId to fecth group members to show ----- '  + groupId)

  // },[groupId])

  useEffect(()=>{
    post('/getGroupMembers',{groupId}).then((data)=>{
      setSelectedOptions(data);
    })

    

  },[groupId])
  
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
        <div className="friday-january-26th-parent">
          <div className="friday-january-26th">Friday, January 26th</div>
          search users to add in the Group
          {
            showUserGroup && 
           <div className="group_user_parent">
           {groupUsers.map((groupUser) => {
             return (
               <div className="chat_user_card">
                 <img src={avatar} alt="User Image" />
                 <div className="card-content">
                   <p>{groupUser.label}</p>
                 </div>
               </div>
             );
           })}
         </div>
         


  
 }
          {/* showing chats on selection */}
          {contacts.map((contact) => {
            if (currentUser.email !== contact.email) {
              return (
                <div className="div24">
                  <div className="message">
                    <div className="avatar1">
                      <img className="avatar-icon1" alt="" src={avatar} />
                      <div className="avatar-online-indicator">
                        <img alt="" src={onlineShow} />
                      </div>
                    </div>
                    <div className="message1">
                      <div className="hihow-are-things-with-our-ill-wrapper">
                        <div className="hihow-are-things">
                          <div>{contact.email}</div>
                          {contact.message}
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
                        <div>{contact.email}</div>
                        {contact.message}
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
          {/* showing chats on selection */}
          <div ref={singleChatDivRef}></div>


        </div>
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
              <img className="info-circle-icon" alt="" src={emoji} />
              <img className="info-circle-icon" alt="" src={fileShare} />
            </div>
          </div>
          <div className="hint-text">This is a hint text to help user.</div>
        </div>
      </div>
    </div>
  );
}

export default Group;
