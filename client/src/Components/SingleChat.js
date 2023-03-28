import React, { useState, useEffect } from 'react'
import { ChatState } from "../Context/ChatProvider";
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from './Miscellaneous/ProfileModal';
import { getSender, getSenderFull } from '../Logics/ChatLogics';
import UpdateGroupChatModal from "./Miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import "./Styles.css";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import { io } from "socket.io-client"
import animationData from "../Animations/typing.json"

const ENDPOINT = "https://chat.viznu.dev/";
var socket, selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const toast = useToast()
    const [socketConnected, setSocketConnected] = useState(false);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };


    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, [user])


    useEffect(() => {
        fetchMessage();
        selectedChatCompare = selectedChat;
        // eslint-disable-next-line
    }, [selectedChat, fetchAgain])


    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                setFetchAgain(!fetchAgain);
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                }
            }
            else {
                setMessages([...messages, newMessageRecieved]);
            }
        });
    });


    const typingHandler = (e) => {

        if (!socketConnected) return;
        setNewMessage(e.target.value);
        setTyping(true);

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        setTimeout(() => {
            setTyping(false)
        }, 3000);
    }
    const fetchMessage = async () => {
        if (!selectedChat) return;
        try {
            const { data } = await axios.get(`/api/message/${selectedChat._id}`, { headers: { "user-info": localStorage.getItem("user-info") } });
            setMessages(data);
            setLoading(false);
            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            toast({ title: "Error Occured!", description: "Failed to load the Messages", status: "error", duration: 5000, isClosable: true, position: "bottom", });

        }
    }
    const sendMessage = async (e) => {
        if (e.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            setTyping(false);
            try {
                const { data } = await axios.post("/api/message", { content: newMessage, chatId: selectedChat }, { headers: { "user-info": localStorage.getItem("user-info") } });
                setNewMessage("");
                socket.emit("new message", data);

                setMessages([...messages, data]);
            } catch (error) {
                toast({ title: "Error Occured!", description: "Failed to send the Message", status: "error", duration: 5000, isClosable: true, position: "bottom", });

            }
        }
    }




    return (
        <>{selectedChat ? (<>
            <Text fontSize={{ base: "28px", md: "30px" }} pb={3} px={2} w="100%" fontFamily="Work sans" display="flex" justifyContent={{ base: "space-between" }} alignItems="center"  >
                <IconButton display={{ base: "flex", md: "none" }} icon={<ArrowBackIcon />} onClick={() => setSelectedChat("")} />
                {(!selectedChat.isGroupChat ? (
                    <>
                        {getSender(user, selectedChat.participants)}
                        <ProfileModal user={getSenderFull(user, selectedChat.participants)} />
                    </>) :
                    (<>
                        {selectedChat.chatName}
                        <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessage={fetchMessage} />
                    </>
                    ))}
            </Text>
            <Box display="flex" flexDir="column" justifyContent="flex-end" p={3} bg="#E8E8E8" w="100%" h="100%" borderRadius="lg" overflowY="hidden" >
                {loading ? (
                    <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
                ) : (
                    <div className="messages">
                        <ScrollableChat messages={messages} />
                    </div>
                )}

                <FormControl onKeyDown={sendMessage} id="first-name" isRequired mt={3}  >
                    {istyping ? (
                        <div>typing...
                            <Lottie options={defaultOptions} width={70} style={{ marginBottom: 15, marginLeft: 0 }} />
                        </div>
                    ) : (
                        <></>
                    )}
                    <Input variant="filled" autoComplete="off" bg="#E0E0E0" placeholder="Enter a message.." value={newMessage} onChange={typingHandler} />
                </FormControl>
            </Box>

        </>) : (
            <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                    Click on your friend to start chatting
                </Text>
            </Box>
        )}

        </>
    )
}

export default SingleChat

