import React from 'react'
import Login from "../Components/Login"
import Register from "../Components/Register"
import Google from '../Components/Google'
import { Container, Box, Text, Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react"
const Home = () => {

    return (

        <Container maxW="x1" centerContent>
            <Box d="flex" alignContent={"center"} p={3} bg={"white"} w="auto" m="40px 0 15px 0" borderRadius="30" borderWidth="1px">
                <Text fontSize="4xl" fontFamily="mono">Chit_Chats</Text>
            </Box>
            <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
                <Tabs isFitted variant="soft-rounded">
                    <TabList mb="1em">
                        <Tab>Login</Tab>
                        <Tab>Register</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <Register />
                        </TabPanel>
                    </TabPanels>
                    <Google />
                </Tabs>
            </Box>
        </Container>

    )
}

export default Home
