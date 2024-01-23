import React, { useState } from 'react';
import { useToast, Center, Heading, Flex, VStack, Textarea, Button, Text, HStack, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Alert, AlertIcon } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { ColorModeSwitcher } from '../ColorModeSwitcher';

function WatermarksChecker() {

  const [textAreaValue, setTextAreaValue] = useState("");
  const [watermarkRepetitions, setWatermarkRepetitions] = useState({});
  const [isIssue, setIsIssue] = useState(false);
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
      const occurrences200 = {};
      const occurrences499 = {};

      hits.forEach(hit => {
        const source = hit._source;
        const statusCode = source.status;
        const query = source.request_query.split('&');
        const watermarkParam = query.find(param => param.startsWith('watermark='));

        if (watermarkParam) {
          const watermarkValue = watermarkParam.split('=')[1];
          if (statusCode === '200') {
            occurrences200[watermarkValue] = (occurrences200[watermarkValue] || 0) + 1;
            if (occurrences200[watermarkValue] > 3) {
              setIsIssue(true);
            }
          } else if (statusCode === '499') {
            occurrences499[watermarkValue] = (occurrences499[watermarkValue] || 0) + 1;
            if (occurrences499[watermarkValue] > 3) {
              setIsIssue(true);
            }
          }
        }
      });

      console.log('Watermark occurrences with 200 status:');
      console.log(occurrences200);
      console.log('Watermark occurrences with 499 status:');
      console.log(occurrences499);

      setWatermarkRepetitions({ occurrences200, occurrences499 });
    }
  }

  const handleClear = () => {
    setTextAreaValue("");
    setWatermarkRepetitions({});
  }

  const validateJSON = (str) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  return (
    <Flex p="1em" minHeight={"100vh"} alignContent={"center"} justifyContent={"center"}>
      <Center flexDirection={"column"}>
        <Text as="b">
          <Link className="hoverable-link" to="/">HOME</Link>
        </Text>
        <ColorModeSwitcher />
        <VStack marginBottom="1.5em" spacing={3}>
          <Heading>Check Watermarks Repetition</Heading>
          <Text color="gray.500">Enter the JSON payload of the profile-sync's Kibana logs below</Text>
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
            Object.keys(watermarkRepetitions).length > 0
            &&
            ((isIssue) ?
              <Alert status='error'
                alignItems='center'
                justifyContent='center'
                textAlign='center'>
                <AlertIcon />
                An issue has been detected in profile-sync
              </Alert>
              :
              <Alert status='success'
                alignItems='center'
                justifyContent='center'
                textAlign='center'>
                <AlertIcon />
                No issue found in profile-sync
              </Alert>)
          }
          {
            Object.keys(watermarkRepetitions).length > 0
            &&
            <TableContainer>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th><Text align="center">Watermark</Text></Th>
                    <Th><Text align="center">200 Status</Text></Th>
                    <Th><Text align="center">499 Status</Text></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {
                    Object.keys(watermarkRepetitions.occurrences200).map(watermark => (
                      <Tr key={watermark} _hover={{ backgroundColor: 'gray.300' }}>
                        <Td><Text fontSize="xs">{`${watermark}`}</Text></Td>
                        <Td>
                          {
                            (watermarkRepetitions.occurrences200[watermark] > 3)
                              ?
                              <Text color="red" align="center" fontSize="xs">{`${watermarkRepetitions.occurrences200[watermark]} time(s)`}</Text>
                              :
                              <Text color="green" align="center" fontSize="xs">{`${watermarkRepetitions.occurrences200[watermark]} time(s)`}</Text>
                          }
                        </Td>
                        <Td>
                          {
                            (watermarkRepetitions.occurrences499[watermark] > 3)
                              ?
                              <Text color="red" align="center" fontSize="xs">{`${watermarkRepetitions.occurrences499[watermark]} time(s)`}</Text>
                              :
                              <Text color="green" align="center" fontSize="xs">{`${watermarkRepetitions.occurrences499[watermark] ?? 0} time(s)`}</Text>
                          }
                        </Td>
                      </Tr>
                    ))
                  }
                </Tbody>
              </Table>
            </TableContainer>
          }
        </VStack>
      </Center>
    </Flex>
  );
}

export default WatermarksChecker;
