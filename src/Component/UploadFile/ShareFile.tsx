import React, { useState, useEffect } from 'react'
import { ToastContainer } from 'react-toastify';
import { Col, Container, Modal, Row } from 'react-bootstrap';
import folder from "../../Assets/Images/icon/folder.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { searchMember } from '../../api/member';
import { DOCOTEAM_API as API } from '../../config';
import avatar from "../../Assets/Images/icon/Avatar.png";
import { showNotifications } from '../../CommonFunction/toaster';
import { shareUpdate } from '../../api/files';

interface ShareFileProps {
    handleShareClose: () => void;
    shareShow: boolean;
    setShareShow: (type: boolean) => void;
    filesId: string;
}

const ShareFile = ({filesId, shareShow, setShareShow, handleShareClose }: ShareFileProps) => {

    const [members, setMembers] = useState([]);
    const [shares, setShares] = useState<any>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {

        searchMember(searchTerm).then((data) => {
            setMembers(data.results);
        });

    }, [searchTerm]);

    const shareList = (share: any) => {
        const shareExists = shares.some((existingShare: any) => existingShare.id === share.id);
        if (!shareExists) {
            setShares([...shares, share]);
        } else {
            showNotifications('error', 'Share already exists in the list');
        }
    }

    const removeShare = (memberId: string) => {
        setShares((prevShares: any) => prevShares.filter((item: any) => item.id !== memberId));
    }


    const updateShares = () => {
        if (shares) {
            const ids = shares.map((obj:any) => obj.member_image);
            const share = `${ids}`;
            shareUpdate(filesId,{share}).then((data) => {
                if (data.statusCode !== 200) {
                    showNotifications('error', data.message);
                }
                else {
                    showNotifications('success', 'Share added successfully');
                    setShareShow(false);
                    setShares([]);
                    setMembers([]);
                }
            })
        }
       
    }

    return (
        <>
            <Modal show={shareShow} onHide={handleShareClose} centered size="lg">
                <ToastContainer />
                <div className="addMemberForm">
                    <button className='closeModal' onClick={handleShareClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <Container>
                        <Row>
                            <Col md={12}>
                                <div className='addMemberHeading'>
                                    <img src={folder} alt="member" />
                                    <p>Share File</p>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>


                                <div className="sharing">
                                    <p>Sharing With:</p>
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
                                    <button className='btn save' type='submit' onClick={updateShares}>Save</button>
                                </div>
                            </Col>
                        </Row>

                    </Container>
                </div>
            </Modal>
        </>
    )
}

export default ShareFile