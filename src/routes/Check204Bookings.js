import React, { useState } from 'react';
import { useToast, Center, Heading, Flex, VStack, Textarea, Button, Text, HStack, TableContainer, Table, Thead, Tr, Th, Tbody, Td, TableCaption } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { ColorModeSwitcher } from '../ColorModeSwitcher';

function Check204Bookings() {

  const [textAreaValue, setTextAreaValue] = useState("");
  const [bookings200, setBookings200] = useState([]);
  const [bookings204Valid, setBookings204Valid] = useState([]);
  const [bookings204Invalid, setBookings204Invalid] = useState([]);
  const toaster = useToast();

  const handleTextAreaChange = (event) => {
    setTextAreaValue(event.target.value);
  };

  const handleSubmit = () => {

    if (textAreaValue.trim() === "") {
      toaster({
        description: "Please enter a JSON payload",
        status: 'error',
        duration: 4000,
        position: 'top',
        isClosable: true,
      })
    } else if (!validateJSON(textAreaValue.trim())) {
      toaster({
        description: "The JSON payload provided is not valid",
        status: 'error',
        duration: 4000,
        position: 'top',
        isClosable: true,
      })
    } else {

      let JSONdata = JSON.parse(textAreaValue);
      const hits = JSONdata.hits.hits;
      const tableBookings200 = hits.map(item => {
        const workerID = item._source.path.split('/booking/')[1]; // Extract Worker ID
        const status = item._source.status; // Get Status
        if (status === "200") {
          return {
            workerID,
            status
          }
        }
      });

      const tableBookings204Valid = hits.map(item => {
        const workerID = item._source.path.split('/booking/')[1]; // Extract Worker ID
        const status = item._source.status; // Get Status
        if (status === "204" && isMyPassID(workerID) === true) {
          return {
            workerID,
            status
          }
        }
      });

      const tableBookings204Invalid = hits.map(item => {
        const workerID = item._source.path.split('/booking/')[1]; // Extract Worker ID
        const status = item._source.status; // Get Status
        if (status === "204" && isMyPassID(workerID) === false) {
          return {
            workerID,
            status
          }
        }
      });

      setBookings200(tableBookings200);
      setBookings204Valid(tableBookings204Valid);
      setBookings204Invalid(tableBookings204Invalid);

    }
  }

  const handleClear = () => {
    setTextAreaValue("");
    setBookings200([]);
  }

  const validateJSON = (str) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  const isMyPassID = (workerID) => {
    // Regular expression to match worker ID starting with any letter except 'MA' followed by digits
    const regex = /^MA\d+$/;
    return !regex.test(workerID);
  }

  return (
    <Flex p="1em" minHeight={"100vh"} alignContent={"center"} justifyContent={"center"}>
      <Center flexDirection={"column"}>
        <Text as="b">
          <Link className="hoverable-link" to="/">HOME</Link>
        </Text>
        <ColorModeSwitcher />
        <VStack marginBottom="1.5em" spacing={3}>
          <Heading>Check 204 Bookings</Heading>
          <Text color="gray.500">Enter the Kibana JSON payload of the booking endpoint below</Text>
          <Textarea
            value={textAreaValue}
            onChange={handleTextAreaChange}
            resize="none"
            rows="10" />
          <HStack>
            <Button onClick={handleClear}>Clear</Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </HStack>
          {
            bookings200.length > 0
            &&
            <HStack spacing={10}>
              <TableContainer>
                <Table variant="simple" size="sm">
                  <TableCaption placement="top">200 Status</TableCaption>
                  <Thead>
                    <Tr>
                      <Th><Text align="center">Worker ID</Text></Th>
                      <Th><Text align="center">Status</Text></Th>
                      <Th><Text align="center">Is LMS ID?</Text></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {
                      bookings200.map(item => (
                        <Tr key={item.workerID} _hover={{ backgroundColor: 'gray.300' }}>
                          <Td><Text fontSize="xs" align="center">{item.workerID}</Text></Td>
                          <Td><Text color={(item.status === "200") ? "green" : "red"} fontSize="xs" align="center">{item.status}</Text></Td>
                          <Td>
                            <Text fontSize="xs" align="center">
                              {
                                (isMyPassID(item.workerID)) ? "No" : "Yes"
                              }
                            </Text>
                          </Td>
                        </Tr>
                      ))
                    }
                  </Tbody>
                </Table>
              </TableContainer>
              <TableContainer>
                <Table variant="simple" size="sm">
                  <TableCaption placement="top">204 Status</TableCaption>
                  <Thead>
                    <Tr>
                      <Th><Text align="center">Worker ID</Text></Th>
                      <Th><Text align="center">Status</Text></Th>
                      <Th><Text align="center">Is LMS ID?</Text></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {
                      bookings200.map(item => (
                        <Tr key={item.workerID} _hover={{ backgroundColor: 'gray.300' }}>
                          <Td><Text fontSize="xs" align="center">{item.workerID}</Text></Td>
                          <Td><Text color={(item.status === "200") ? "green" : "red"} fontSize="xs" align="center">{item.status}</Text></Td>
                          <Td>
                            <Text fontSize="xs" align="center">
                              {
                                (isMyPassID(item.workerID)) ? "No" : "Yes"
                              }
                            </Text>
                          </Td>
                        </Tr>
                      ))
                    }
                  </Tbody>
                </Table>
              </TableContainer>
            </HStack>
          }
        </VStack>
      </Center>
    </Flex>
  );
}

export default Check204Bookings;
