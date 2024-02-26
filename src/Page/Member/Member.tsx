import React, { useState, useEffect } from 'react'
import AddMember from '../../Component/AddMember/AddMember';
import { Dropdown, Pagination, Table } from 'react-bootstrap';
import { getMemberList } from '../../api/member';
import "./Member.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faArrowUp, faEarDeaf, faPen, faPencil, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import Layout from '../../Component/Layout/Layout';
import { DOCOTEAM_API as API } from '../../config';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import ViewMember from '../../Component/ViewMember/ViewMember';
import editPen from "../../Assets/Images/icon/edit-01.png";
import EditMember from '../../Component/ViewMember/EditMember';

const Member = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [memberShow, setMemberShow] = useState(false);
  const handleMemberClose = () => setMemberShow(false);
  const handleMemberShow = () => setMemberShow(true);
  const [memberId, setMemberId] = useState("");
  const [member, setMember] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [updateShow, setUpdateShow] = useState(false);
  const handleUpdateClose = () => setUpdateShow(false);
  const handleUpdateShow = () => setUpdateShow(true);


  useEffect(() => {
    getMemberList().then((data) => {
      console.log('member',data);
      
      if (data.statusCode !== 200) {

      }
      else {
        setMember(data.members);
      }
    })
  }, [show,updateShow]);

  // member info view
  const memberView = (memberId: string) => {
    setMemberId(memberId);
    setMemberShow(true);
  }
   // member update view
   const memberUpdate = (memberId: string) => {
    setMemberId(memberId);
    setUpdateShow(true);
  }
  // pagination number
  const numbers = [1, 2, 3, 4, 5, 10, 20, 50, 100];
  const [selectedValue, setSelectedValue] = useState(numbers[0]);

  const handleSelect = (eventKey: string | null) => {
    if (eventKey) {
      setSelectedValue(parseInt(eventKey, 10));
    }
  };

  // search member


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredMembers = member.filter((member:any) =>
    member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Layout>
        <div className='mainContent'>
          <div className="memberBox">
            <div className="topLine">
              <div className='tableHeading'>
                <h6>All Members</h6>
              </div>
              <div className='memberSearch'>
                <div className='searchInput'>
                  <input type="text" placeholder='Search member' onChange={handleInputChange} className='form-control' />
                  <FontAwesomeIcon icon={faSearch} />
                </div>
                <button onClick={handleShow}><FontAwesomeIcon icon={faPlus} /> Add Member</button>
              </div>
            </div>

            <div className="memberList">
              <Table responsive hover>
                <thead>
                  <tr>
                    <th><label className="tableCheckBox">
                      <div className="contactCheck">
                        <input type="checkbox" name="agreement" />
                        <span className="checkmark"></span></div>
                    </label></th>
                    <th>Name <FontAwesomeIcon icon={faArrowUp} /></th>
                    <th>Email Address</th>
                    <th>Phone Number</th>
                    <th>Assignment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((data: any, index) => <tr key={`refer` + index}>
                    <td><label className="tableCheckBox">
                      <div className="contactCheck">
                        <input type="checkbox" name="agreement" />
                        <span className="checkmark"></span></div>
                    </label></td>
                    <td><img src={`${API}/${data.member_image}`} alt="avatar" style={{ borderRadius: "50%" }} /> {data.first_name} {data.last_name}</td>
                    <td>{data.email}</td>
                    <td>{data.phone_number}</td>
                    <td className='tableAction'><button className='btn assign'>Assign</button></td>
                    <td className='tableAction'>
                      <button className='btn view' onClick={() => memberView(data.id)}><FontAwesomeIcon icon={faEye} /></button>
                      <button className='btn edit' onClick={() => memberUpdate(data.id)}><img src={editPen} alt="edit" /></button>
                    </td>
                  </tr>)}
                </tbody>
              </Table>
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

            <AddMember show={show} setShow={setShow} handleClose={handleClose} />
            <ViewMember memberId={memberId} memberShow={memberShow} setMemberShow={setMemberShow} handleMemberClose={handleMemberClose} />
          <EditMember memberId={memberId} updateShow={updateShow} setUpdateShow={setUpdateShow} handleUpdateClose={handleUpdateClose} />
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Member