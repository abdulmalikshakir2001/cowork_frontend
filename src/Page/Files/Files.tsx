import React, {useEffect, useState} from 'react';
import Layout from '../../Component/Layout/Layout';
import "./Files.css";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowLeft, faArrowRight, faArrowUp, faPlus, faSearch} from '@fortawesome/free-solid-svg-icons';
import {Dropdown, Table} from 'react-bootstrap';
import {DOCOTEAM_API as API} from '../../config';
import filter from '../../Assets/Images/icon/filter-lines.png';
import download from "../../Assets/Images/icon/download-cloud-02.png";
import deleteIcon from "../../Assets/Images/icon/trash-02.png";
import star from "../../Assets/Images/icon/star-01.png";
import markStar from "../../Assets/Images/icon/star-01(1).png";
import UploadFile from '../../Component/UploadFile/UploadFile';
import {favoriteFile, filesDelete, getFavoriteList, getFilesList} from '../../api/files';
import {convertBytesToSize} from '../../CommonFunction/Function';

import imgExtension from "../../Assets/Images/icon/feature-image.png";
import fileExtension from "../../Assets/Images/icon/feature-file.png";
import videoExtension from "../../Assets/Images/icon/feature-video.png";
import unknownExtension from "../../Assets/Images/icon/feature-unknown.png";
import {showNotifications} from '../../CommonFunction/toaster';
import {ToastContainer} from 'react-toastify';
import {getMemberList} from '../../api/member';
import ShareFile from '../../Component/UploadFile/ShareFile';
import moment from "moment/moment";


