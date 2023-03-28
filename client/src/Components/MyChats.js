import React from 'react'
import { ChatState } from '../Context/ChatProvider';
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import { useEffect } from "react";
import { Box, Stack, Text } from '@chakra-ui/react';
import { AddIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/button";
import ChatLoading from './ChatLoading';
import { useNavigate } from "react-router-dom";
import { getSender } from "../Logics/ChatLogics";
import GroupChatModal from "./Miscellaneous/GroupChatModal"
const MyChats = ({ fetchAgain }) => {
    const navigate = useNavigate()
    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
    const toast = useToast();
    const fetchChats = async () => {
        try {
            const { data } = await axios.get("/api/chat", { headers: { "user-info": localStorage.getItem("user-info") } });
            setChats(data);
        } catch (error) {
            console.log(error);
            toast({ title: "Error Occured!", description: "Failed to Load the chats", status: "error", duration: 5000, isClosable: true, position: "bottom-left", });
            localStorage.removeItem("user-info"); 
            navigate("/", { replace: true })
        }
    };
    useEffect(() => {
        fetchChats();
        // eslint-disable-next-line
    }, [fetchAgain]);
    return (
        <Box display={{ base: selectedChat ? "none" : "flex", md: "flex" }} flexDir="column" alignItems="center" p={3} bg="white" w={{ base: "100%", md: "31%" }} borderRadius="lg" borderWidth="1px" >
            <Box pb={3} px={3} fontSize={{ base: "20px", md: "22px" }} fontFamily="Work sans" display="flex" w="100%" justifyContent="space-between" alignItems="center"  >
                My Chats
                <GroupChatModal>
                    <Button display="flex"  fontSize={{ base: "17px", md: "10px", lg: "17px" }}   rightIcon={<AddIcon />} >  New Group Chat  </Button>
                </GroupChatModal>
            </Box>
            <Box display="flex" flexDir="column" p={3} bg="#F8F8F8" w="100%" h="100%" borderRadius="lg" overflowY="hidden" >
                {chats ? (
                    <Stack overflowY="scroll">
                        {chats.map((ele) =>
                            <Box key={ele._id} onClick={() => setSelectedChat(ele)} cursor="pointer" bg={selectedChat === ele ? "#38B2AC" : "#E8E8E8"} color={selectedChat === ele ? "white" : "black"}  px={3}   py={2} borderRadius="lg">

                                <Text> 
                                    {(!ele.isGroupChat) ? getSender(user, ele.participants) : ele.chatName}
                                  </Text>
                                {ele.latestMessage && (
                                    <Text fontSize="xs">
                                        <b>{ele.latestMessage.sender.name} : </b>
                                        {ele.latestMessage.content.length > 50 ? ele.latestMessage.content.substring(0, 51) + "..." : ele.latestMessage.content}
                                    </Text>
                                )}
                            </Box>
                        )}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>
        </Box>
    )
}

export default MyChats
