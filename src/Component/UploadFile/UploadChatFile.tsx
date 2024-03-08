import React, { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';
import { Col, Container, Modal, Row } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import folder from "../../Assets/Images/icon/folder.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { getMemberList, searchMember, singleMember } from '../../api/member';
import { DOCOTEAM_API as API } from '../../config';
import uploadFile from "../../Assets/Images/icon/uploadIcon.png";
import fileFormat from "../../Assets/Images/icon/file-05.png";
import trash from "../../Assets/Images/icon/red-trash.png";
import avatar from "../../Assets/Images/icon/Avatar.png";
import { filesAdd } from '../../api/files';
import { convertBytesToSize } from '../../CommonFunction/Function';
import { showNotifications } from '../../CommonFunction/toaster';

interface UploadChatFileProps {
    handleUploadClose: () => void;
    uploadShow: boolean;
    setUploadShow: (type: boolean) => void;
    setPreviewImage:any;
    messageStart:any;
    fileUplaodOnServer:any;
    setFileUplaodOnServer:any
}

const UploadChatFile = ({ uploadShow, setUploadShow, handleUploadClose,setPreviewImage,messageStart,fileUplaodOnServer,setFileUplaodOnServer }: UploadChatFileProps) => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [members, setMembers] = useState([]);
    const [nickName, setNickName] = useState("");
    const [file, setFile] = useState("");
    const [shares, setShares] = useState<any>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {

        searchMember(searchTerm).then((data) => {
            setMembers(data.results);
            // if (data.statusCode !== 200) {

            // }
            // else {
            //   setFilesList(data && data.files);
            // }
        });

    }, [searchTerm]);
    const wrapperRef = useRef<HTMLInputElement>(null);
    const onFileDrop = (event: any) => {
        const imageFile = event.target.files && event.target.files[0];
        setFile(event.target.files[0])
        if (imageFile && uploadedFiles.length === 0) {
            setUploadedFiles([imageFile]);
        }
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = () => {
              if (typeof reader.result === "string") {
                setPreviewImage(reader.result);
              }
            };
            reader.readAsDataURL(imageFile);
          }

    }
    // remove file
    const removeFile = () => {
        setUploadedFiles([]);
    }
    // add files
    const addFiles = () => {
        let files:any = {
            "id": uuidv4(),
            "name": uploadedFiles[0].name,
            "nickName": nickName,
            "extension": uploadedFiles[0].name.split('.').pop() || '',
            "size": uploadedFiles.reduce((totalSize, file) => totalSize + file.size, 0),
            "files_upload": file
        }
        if (shares) {
            const ids = shares.map((obj:any) => obj.member_image);
            files.shares = `${ids}`;
        }

        if (nickName.length > 0) {
            filesAdd(files).then((data) => {
                if (data.statusCode !== 201) {
                    showNotifications('error', 'SOmething wrong');
                }
                else {
                    showNotifications('success', 'Files upload successfully');
                    setUploadShow(false);
                    setUploadedFiles([]);
                    setNickName("");
                }
            })
        }
        messageStart();

    }

    const shareList = (share: any) => {
        const shareExists = shares.some((existingShare: any) => existingShare.id === share.id);
        if (!shareExists) {
            setShares([...shares, share]);
        } else {
            showNotifications('error', 'Share already exists in the list');
        }
    }

    const removeShare = (memberId: string) => {
        setShares((prevShares:any) => prevShares.filter((item:any) => item.id !== memberId));
    }
    useEffect(()=>{
        removeFile()
        setFileUplaodOnServer(false)
    },[fileUplaodOnServer, setFileUplaodOnServer])


    return (
        <>
            <Modal show={uploadShow} onHide={handleUploadClose} centered size="lg">
                <ToastContainer />
                

                
                <div className="addMemberForm">
                    <button className='closeModal' onClick={handleUploadClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <Container>
                        <Row>
                            <Col md={12}>
                                <div className='addMemberHeading'>
                                    <img src={folder} alt="member" />
                                    <p>Upload File</p>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <div ref={wrapperRef} className="drop-file-input">
                                    <div className="drop-file-input__label">
                                        <img src={uploadFile} alt="" />
                                        <p><span>Click to upload</span> or drag and drop</p>
                                    </div>
                                    <input type="file" value="" onChange={onFileDrop} />
                                </div>
                                {uploadedFiles && uploadedFiles.map((file, index) =>
                                    <div className="uploadFileShow">
                                        <div className="fileFormat">
                                            <img src={fileFormat} alt="file" />
                                        </div>
                                        <div className="fileName">
                                            <p>{file.name}</p>
                                            <span>{convertBytesToSize(file.size)} – 100% uploaded</span>
                                        </div>
                                        <div className="fileDelete" onClick={removeFile}>
                                            <img src={trash} alt="trash" />
                                        </div>
                                    </div>
                                )}

                                

                                

                                <div className="uploadBtn">
                                    {uploadedFiles && uploadedFiles.length === 0 ? <button className='btn noFile' type='submit'>Save</button>
                                        : <button className='btn save' type='submit' onClick={addFiles}>Save</button>}


                                </div>
                            </Col>
                        </Row>

                    </Container>
                </div>
                
            </Modal>
        </>
    )
}

export default UploadChatFile