const Files = () => {
  const [filesList, setFilesList] = useState([]);
  const [selectedValue, setSelectedValue] = useState(0);
  const [count, setCount] = useState(0);
  const [filesId, setFilesId] = useState("");
  const [member, setMember] = useState([]);
  const [favoriteList, setFavoriteList] = useState([]);


  // pagination number
  const numbers = [1, 2, 3, 4, 5, 10, 20, 50, 100];
  const handleSelect = (selectedValue: any) => {
    const integerValue = parseInt(selectedValue);
    setSelectedValue(selectedValue);
  };

  const [uploadShow, setUploadShow] = useState(false);
  const handleUploadClose = () => setUploadShow(false);

  const [shareShow, setShareShow] = useState(false);
  const handleShareClose = () => setShareShow(false);

  const fileUpload = () => {
    setUploadShow(true);
  }

  useEffect(() => {
    getFilesList(10, 1).then((data) => {
      if (data.statusCode !== 200) {

      }
      else {
        setFilesList(data && data.files);
      }
    });

    getMemberList().then((data) => {

      if (data.statusCode !== 200) {

      }
      else {
        setMember(data.members);
      }
    })

    getFavoriteList().then((data) => {

      if (data.statusCode !== 200) {

      }
      else {
        setFavoriteList(data.favorite);
      }
    })

  }, [uploadShow, count, shareShow]);




  const getFileType = (extension: string) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const videoExtensions = ['mp4', 'avi', 'mov'];
    const documentExtensions = ['pdf', 'doc', 'docx', 'txt'];

    if (imageExtensions.includes(extension)) {
      return imgExtension;
    } else if (videoExtensions.includes(extension)) {
      return videoExtension;
    } else if (documentExtensions.includes(extension)) {
      return fileExtension;
    } else {
      return unknownExtension;
    }
  };

  const getFileExtension = (extension: string) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const videoExtensions = ['mp4', 'avi', 'mov'];
    const documentExtensions = ['pdf', 'doc', 'docx', 'txt'];

    if (imageExtensions.includes(extension)) {
      return 'file-5 favoriteBox';
    } else if (videoExtensions.includes(extension)) {
      return 'file-4 favoriteBox';
    } else if (documentExtensions.includes(extension)) {
      return 'file-2 favoriteBox';
    } else {
      return 'file-3 favoriteBox';
    }
  };

  // delete files
  const fileRemove = (id: string) => {
    filesDelete(id).then((data) => {
      showNotifications('success', 'Files deleted successfully');
      setCount(count + 1)
    });
  }
  // download file
  const handleDownloadClick = async (fileName: string) => {
    const imageUrl = `${API}/${fileName}`;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };

  // favorite choose
  const favoriteAdd = (id: string) => {
    favoriteFile(id).then((data) => {
      if (data.newFavorite === true) {
        showNotifications('success', 'Favorite add successfully');
      }
      else {
        showNotifications('error', 'Favorite remove successfully');
      }

      setCount(count + 1)
    });
  }

  // favorite choose
  const shareUpdate = (id: string) => {
    favoriteFile(id).then((data) => {
      if (data.newFavorite === true) {
        showNotifications('success', 'Favorite add successfully');
      }
      else {
        showNotifications('error', 'Favorite remove successfully');
      }

      setCount(count + 1)
    });
  }

  function separateShares(sharesString: any) {
    return sharesString.split(',').map((filename: any) => filename.trim());
  }

  const shareModal = (fileId: string) => {
    setFilesId(fileId);
    setShareShow(true);
  }

  return (
    <>
      <Layout>
        <ToastContainer />
        <div className='mainContent'>
          <div className="files">
            <div className="text43">Favorites</div>
            <div className="file-2-parent">
              {favoriteList && favoriteList.map((favorite: any, index) =>
                <div className={getFileExtension(favorite.extension)}>
                  <div className='favorite'>
                    <img src={getFileType(favorite.extension)} alt="avatar" />
                  </div>
                  <div className="membership-agreementpdf">
                    {favorite.nick_name}.{favorite.extension}
                  </div>
                </div>)}

            </div>
          </div>
          <div className="filesTable">
            <div className="topLine">
              <div className='tableHeading'>
                <h6>All Files</h6>
              </div>
              <div className='memberSearch'>
                <div className='searchInput'>
                  <input type="text" placeholder='Search files' className='form-control' />
                  <FontAwesomeIcon icon={faSearch} />
                </div>
                <button className='filterBtn'><img src={filter} alt='filter' /> Filter</button>
                <button onClick={() => fileUpload()}><FontAwesomeIcon icon={faPlus} /> Upload File</button>
              </div>
            </div>
            <div className="filesList">
              <Table responsive hover>
                <thead>
                  <tr>
                    <th><label className="tableCheckBox">
                      <div className="contactCheck">
                        <input type="checkbox" name="agreement" />
                        <span className="checkmark"></span></div>
                    </label></th>
                    <th>Name <FontAwesomeIcon icon={faArrowUp} /></th>
                    <th>Uploaded <FontAwesomeIcon icon={faArrowUp} /></th>
                    <th>Size <FontAwesomeIcon icon={faArrowUp} /></th>
                    <th>Sharing</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filesList && filesList.map((file: any, index) => <tr>
                    <td><label className="tableCheckBox">
                      <div className="contactCheck">
                        <input type="checkbox" name="agreement" />
                        <span className="checkmark"></span></div>
                    </label></td>
                    <td><img src={getFileType(file.extension)} alt="avatar" /> {file.nick_name}.{file.extension}</td>
                    <td>{moment(file.created_at).format('MMMM D, YYYY')}</td>
                    <td>{convertBytesToSize(file.size)}</td>
                    {file.shares ? <td>
                      <div className="avatars2">
                        {file.shares && separateShares(file.shares).map((share: any) =>
                          <img className="avatar-icon36" alt="" src={`${API}/${share}`} />
                        )}
                        <div className="avatar2" onClick={() => shareModal(file.id)}>
                          +
                        </div>
                      </div>
                    </td>
                      : <td className='tableAction'><button className='btn assignBtn' onClick={() => shareModal(file.id)}>Share</button></td>
                    }
                    <td className='tableAction'>
                      <button className='btn download' onClick={() => handleDownloadClick(file.name)}><img src={download} alt="download" /></button>
                      <button className='btn delete' onClick={() => fileRemove(file.id)}><img src={deleteIcon} alt="delete" /></button>
                      <button className='btn start' onClick={() => favoriteAdd(file.id)}>
                        {file.favorite === 0 ? <img src={markStar} alt="download" /> : <img src={star} alt="download" />}

                      </button>
                    </td>
                  </tr>)}
                </tbody>
              </Table>
              {/* <div className='paginationBox'>
                                <div className="tableNumber">
                                  
                                    <Dropdown className="paginationDropdown" onSelect={handleSelect}>
                                        <Dropdown.Toggle id="pageDropDown">
                                        {selectedValue !== null ? selectedValue : (limitDivided.length > 0 && limitDivided[limitDivided.length - 1])}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu role="menu" aria-labelledby="pageDropDown">
                                            {limitDivided && limitDivided.map((data:any,index) => (
                                                <Dropdown.Item key={`limitNumber` + index} eventKey={data}>
                                                    {data}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown> 
                                    <p>Showing {resultLength} of {totalValue} members</p>
                                </div>
                                <div className="paginationNumber">
                                    <button onClick={() => prevPage(1)} className={prevButton === true ? "" : "disable"}><FontAwesomeIcon icon={faArrowLeft} /> Previous</button>
                                    <button>{page}</button>
                                    <button onClick={() => nextPage(1)} className={nextButton === true ? "" : "disable"}>Next <FontAwesomeIcon icon={faArrowRight} /></button>
                                </div>
                            </div> */}
              <div className='paginationBox'>
                <div className="tableNumber">
                  <Dropdown className="paginationDropdown" onSelect={handleSelect}>
                    <Dropdown.Toggle id="pageDropDown">
                      {selectedValue}
                    </Dropdown.Toggle>
                    <Dropdown.Menu role="menu" aria-labelledby="pageDropDown">
                      {numbers.map((number) => (
                        <Dropdown.Item key={number} eventKey={number.toString()}>
                          {number}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                  <p>Showing 10 of 100 members</p>
                </div>
                <div className="paginationNumber">
                  <button><FontAwesomeIcon icon={faArrowLeft} /> Previous</button>
                  <button>1</button>
                  <button>2</button>
                  <button>3</button>
                  <button>...</button>
                  <button>8</button>
                  <button>9</button>
                  <button>10</button>
                  <button>Next <FontAwesomeIcon icon={faArrowRight} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <UploadFile uploadShow={uploadShow} setUploadShow={setUploadShow} handleUploadClose={handleUploadClose} />
        <ShareFile filesId={filesId} shareShow={shareShow} setShareShow={setShareShow} handleShareClose={handleShareClose} />
      </Layout>
    </>
  )
}

export default Files
