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

interface UploadFileProps {
    handleUploadClose: () => void;
    uploadShow: boolean;
    setUploadShow: (type: boolean) => void;
}

const UploadFile = ({ uploadShow, setUploadShow, handleUploadClose }: UploadFileProps) => {
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

                                <div className="fileSendInfo">
                                    <div className="fileNameType">
                                        <label htmlFor="name">Filename</label>
                                        <input type='text' value={nickName} onChange={(e) => setNickName(e.target.value)} placeholder='File name' className='form-control' required />
                                    </div>
                                </div>

                                <div className="sharing">
                                    <p>Sharing</p>
                                    <div className="adminOption">
                                        <img src={avatar} alt="" />
                                        <div className='adminName'>
                                            <p>Elviro Anasta (you)</p>
                                            <span>ADMIN</span>
                                        </div>
                                    </div>
                                    <div className="shareMember">
                                        <div className="content">
                                            <ul>
                                                <li><img src={avatar} alt="" /><span>Elviro</span><FontAwesomeIcon icon={faXmark} /> </li>
                                                {shares && shares.map((member: any) => (
                                                    <li>
                                                        <img src={`${API}/${member.member_image}`} alt="" />
                                                        <span>{member.first_name}</span>
                                                        <FontAwesomeIcon onClick={() => removeShare(member.id)} icon={faXmark} />
                                                    </li>
                                                ))}
                                                <input onChange={(e) => setSearchTerm(e.target.value)} type="text" spellCheck="false" placeholder='Share this file with other members' />
                                            </ul>
                                        </div>
                                        <div>
                                            <ul className='searchMemberList'>
                                                {members && members.map((member: any, index) => (
                                                    <li key={`member` + index} onClick={() => shareList(member)}>
                                                        <img src={`${API}/${member.member_image}`} alt="" />
                                                        <span>{member.first_name}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

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

export default UploadFile