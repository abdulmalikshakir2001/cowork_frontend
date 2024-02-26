import React, { useState, useEffect } from 'react'
import { Dropdown, Table } from 'react-bootstrap';
import "./Spaces.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import Layout from '../../Component/Layout/Layout';
import { DOCOTEAM_API as API } from '../../config';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import AddSpace from '../../Component/AddSpace/AddSpace';
import filter from '../../Assets/Images/icon/filter-lines.png';
import { getSpacesList } from '../../api/spaces';
import ViewSpaces from '../../Component/ViewSpaces/ViewSpaces';
import editPen from "../../Assets/Images/icon/edit-01.png"
import EditSpaces from '../../Component/ViewSpaces/EditSpaces';

const Spaces = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [spacesShow, setSpacesShow] = useState(false);
    const handleSpacesClose = () => setSpacesShow(false);
    const handleSpacesShow = () => setSpacesShow(true);
    const [spaces, setSpaces] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [spacesId, setSpacesId] = useState('');
    const [updateShow, setUpdateShow] = useState(false);
    const handleUpdateClose = () => setUpdateShow(false);
    const handleUpdateShow = () => setUpdateShow(true);

    // pagination state
    function multiplyBySixAndShowSeries(originalValue: number) {
        if (originalValue <= 2) {
            return [originalValue];
        }

        const resultArray = Array.from({ length: Math.ceil(originalValue / 2) }, (_, index) => {
            const calculatedValue = 2 * (index + 1);
            return calculatedValue <= originalValue ? calculatedValue : originalValue;
        });

        return resultArray;
    }
    const [totalValue, setTotalValue] = useState<any>();
    const [limitValue, setLimitValue] = useState<any>();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState<number>(2);
    const pageCount = Math.ceil(totalValue / limitValue);
    const [prevButton, setPrevButton] = useState<boolean>(false);
    const [nextButton, setNextButton] = useState<boolean>(false);
    const [resultLength, setResultLength] = useState<number>(0);
    const limitDivided = multiplyBySixAndShowSeries(totalValue)
    const [selectedValue, setSelectedValue] = useState(limit);

    useEffect(() => {
        getSpacesList(limit, page).then((data) => {
            if (data.statusCode !== 200) {

            }
            else {
                setSpaces(data && data.spaces);
                setResultLength(data.spaces && data.spaces.length);
                setTotalValue(data && data.total);
                setLimitValue(data && data.limit);
            }
        });
        // pagination
        if (pageCount > 1) {
            setPrevButton(true)
        }
        if (page === 1) {
            setPrevButton(false)
        }
        // next button
        if (pageCount > 1) {
            setNextButton(true)
        }
        if (pageCount === page) {
            setNextButton(false)
        }
    }, [show, page, totalValue, limitValue, limit, updateShow]);

    // pagination
    const nextPage = (pageNumber: number) => {
        setPage(page + pageNumber)
        setNextButton(true)
    }
    const prevPage = (pageNumber: number) => {
        setPage(page - pageNumber)
    }
    const showResult = (value: number) => {
        setPage(1)
        setLimit(value)
    }

// view
    const spacesView = (spacesId: string) => {
        setSpacesId(spacesId);
        setSpacesShow(true);
    }
    // update spaces
    const spacesUpdate = (spacesId: string) => {
        setSpacesId(spacesId);
        setUpdateShow(true);
    }
    // search
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredSpaces = spaces?.filter((member: any) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // pagination number

    const numbers = [1, 2, 3, 4, 5, 10, 20, 50, 100];

    const handleSelect = (selectedValue: any) => {
        const integerValue = parseInt(selectedValue);
        showResult(integerValue);
        setSelectedValue(selectedValue);
    };

    return (
        <>
            <Layout>
                <div className='mainContent'>
                    <div className="memberBox">
                        <div className="topLine">
                            <div className='tableHeading'>
                                <h6>All Assets</h6>
                            </div>
                            <div className='memberSearch'>
                                <div className='searchInput'>
                                    <input type="text" placeholder='Search assets' onChange={handleInputChange} className='form-control' />
                                    <FontAwesomeIcon icon={faSearch} />
                                </div>
                                 <button className='filterBtn'><img src={filter} alt='filter' /> Filter</button> 
                                <button onClick={handleShow}><FontAwesomeIcon icon={faPlus} /> Add Asset</button>
                            </div>
                        </div>

                        <div className="spaceList">
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th><label className="tableCheckBox">
                                            <div className="contactCheck">
                                                <input type="checkbox" name="agreement" />
                                                <span className="checkmark"></span></div>
                                        </label></th>
                                        <th></th>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Rate</th>
                                        <th>Status</th>
                                        <th>Assignment</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSpaces && filteredSpaces.map((data: any, index) => <tr key={`refer` + index}>
                                        <td><label className="tableCheckBox">
                                            <div className="contactCheck">
                                                <input type="checkbox" name="agreement" />
                                                <span className="checkmark"></span></div>
                                        </label></td>
                                        <td><img src={`${API}/${data.space_image}`} alt="avatar" style={{ borderRadius: "50%" }} /></td>
                                        <td>{data.name}</td>
                                        <td className='deskType'>
                                            {data.tag === "private" ? <span className='private'>Private Office</span> : ""}
                                            {data.tag === "dedicated" ? <span className='dedicated'>Dedicated Desk</span> : ""}
                                            {data.tag === "flex" ? <span className='flex'>Flex</span> : ""}
                                        </td>
                                        <td>${data.rate}/mo</td>
                                        <td className='status'>
                                           <span className='unavailable'>Unavailable</span> 
                                            {/* <span className='available'>Available</span> */}
                                        </td>
                                        <td className='tableAction'><button className='btn assign'>Assign</button></td>
                                        <td className='tableAction'>
                                            <button className='btn view' onClick={() => spacesView(data.id)}><FontAwesomeIcon icon={faEye} /></button>
                                            <button className='btn edit' onClick={() => spacesUpdate(data.id)}><img src={editPen} alt="edit" /></button>
                                        </td>
                                    </tr>)}
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

                        <AddSpace show={show} setShow={setShow} handleClose={handleClose} />
                        <ViewSpaces spacesId={spacesId} spacesShow={spacesShow} setSpacesShow={setSpacesShow} handleSpacesClose={handleSpacesClose} />
                    <EditSpaces spacesId={spacesId} updateShow={updateShow} setUpdateShow={setUpdateShow} handleUpdateClose={handleUpdateClose} />
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default Spaces