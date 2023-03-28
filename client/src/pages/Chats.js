
import Chatbox from "../Components/Chatbox";
import MyChats from "../Components/MyChats";
import SideDrawer from "../Components/Miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react"
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom"

const Chats = () => {
    const navigate = useNavigate()
    const [fetchAgain, setFetchAgain] = useState(false);
    const {user , setUser } = ChatState()
    const MainUser = async () => {
        try {
            const { data } = await axios.get("/api/user/mainUser", { headers: { "user-info": localStorage.getItem("user-info") } })
            setUser(data);
        } catch (error) {
            localStorage.removeItem("user-info"); 
            navigate("/", { replace: true })
            console.log(error);
        }
    }
    useEffect(() => {
        MainUser()
    }, [])
    return (
        <div style={{ width: "100%" }}>
         {  user?  <SideDrawer />: <></>}

            <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">

                {user ? <MyChats fetchAgain={fetchAgain} /> : <></>}
                {user ? <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /> : <></>}
            </Box>

        </div>

    )
}

export default Chats 
