import React, { useState, useEffect } from 'react'
import { ToastContainer } from 'react-toastify';
import { Col, Container, Dropdown, Modal, Row } from 'react-bootstrap';
import memberIcon from "../../Assets/Images/icon/member.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faChevronDown, faXmark } from '@fortawesome/free-solid-svg-icons';
import avatar from "../../Assets/Images/icon/inputAvatar.png";
import imageInput from "../../Assets/Images/icon/imgButton.png";
import { singleSpaces, spacesAdd } from '../../api/spaces';
import { showNotifications } from '../../CommonFunction/toaster';
import { DOCOTEAM_API as API } from '../../config';

interface ViewSpacesProps {
    spacesId: string;
    handleSpacesClose: () => void;
    spacesShow: boolean;
    setSpacesShow: (type: boolean) => void;
}

const ViewSpaces = ({ spacesId, spacesShow, setSpacesShow, handleSpacesClose }: ViewSpacesProps) => {

    const [name, setName] = useState("");
    const [notes, setNotes] = useState("");
    const [rate, setRate] = useState("");
    const [size, setSize] = useState("");
    const [spaceImage, setSpaceImage] = useState("");
    const [tag, setTag] = useState("");


    useEffect(() => {
        singleSpaces(spacesId).then((data) => {
            setName(data.data && data.data.name);
            setNotes(data.data && data.data.notes);
            setRate(data.data && data.data.rate);
            setSize(data.data && data.data.size);
            setSpaceImage(data.data && data.data.space_image);
            setTag(data.data && data.data.tag);
        })
    }, [spacesId]);

    return (
        <>
            <Modal show={spacesShow} onHide={handleSpacesClose} centered size="lg">
                <ToastContainer />

                <div className="addMemberForm">
                    <button className='closeModal' onClick={handleSpacesClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <Container>
                        <Row>
                            <Col md={12}>
                                <div className='addMemberHeading'>
                                    <img src={memberIcon} alt="member" />
                                    <p>Spaces Information</p>
                                </div>
                            </Col>
                        </Row>
                        {/* <form ref={form} onSubmit={handleSubmit(onSubmit)}> */}
                        <Row>
                            <Col md={2} className='inputFieldSidebar'>
                                <div className="imageUpload">
                                    <div className="upload">
                                        <img src={`${API}/${spaceImage}`} width="100px" height="100px" alt="shop" />
                                    </div>
                                </div>
                            </Col>
                            <Col md={10}>
                                <Row>
                                    <Col md={6}>
                                        <div className="memberInput">
                                            <label>Name</label>
                                            <input type="text" value={name} placeholder='Name' className='form-control' />
                                        </div>
                                        <div className="memberInput rate">
                                            <span>$</span>
                                            <label>Rate</label>
                                            <input type="number" value={rate} placeholder='Rate' className='form-control' />
                                            <button>USD</button>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="memberInput sizeInput">
                                            <label>Size</label>
                                            <input type="number" value={size} placeholder='Size' className='form-control' />
                                            <button>Sqrt</button>
                                        </div>
                                        <div className="memberInput">
                                            <label>Tag (Type)</label>
                                            <Dropdown>
                                                <Dropdown.Toggle variant="" className="custom-toggle">
                                                {tag === "private" ? "Private Office" : tag === "dedicated" ? "Dedicated Desk" : tag === "flex" ? "Flex" : ""}
                                                </Dropdown.Toggle>
                                            </Dropdown>
                                            <button>
                                                <FontAwesomeIcon icon={faChevronDown} />
                                            </button>
                                        </div>
                                    </Col>
                                    <Col md={12}>
                                        <div className="memberInput">
                                            <label>Notes</label>
                                            <input type="text" value={notes} placeholder='Notes' className='form-control' />
                                        </div>
                                    </Col>
                                </Row>
                            </Col>

                            <div className="memberAddBtn">
                                <button type='submit' className='save'>Save</button>
                            </div>
                        </Row>
                        {/* </form> */}
                    </Container>
                </div>
            </Modal>
        </>
    )
}

export default ViewSpaces