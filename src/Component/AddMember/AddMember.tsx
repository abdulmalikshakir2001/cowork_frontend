import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';
import { Col, Container, Modal, Row } from 'react-bootstrap';
import "./AddMember.css";
import { memberAdd } from '../../api/member';
import { showNotifications } from '../../CommonFunction/toaster';
import { v4 as uuidv4 } from 'uuid';
import memberIcon from "../../Assets/Images/icon/member.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import avatar from "../../Assets/Images/icon/inputAvatar.png";
import imageInput from "../../Assets/Images/icon/imgButton.png";

interface AddMemberProps {
    handleClose: () => void;
    show: boolean;
    setShow: (type: boolean) => void;
}

const AddMember = ({ show, setShow, handleClose }: AddMemberProps) => {
    const [file, setFile] = useState("");
    const [imageKey, setImageKey] = useState("");
  
    function handleChange(e: any) {
        setFile(URL.createObjectURL(e.target.files[0]));
        setImageKey(e.target.files[0]);
    }
    const form = useRef(null);
    const { handleSubmit, register, setValue } = useForm();

    let onSubmit = () => {
        if (form.current) {
            const member = new FormData(form.current);
            member.append('id', uuidv4());
            member.append('member_image', imageKey);
            memberAdd(member).then((data) => {
                if (data.statusCode !== 201) {
                    showNotifications('error', 'Wrong information');
                }
                else {
                    showNotifications('success', 'Member add successfully');
                    setValue('firstName', "")
                    setValue('firstName', "")
                    setValue('lastName', "")
                    setValue('phoneNumber', "")
                    setValue('email', "")
                    setValue('businessName', "")
                    setValue('businessPhone', "")
                    setValue('businessEmail', "")
                    setValue('notes', "")
                    setFile("")
                }
                 setShow(false)
            })
        }

        
    }
    return (
        <>
            <Modal show={show} onHide={handleClose} centered size="lg">
                <ToastContainer />

                <div className="addMemberForm">
                    <button className='closeModal' onClick={handleClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <Container>
                        <Row>
                            <Col md={12}>
                                <div className='addMemberHeading'>
                                    <img src={memberIcon} alt="member" />
                                    <p>Add Member</p>
                                </div>
                            </Col>
                        </Row>
                        <form ref={form} onSubmit={handleSubmit(onSubmit)}>
                            <Row>
                                <Col md={2} className='inputFieldSidebar'>
                                    <div className="imageUpload">
                                        <div className="upload">
                                            {file && file.length > 0 ? <img src={file} width="100px" height="100px" alt="shop" />
                                                : <img src={avatar} alt="" />
                                                }
                                            <div className="round">
                                                <input type="file" onChange={handleChange} required />
                                                <img src={imageInput} alt="profile" />
                                            </div>
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
                                                <input type="text" {...register("firstName", { required: true })} placeholder='First Name' className='form-control' required />
                                            </div>
                                            <div className="memberInput">
                                                <label>Phone Number</label>
                                                <input type="text" {...register("phoneNumber", { required: true })} placeholder='First Name' className='form-control' required />
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="memberInput">
                                                <label>Last Name</label>
                                                <input type="text" {...register("lastName", { required: true })} placeholder='Last Name' className='form-control' required />
                                            </div>
                                            <div className="memberInput">
                                                <label>Email</label>
                                                <input type="email" {...register("email", { required: true })} placeholder='Email' className='form-control' required />
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
                                                <input type="text" {...register("businessName", { required: true })} placeholder='Business Name' className='form-control' required />
                                            </div>
                                            <div className="memberInput">
                                                <label>Business Email</label>
                                                <input type="email" {...register("businessEmail", { required: true })} placeholder='Business Email' className='form-control' required />
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="memberInput">
                                                <label>Business Phone</label>
                                                <input type="text" {...register("businessPhone", { required: true })} placeholder='Business Phone' className='form-control' required />
                                            </div>
                                            <div className="memberInput">
                                                <label>Notes</label>
                                                <input type="text" {...register("notes", { required: true })} placeholder='Notes' className='form-control' required />
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>

                                <div className="memberAddBtn">
                                    <button type='submit' className='save'>Save</button>
                                </div>
                            </Row>
                        </form>
                    </Container>
                </div>
            </Modal>
        </>
    )
}

export default AddMember