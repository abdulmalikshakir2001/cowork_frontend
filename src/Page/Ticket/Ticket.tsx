import React, { useState, useEffect } from 'react'
import { Dropdown, Table } from 'react-bootstrap';
import { getMemberList } from '../../api/member';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faArrowUp, faPen, faPencil, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import Layout from '../../Component/Layout/Layout';
import { DOCOTEAM_API as API } from '../../config';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import AddSpace from '../../Component/AddSpace/AddSpace';
import filter from '../../Assets/Images/icon/filter-lines.png';
import { getSpacesList } from '../../api/spaces';
import ViewSpaces from '../../Component/ViewSpaces/ViewSpaces';
import editPen from "../../Assets/Images/icon/edit-01.png"
import "./Ticket.css";

const Ticket = () => {
    const [selectedValue, setSelectedValue] = useState(0);
    const numbers = [1, 2, 3, 4, 5, 10, 20, 50, 100];

    const handleSelect = (selectedValue: any) => {
        const integerValue = parseInt(selectedValue);
        setSelectedValue(selectedValue);
    };
    return (
        <>
            <Layout>
                <div className='mainContent'>
                    <div className="memberBox">
                        <div className="topLine">
                            <div className='tableHeading'>
                                <h6>All Spaces</h6>
                            </div>
                            <div className='memberSearch'>
                                <div className='searchInput'>
                                    <input type="text" placeholder='Search ticket' className='form-control' />
                                    <FontAwesomeIcon icon={faSearch} />
                                </div>
                                <button className='filterBtn'><img src={filter} alt='filter' /> Filter</button>
                                <button><FontAwesomeIcon icon={faPlus} /> Add Ticket</button>
                            </div>
                        </div>

                        <div className="ticketList">
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th>
                                            <label className="tableCheckBox">
                                                <input type="checkbox" name="agreement" />
                                                <span className="checkmark"></span>
                                            </label>
                                        </th>
                                        <th>Ticket ID <FontAwesomeIcon icon={faArrowUp} /></th>
                                        <th>Name <FontAwesomeIcon icon={faArrowUp} /></th>
                                        <th>Updated <FontAwesomeIcon icon={faArrowUp} /></th>
                                        <th>Subject <FontAwesomeIcon icon={faArrowUp} /></th>
                                        <th>Status </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <label className="tableCheckBox">
                                                <input type="checkbox" name="agreement" />
                                                <span className="checkmark"></span>
                                            </label>
                                        </td>
                                        <td>#8763</td>
                                        <td>Kristin Watson</td>
                                        <td>January 26, 2024</td>
                                        <td>Leaky fucet in bathroom</td>
                                        <td className='status'>
                                            <span className='closed'>Closed</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><label className="tableCheckBox">
                                            <div className="contactCheck">
                                                <input type="checkbox" name="agreement" />
                                                <span className="checkmark"></span></div>
                                        </label></td>
                                        <td>#8763</td>
                                        <td>Kristin Watson</td>
                                        <td>January 26, 2024</td>
                                        <td>Leaky fucet in bathroom</td>
                                        <td className='status'>
                                            <span className='open'>Open</span>
                                        </td>
                                    </tr>
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
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default Ticket