import React, { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';
import { Col, Container, Modal, Row } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import memberIcon from "../../Assets/Images/icon/member.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { singleMember } from '../../api/member';
import { DOCOTEAM_API as API } from '../../config';

interface ViewMemberProps {
    memberId: string;
    handleMemberClose: () => void;
    memberShow: boolean;
    setMemberShow: (type: boolean) => void;
}

const ViewMember = ({ memberId, memberShow, setMemberShow, handleMemberClose }: ViewMemberProps) => {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [businessEmail, setBusinessEmail] = useState("");
    const [businessPhone, setBusinessPhone] = useState("");
    const [notes, setNotes] = useState("");
    const [memberImage, setMemberImage] = useState("");

    useEffect(() => {
        singleMember(memberId).then((data) => {
            setFirstName(data.data && data.data.first_name);
            setLastName(data.data && data.data.last_name);
            setPhoneNumber(data.data && data.data.phone_number);
            setEmail(data.data && data.data.email);
            setBusinessName(data.data && data.data.business_name);
            setBusinessEmail(data.data && data.data.business_email);
            setBusinessPhone(data.data && data.data.business_phone);
            setNotes(data.data && data.data.notes);
            setMemberImage(data.data && data.data.member_image);
        })
    }, [memberId]);
    return (
        <>
            <Modal show={memberShow} onHide={handleMemberClose} centered size="lg">
                <ToastContainer />
                <div className="addMemberForm">
                    <button className='closeModal' onClick={handleMemberClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <Container>
                        <Row>
                            <Col md={12}>
                                <div className='addMemberHeading'>
                                    <img src={memberIcon} alt="member" />
                                    <p>Member Information</p>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={2} className='inputFieldSidebar'>
                                <div className="imageUpload">
                                    <div className="upload">
                                        <img src={`${API}/${memberImage}`} width="100px" height="100px" alt="shop" />
                                    </div>
                                </div>
                            </Col>
                            <Col md={10}>
                                <Row>
                                    <Col md={12}>
                                        <div className="inputHeading">
                                            <p>Personal</p>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="memberInput">
                                            <label>First Name</label>
                                            <input type="text" value={firstName} placeholder='First Name' className='form-control' />
                                        </div>
                                        <div className="memberInput">
                                            <label>Phone Number</label>
                                            <input type="text" value={phoneNumber} placeholder='Phone Number' className='form-control' />
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="memberInput">
                                            <label>Last Name</label>
                                            <input type="text" value={lastName} placeholder='Last Name' className='form-control' />
                                        </div>
                                        <div className="memberInput">
                                            <label>Email</label>
                                            <input type="email" value={email} placeholder='Email' className='form-control' />
                                        </div>
                                    </Col>
                                    <Col md={12}>
                                        <div className="inputHeading mt-4">
                                            <p>Business</p>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="memberInput">
                                            <label>Business Name</label>
                                            <input type="text" value={businessName} placeholder='Business Name' className='form-control' />
                                        </div>
                                        <div className="memberInput">
                                            <label>Business Email</label>
                                            <input type="email" value={businessEmail} placeholder='Business Email' className='form-control' />
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="memberInput">
                                            <label>Business Phone</label>
                                            <input type="text" value={businessPhone} placeholder='Business Phone' className='form-control' />
                                        </div>
                                        <div className="memberInput">
                                            <label>Notes</label>
                                            <input type="text" value={notes} placeholder='Notes' className='form-control' />
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </Modal>
        </>
    )
}

export default ViewMember