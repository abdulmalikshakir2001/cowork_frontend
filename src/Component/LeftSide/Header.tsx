import React from 'react';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import bell from "../../Assets/Images/icon/bell-01.png";
import circle from "../../Assets/Images/icon/info-circle.png";
import avatar from "../../Assets/Images/icon/Avatar.png";
import arrow from "../../Assets/Images/icon/downIcon.png";
import { Dropdown } from 'react-bootstrap';



import { useAppSelector } from '../../lib/hooks';
import { selectAuthUser } from '../../lib/features/authUser/authUserSlice';
import { useLocation } from 'react-router-dom';



const Header = ({ onValueChange }: any) => {
    const [collapsed, setCollapsed] = React.useState(false);
    const handleClick = () => {
        setCollapsed(!collapsed)
        onValueChange(collapsed);
    };

    const location = useLocation();
    const pathArray = location.pathname.split('/');
    const urlParams = pathArray[pathArray.length - 1];
    const currentUser =  useAppSelector(selectAuthUser);
    return (
        <>
            <div className='topNavbar'>
                <div className='contentHeading'>
                    <button className="sb-button" onClick={handleClick}><FontAwesomeIcon icon={faBars} /></button>
                    {urlParams === "member" ? <p>Members</p> : ""} 
                    {urlParams === "spaces" ? <p>Spaces</p> : ""} 
                    {urlParams === "files" ? <p>Files</p> : ""}
                    {urlParams === "tickets" ? <p>Ticket</p> : ""}
                </div>
                <div className='rightNavbar'>
                    <button><img src={circle} alt="circle" /></button>
                    <button><img src={bell} alt="bell" /></button>
                    <button><img src={avatar} alt="avatar" /></button>
                    <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic">
                            {currentUser.name} <img src={arrow} alt="arrow" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item href="#">Profile</Dropdown.Item>
                            <Dropdown.Item href="#">Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
        </>
    )
}

export default Header