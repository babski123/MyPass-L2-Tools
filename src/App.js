import React from 'react';
import { Center, Heading, Flex, VStack, Stack } from '@chakra-ui/react';
//import FileUploadForm from './components/FileUploadForm';
import ClickableBox from './components/ClickableBox';
import { ColorModeSwitcher } from './ColorModeSwitcher';

function App() {
  return (
    <Flex p="1em" width={"100vw"} height={"100vh"} alignContent={"center"} justifyContent={"center"}>
      <Center flexDirection={"column"}>
      <ColorModeSwitcher />
        <VStack spacing={3}>
          <Heading>MyPass Global L2 Tools</Heading>
          {/* <FileUploadForm /> */}
          <Stack direction="row" flexWrap="wrap" marginTop="2em">
            <ClickableBox boxDetails={{
              link: "#",
              linkText: "Check Watermarks Repetition",
              linkDesc: "Identifies how many times a watermark has repeated"
            }}/>
          </Stack>
        </VStack>
      </Center>
    </Flex>
  );
}

export default App;
