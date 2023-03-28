import React, { useState, useEffect } from 'react'
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import { VStack } from "@chakra-ui/layout";
import { useToast } from '@chakra-ui/react';
import axios from "axios"
import { useNavigate } from "react-router-dom"
const Login = () => {
    const navigate = useNavigate()


    const toast = useToast()
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [picLoading, setPicLoading] = useState(false);
    const submitHandler = async () => {
        setPicLoading(true);


        if (!email || !password) {
            toast({ title: "Please Fill all the Feilds", status: "warning", duration: 5000, isClosable: true, position: "bottom", });
            setPicLoading(false);
            return;
        }
        // console.log({ email: email, password: password });
        try {

            const { data } = await axios.post("/api/user/login", { email: email, password: password });
            // console.log(data);
            toast({ title: "Login Successful", status: "success", duration: 5000, isClosable: true, position: "bottom" });
            localStorage.setItem("user-info", data.token);
            setPicLoading(false);
            navigate("/chats", { replace: true })

        } catch (error) {
            toast({ title: "Error Occured!", description: error.response.data.message, status: "error", duration: 5000, isClosable: true, position: "bottom", });
            setPicLoading(false);
        }

    }
    useEffect(() => {
        if (localStorage.getItem("user-info")) navigate("/chats", { replace: true })
// eslint-disable-next-line
    }, [])

    return (
        <VStack spacing="5px">
            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input type="email" placeholder={email? email:"Enter Your Email Address"} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size="md">
                    <Input type={show ? "text" : "password"} placeholder={password ? password : 'enter your Password' } onChange={(e) => setPassword(e.target.value)} />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button colorScheme="blue" width="100%" style={{ marginTop: 15 }} onClick={submitHandler} isLoading={picLoading}>Login</Button>
            <Button variant="solid" colorScheme="red" width="100%" onClick={() => { setEmail("guest@example.com"); setPassword("Guests1$"); }} isLoading={picLoading}>
               Use Guest Credentials
            </Button>
        </VStack>
    )
}

export default Login
// email
// :
// "vishnu@gmail.com"
// name
// :
// "viznu"
// password
// :
// "Appam123$"