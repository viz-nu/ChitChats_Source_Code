import React from 'react'
import axios from "axios";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, useDisclosure, FormControl, Input, useToast, Box, IconButton, Spinner, } from "@chakra-ui/react";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { ViewIcon } from "@chakra-ui/icons";

import UserBadgeItem from "../UserAvatar/UserBadgeItem"
import UserListItem from "../UserAvatar/UserListItem"



const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessage }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);
    const toast = useToast();

    const { selectedChat, setSelectedChat, user } = ChatState();

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/user/?search=${search}`, { headers: { "user-info": localStorage.getItem("user-info") } })
            setLoading(false);
            setSearchResult(data.users);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            setLoading(false);
        }
    };

    const handleRename = async () => {
        if (!groupChatName) return;
        try {
            setRenameLoading(true);
            const { data } = await axios.put(`/api/chat/rename`, { ChatId: selectedChat._id, chatNewName: groupChatName, }, { headers: { "user-info": localStorage.getItem("user-info") } });
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            toast({ title: "Error Occured!", description: error.response.data.message, status: "error", duration: 5000, isClosable: true, position: "bottom", });
            setRenameLoading(false);
        }




    };

    const handleAddUser = async (user1) => {

        if (selectedChat.participants.find((u) => u._id === user1._id)) {
            toast({ title: "User Already in group!", status: "error", duration: 5000, isClosable: true, position: "bottom", });
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast({ title: "Only admins can add someone!", status: "error", duration: 5000, isClosable: true, position: "bottom", });
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.put(`/api/chat/addPersonToGroup`, { ChatId: selectedChat._id, NewParticipant: user1._id });
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast({ title: "Error Occured!", description: error.response.data.message, status: "error", duration: 5000, isClosable: true, position: "bottom", });
            setLoading(false);
        }
    };

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({ title: "Only admins can remove someone!", status: "error", duration: 5000, isClosable: true, position: "bottom", });
            return;
        }
        try {
            setLoading(true);
            const { data } = await axios.put(`/api/chat/removePersonFromGroup`, { ChatId: selectedChat._id, BadParticipant: user1._id, });
            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessage();
            setLoading(false);

        } catch (error) {
            toast({ title: "Error Occured!", description: error.response.data.message, status: "error", duration: 5000, isClosable: true, position: "bottom", });
            setLoading(false);
        }
    };
    return (
        <>
            <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

            <Modal onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontSize="35px" fontFamily="Work sans" display="flex" justifyContent="center" >  {selectedChat.chatName} </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDir="column" alignItems="center">
                        <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                            {selectedChat.participants.map((u) => (<UserBadgeItem key={u._id} user={u} admin={selectedChat.groupAdmin} handleFunction={() => handleRemove(u)} />))}
                        </Box>
                        <FormControl display="flex">
                            <Input placeholder="Chat Name" mb={3} value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)} />
                            <Button variant="solid" colorScheme="teal" ml={1} isLoading={renameloading} onClick={handleRename}>  Update   </Button>
                        </FormControl>
                        <FormControl>
                            <Input placeholder="Add User to group" mb={1} onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>

                        {loading ? <Spinner size="lg" /> : (searchResult?.map((ele) => (<UserListItem key={ele._id} ele={ele} handleFunction={() => handleAddUser(ele)} />)))}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => handleRemove(user)} colorScheme="red"> Leave Group </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default UpdateGroupChatModal
