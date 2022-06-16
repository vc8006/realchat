import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,  
  DrawerCloseButton,
} from '@chakra-ui/react'
import { useDisclosure } from "@chakra-ui/hooks";
import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import UserListItem from '../user/UserListItem'
import ChatLoading from './ChatLoading'
import { Spinner } from "@chakra-ui/spinner";


const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {setSelectedChat,
    user,
    chats,
    setChats} = ChatState();

  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure()
  const history = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };


      const { data } = await axios.get(`/api/user?search=${search}`, config);

      // console.log(data)

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    // console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };


return (
  <>
      <Button colorScheme='teal' m={2} onClick={onOpen}>
        Search User
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Box align="center">
                <Button onClick={handleSearch} m={2}>Search</Button>
              </Box>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((cuser) => (
                <UserListItem
                  key={cuser._id}
                  user={cuser}
                  handleFunction={() => accessChat(cuser._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}

          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Button onClick={logoutHandler}>
        Logout
      </Button>
    </>
  )
}

export default SideDrawer