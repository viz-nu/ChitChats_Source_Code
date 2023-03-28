import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";

const UserListItem = ({ ele, handleFunction }) => {


    return (
        <Box onClick={handleFunction} cursor="pointer" bg="#E8E8E8" _hover={{ background: "#38B2AC", color: "white", }}
            w="100%" display="flex" alignItems="center" color="black" px={3} py={2} mb={2} borderRadius="lg" >
            <Avatar mr={2} size="sm" cursor="pointer" name={ele.name} src={ele.picture} />
            <Box>
                <Text>{ele.name}</Text>
                <Text fontSize="xs">  <b> {ele.email}</b>  </Text>
            </Box>
        </Box>
    );
};

export default UserListItem;
