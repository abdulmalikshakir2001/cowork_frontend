import React, { useState, useEffect } from 'react'
import { Dropdown, Table } from 'react-bootstrap';
import "./Billing.css";
import Layout from '../../Component/Layout/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faDownload, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import filter from '../../Assets/Images/icon/filter-lines.png';
import avatar from "../../Assets/Images/icon/tableAvatar1.png";
import download from "../../Assets/Images/icon/download-01.png";
import send from "../../Assets/Images/icon/send.png";

const Billing = () => {
    const numbers = [1, 2, 3, 4, 5, 10, 20, 50, 100];
    const [limitValue, setLimitValue] = useState<any>();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState<number>(2);
    const [selectedValue, setSelectedValue] = useState(limit);
    const showResult = (value: number) => {
        setPage(1)
        setLimit(value)
    }
    const handleSelect = (selectedValue: any) => {
        const integerValue = parseInt(selectedValue);
        showResult(integerValue);
        setSelectedValue(selectedValue);
    };

    return (
        <>
            <Layout>
                <div className='mainContent'>
                    <div className="invoiceHeading">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb m-0 ms-2">
                                <li className="breadcrumb-item">Finances</li>
                                <li className="breadcrumb-item">Billing</li>
                                <li className="breadcrumb-item active" aria-current="page">All Invoices</li>
                            </ol>
                        </nav>
                    </div>

                    <div className="memberBox">
                        <div className="topLine">
                            <div className='tableHeading'>
                                <h6><FontAwesomeIcon icon={faArrowLeft} /> All Invoices</h6>
                            </div>
                            <div className='memberSearch'>
                                <div className='searchInput'>
                                    <input type="text" placeholder='Search billing' className='form-control' />
                                    <FontAwesomeIcon icon={faSearch} />
                                </div>
                                <button className='filterBtn'><img src={filter} alt='filter' /> Status</button>
                                <button><FontAwesomeIcon icon={faPlus} /> Create New Invoice</button>
                            </div>
                        </div>

                        <div className="billingList">
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th><label className="tableCheckBox">
                                            <div className="contactCheck">
                                                <input type="checkbox" name="agreement" />
                                                <span className="checkmark"></span></div>
                                        </label></th>
                                        <th>ID</th>
                                        <th>Member</th>
                                        <th>Assignment</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Amount</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><label className="tableCheckBox">
                                            <div className="contactCheck">
                                                <input type="checkbox" name="agreement" />
                                                <span className="checkmark"></span></div>
                                        </label></td>
                                        <td>#INV009</td>
                                        <td><img src={avatar} alt="avatar" style={{ borderRadius: "50%" }} /> Emma Clarkson</td>
                                        <td><img src={avatar} alt="avatar" style={{ borderRadius: "50%" }} /> Suite #102</td>
                                        <td>January 20, 2024</td>
                                        <td className='status'>
                                            <span className='paid'>Paid</span>
                                        </td>
                                        <td>$200.00</td>
                                        <td className='billingAction'>
                                            <button className='btn download' ><img src={download} alt="download" /></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><label className="tableCheckBox">
                                            <div className="contactCheck">
                                                <input type="checkbox" name="agreement" />
                                                <span className="checkmark"></span></div>
                                        </label></td>
                                        <td>#INV009</td>
                                        <td><img src={avatar} alt="avatar" style={{ borderRadius: "50%" }} /> Emma Clarkson</td>
                                        <td><img src={avatar} alt="avatar" style={{ borderRadius: "50%" }} /> Suite #102</td>
                                        <td>January 20, 2024</td>
                                        <td className='status'>
                                            <span className='unpaid'>Unpaid</span>
                                        </td>
                                        <td>$200.00</td>
                                        <td className='billingAction'>
                                            <button className='btn view' ><img src={send} alt="send" /></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><label className="tableCheckBox">
                                            <div className="contactCheck">
                                                <input type="checkbox" name="agreement" />
                                                <span className="checkmark"></span></div>
                                        </label></td>
                                        <td>#INV009</td>
                                        <td><img src={avatar} alt="avatar" style={{ borderRadius: "50%" }} /> Emma Clarkson</td>
                                        <td><img src={avatar} alt="avatar" style={{ borderRadius: "50%" }} /> Suite #102</td>
                                        <td>January 20, 2024</td>
                                        <td className='status'>
                                            <span className='draft'>Draft</span>
                                        </td>
                                        <td>$200.00</td>
                                        <td className='billingAction'>
                                            <button className='btn view' ><img src={send} alt="send" /></button>
                                        </td>
                                    </tr>
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
            </Layout>
        </>
    )
}

export default Billing