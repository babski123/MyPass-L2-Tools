import React from 'react';
import { Center, Heading, Flex, Text, Divider, VStack } from '@chakra-ui/react';
import FileUploadForm from './components/FileUploadForm';
//import { ColorModeSwitcher } from './ColorModeSwitcher';

function App() {
  return (
    <Flex width={"100vw"} height={"100vh"} alignContent={"center"} justifyContent={"center"}>
      <Center flexDirection={"column"}>
        <VStack spacing={3}>
          <Heading>Yotpo Bulk Unsubscriber/Resubscriber</Heading>
          <Text>This tool will add/remove email addresses from the unsubscribers list via API in batches (150 per batch).</Text>
          <Divider />
          <Text fontSize={"sm"}>Upload a CSV file that list all the emails that have to be added/removed from unsubscribers list in one column</Text>
          <FileUploadForm />
        </VStack>
      </Center>
    </Flex>
  );
}

export default App;
