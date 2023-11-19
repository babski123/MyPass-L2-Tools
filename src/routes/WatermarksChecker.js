import React, { useState } from 'react';
import { Center, Heading, Flex, VStack, Textarea, Button, Text, HStack } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../ColorModeSwitcher';

function WatermarksChecker() {

  const [textAreaValue, setTextAreaValue] = useState("");
  const [watermarkRepetitions, setWatermarkRepetitions] = useState({});

  const handleTextAreaChange = (event) => {
    setTextAreaValue(event.target.value);
  };

  const handleSubmit = () => {
    let JSONdata = JSON.parse(textAreaValue);
    const hits = JSONdata.hits.hits;
    const occurrences = {};

    hits.forEach(hit => {
      const source = hit._source;
      if (source.status === '200') {
        const query = source.request_query.split('&');
        const watermarkParam = query.find(param => param.startsWith('watermark='));

        if (watermarkParam) {
          const watermarkValue = watermarkParam.split('=')[1];
          occurrences[watermarkValue] = (occurrences[watermarkValue] || 0) + 1;
        }
      }
    });

    console.log('Watermark occurrences:');
    setWatermarkRepetitions(occurrences);
    Object.keys(occurrences).forEach(watermark => {
      console.log(`${watermark}: ${occurrences[watermark]}`);
    });
  }


  const handleClear = () => {
    setTextAreaValue("");
    setWatermarkRepetitions({});
  }

  return (
    <Flex p="1em" width={"100vw"} height={"100vh"} alignContent={"center"} justifyContent={"center"}>
      <Center flexDirection={"column"}>
        <ColorModeSwitcher />
        <VStack marginBottom="1.5em" spacing={3}>
          <Heading>Check Watermarks Repetition</Heading>
          <Text color="gray.500">Enter the JSON version of the profile-sync's Kibana logs below</Text>
          <Textarea
            value={textAreaValue}
            onChange={handleTextAreaChange}
            resize="none"
            rows="10" />
          <HStack><Button onClick={handleClear}>Clear</Button> <Button onClick={handleSubmit}>Submit</Button></HStack>
        </VStack>
        <VStack>
          {
            Object.keys(watermarkRepetitions).map(watermark => (
              <Text key={watermark}>{`${watermark}: ${watermarkRepetitions[watermark]}`}</Text>
            ))
          }
        </VStack>
      </Center>
    </Flex>
  );
}

export default WatermarksChecker;
