import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Page/Login/Login';
import Member from './Page/Member/Member';
import Spaces from './Page/Spaces/Spaces';
import Announcement from './Page/Announcement/Announcement';
import Files from './Page/Files/Files';
import Ticket from './Page/Ticket/Ticket';
import Chat from './Page/Chat/Chat';
import Messenger from './Page/Messenger/Messenger';
import Billing from './Page/Billing/Billing';

const Routing = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    {/* <Route element={<PrivateRoute />}>
                        <Route path="/dashboard" element={<Dashboard />}></Route>
                    </Route> */}
                    {/* login */}
                    <Route path="/" element={<Login />}></Route>
                    <Route path="/member" element={<Member />}></Route>
                    <Route path="/spaces" element={<Spaces />}></Route>
                    <Route path="/announcements" element={<Announcement />}></Route>
                    <Route path="/files" element={<Files />}></Route>
                    <Route path="/tickets" element={<Ticket />}></Route>
                    <Route path="/chat" element={<Chat />}></Route>
                    <Route path="/messenger" element={<Messenger />}></Route>
                    <Route path="/billing" element={<Billing />}></Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default Routing