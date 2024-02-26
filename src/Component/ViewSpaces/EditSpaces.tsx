import React, { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';
import { Col, Container, Dropdown, Modal, Row } from 'react-bootstrap';
// import "./AddMember.css";
import { v4 as uuidv4 } from 'uuid';
import memberIcon from "../../Assets/Images/icon/member.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faChevronDown, faXmark } from '@fortawesome/free-solid-svg-icons';
import avatar from "../../Assets/Images/icon/inputAvatar.png";
import imageInput from "../../Assets/Images/icon/imgButton.png";
import { singleSpaces, spacesAdd, updateSpaces } from '../../api/spaces';
import { showNotifications } from '../../CommonFunction/toaster';
import { DOCOTEAM_API as API } from '../../config';

interface EditSpacesProps {
    spacesId: string;
    handleUpdateClose: () => void;
    updateShow: boolean;
    setUpdateShow: (type: boolean) => void;
}


const EditSpaces = ({ spacesId, updateShow, setUpdateShow, handleUpdateClose }: EditSpacesProps) => {

    const [file, setFile] = useState("");
    const [imageKey, setImageKey] = useState("");
    const [name, setName] = useState("");
    const [notes, setNotes] = useState("");
    const [rate, setRate] = useState("");
    const [size, setSize] = useState("");
    const [spaceImage, setSpaceImage] = useState("");
    const [tag, setTag] = useState("");

    function handleChange(e: any) {
        setFile(URL.createObjectURL(e.target.files[0]));
        setImageKey(e.target.files[0]);
    }

    
    const handleSelect = (eventKey: string | null) => {
        if (eventKey) {
            setTag(eventKey);
        }
    };

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

    // update spaces info
    const spacesUpdate = () => {
        let spaces:any = {
            "name": name,
            "size": size,
            "rate": rate,
            "tag": tag,
            "notes ": notes,
        }
        if (imageKey) {
            spaces["space_image"] = imageKey;
          }
        updateSpaces(spacesId, spaces).then((data) => {
            console.log('update', data);
            setUpdateShow(false);
        })
    }

  return (
    <>
     <Modal show={updateShow} onHide={handleUpdateClose} centered size="lg">
                <ToastContainer />

                <div className="addMemberForm">
                    <button className='closeModal' onClick={handleUpdateClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <Container>
                        <Row>
                            <Col md={12}>
                                <div className='addMemberHeading'>
                                    <img src={memberIcon} alt="member" />
                                    <p>Update Spaces</p>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={2} className='inputFieldSidebar'>
                                <div className="imageUpload">
                                    <div className="upload">
                                        {file && file.length > 0 ? <img src={file} width="100px" height="100px" alt="shop" />
                                                :  <img src={`${API}/${spaceImage}`} width="100px" height="100px" alt="shop" />
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
                                    <Col md={6}>
                                        <div className="memberInput">
                                            <label>Name</label>
                                            <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder='Name' className='form-control' />
                                        </div>
                                        <div className="memberInput rate">
                                            <span>$</span>
                                            <label>Rate</label>
                                            <input type="number" value={rate} onChange={(e)=>setRate(e.target.value)} placeholder='Rate' className='form-control' />
                                            <button>USD</button>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="memberInput sizeInput">
                                            <label>Size</label>
                                            <input type="number" value={size} onChange={(e)=>setSize(e.target.value)} placeholder='Size' className='form-control' />
                                            <button>Sqrt</button>
                                        </div>
                                        <div className="memberInput">
                                            <label>Tag (Type)</label>
                                            <Dropdown onSelect={handleSelect}>
                                                <Dropdown.Toggle variant="" className="custom-toggle">
                                                    {tag === "private" ? "Private Office" : tag === "dedicated" ? "Dedicated Desk" : tag === "flex" ? "Flex" : ""}
                                                </Dropdown.Toggle>
                                                 <Dropdown.Menu>
                                                        <Dropdown.Item eventKey="private">Private Office</Dropdown.Item>
                                                        <Dropdown.Item eventKey="dedicated">Dedicated Desk</Dropdown.Item>
                                                        <Dropdown.Item eventKey="flex">Flex</Dropdown.Item>
                                                    </Dropdown.Menu> 
                                            </Dropdown>
                                            <button>
                                                <FontAwesomeIcon icon={faChevronDown} />
                                            </button>
                                        </div>
                                    </Col>
                                    <Col md={12}>
                                        <div className="memberInput">
                                            <label>Notes</label>
                                            <input type="text" value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder='Notes' className='form-control' />
                                        </div>
                                    </Col>
                                </Row>
                            </Col>

                            <div className="memberAddBtn">
                                <button type='submit' className='save' onClick={spacesUpdate}>Save</button>
                            </div>
                        </Row>
                    </Container>
                </div>
            </Modal>   
    </>
  )
}

export default EditSpaces