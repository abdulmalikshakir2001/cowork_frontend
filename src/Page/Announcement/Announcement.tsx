import React, { useState, useEffect } from 'react'
import Layout from '../../Component/Layout/Layout';
import "./Announcement.css";
import postLogo from "../../Assets/Images/icon/adminIcon.png";
import icon from "../../Assets/Images/post/face-smile.png";
import share from "../../Assets/Images/post/share-07.png";
import blankLove from "../../Assets/Images/post/heart.png";
import message from "../../Assets/Images/post/message-dots-square.png";
import clickLove from "../../Assets/Images/post/heart(1).png";
import dotLine from "../../Assets/Images/post/dots-horizontal.png";
import postImage from "../../Assets/Images/post/post.png";
import avatar from "../../Assets/Images/post/Avatar.png";
import uploadImage from "../../Assets/Images/post/image-03.png";
import UploadFile from './UploadFile';
import { v4 as uuidv4 } from 'uuid';
import { getPostList, postAdd } from '../../api/announcement';
import { showNotifications } from '../../CommonFunction/toaster';
import { ToastContainer } from 'react-toastify';
import { DOCOTEAM_API as API } from '../../config';
import { Dropdown } from 'react-bootstrap';
import arrow from "../../Assets/Images/icon/downArrowBlack.png";

const Announcement = () => {
  const [file, setFile] = useState("");
  const [uploadShow, setUploadShow] = useState(false);
  const handleUploadClose = () => setUploadShow(false);
  const [post, setPost] = useState("");
  const [postLike, setPostLike] = useState("0");
  const [count, setCount] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [postList, setPostList] = useState([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const handleStateSelect = (state: string) => {
    if (state === "admin") {
      setSelectedState('Beehive Coworking');
      setRole('admin');
    }
    else {
      setSelectedState('Sarah Kline (You)');
      setRole('user');
    }

  };

  const uploadFiles = () => {
    setUploadShow(true);
  }

  useEffect(() => {
    getPostList().then((data) => {
      if (data.statusCode !== 200) {

      }
      else {
        setPostList(data.post);
      }
    })
  }, [count]);

  // add post
  const addPost = () => {
    let postInfo = {
      "id": uuidv4(),
      "post": post,
      "post_image": file,
      "post_like": postLike,
      "role": role
    }
    postAdd(postInfo).then((data) => {
      if (data.statusCode !== 201) {
        showNotifications('error', 'Wrong information');
      }
      else {
        showNotifications('success', 'Post add successfully');
        setFile("");
        setPost("");
        setUploadedFiles([])
        setCount(count + 1)
      }
    })
  }


  function getTimeDifferenceString(providedTimeStr:any) {
    // Convert provided time string to Date object
    var providedTime:any = new Date(providedTimeStr);

    // Get current time
    var currentTime:any = new Date();

    // Calculate the difference in milliseconds
    var timeDifference:any = currentTime - providedTime;

    // Convert milliseconds to minutes, hours, days, months, and years
    var minutes = Math.floor(timeDifference / (1000 * 60));
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);
    var months = Math.floor(days / 30); // Approximate months
    var years = Math.floor(months / 12);

    // Generate the human-readable time difference string
    if (years > 0) {
        return years === 1 ? "1 year ago" : years + " years ago";
    } else if (months > 0) {
        return months === 1 ? "1 month ago" : months + " months ago";
    } else if (days > 0) {
        return days === 1 ? "1 day ago" : days + " days ago";
    } else if (hours > 0) {
        return hours === 1 ? "1 hour ago" : hours + " hours ago";
    } else {
        return minutes <= 1 ? "just now" : minutes + " minutes ago";
    }
}

  return (
    <>
      <Layout>
        <ToastContainer />
        <div className='mainContent'>
          <div className='d-flex justify-content-center'>
            <div className="announcementAdmin">

              {/* post upload */}
              <div className="new-post">
                <div className="frame-div">
                  <img className="avatar-icon" alt="" src={avatar} />
                  <div className="input-field3">
                    <div className="input-with-label3">
                      <div className="input3">
                        <textarea value={post} onChange={(e) => setPost(e.target.value)} placeholder='Post a new update' />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='d-flex justify-content-end w-100'>
                  <div className="postIconImage">
                    <div className="image" onClick={uploadFiles}>
                      <img className="heart-icon" alt="" src={uploadImage} />
                      <div className="comments">Upload Image/Video</div>
                    </div>
                    <Dropdown>
                      <Dropdown.Toggle id="dropdown-basic">
                        {selectedState ? `${selectedState} ` : 'Posting As'} <img src={arrow} alt="arrow" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleStateSelect('you')}>
                          Sarah Kline (You)
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleStateSelect('admin')}>
                          Beehive Coworking
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    <button type='submit' className='btn btn-info' onClick={addPost}>Publish</button>
                  </div>
                </div>
              </div>

              {/* post list */}
              {postList && postList.map((data: any) =>
                <div className="post-parent">
                  <div className="post">
                    <div className="user">
                      <div className="postLogo">
                        <img className="vector-icon" alt="" src={postLogo} />
                      </div>
                      <div className="beehive-coworking-parent">
                        <div className="elviro-anasta">{data.role === "admin" ? "Beehive Coworking" : "Sarah Kline (You)"}</div>
                        <div className="mins-ago">{getTimeDifferenceString(data.created_at)}</div>
                      </div>
                      <img className="line-chart-up-04-icon" alt="" src={dotLine} />
                    </div>

                    <div className="the-modern-workplace">
                      {data.post}
                    </div>

                    {data.post_image ? <div className="images">
                      <img src={`${API}/${data.post_image}`} className="wtqzczkosgc-1-icon" alt="post" />
                    </div> : ""}

                    <div className="feedback">
                      <div className="like">
                        <img className="heart-icon" alt="" src={blankLove} />
                        <div className="comments">0 like</div>
                      </div>
                      <div className="feedback-child" />
                      <div className="like">
                        <img className="heart-icon" alt="" src={message} />
                        <div className="comments">Comments</div>
                      </div>
                    </div>
                    <div className="avatar-parent">
                      <img className="avatar-icon" alt="" src={avatar} />
                      <div className="input-field">
                        <div className="input-with-label">
                          <div className="input">
                            <div className="content3">
                              <input className="text form-control" type="text" placeholder='Write your comment' />
                            </div>
                            <img className="info-circle-icon" alt="" src={icon} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>)}


            </div>
          </div>
        </div>

        <UploadFile setFile={setFile} uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} uploadShow={uploadShow} setUploadShow={setUploadShow} handleUploadClose={handleUploadClose} />


      </Layout>
    </>
  )
}

export default Announcement