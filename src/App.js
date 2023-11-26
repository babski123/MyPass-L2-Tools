import React from 'react';
import { Center, Heading, Flex, VStack, Stack } from '@chakra-ui/react';
import ClickableBox from './components/ClickableBox';
import { ColorModeSwitcher } from './ColorModeSwitcher';


function App() {

  return (
    <Flex p="1em" width={"100vw"} height={"100vh"} alignContent={"center"} justifyContent={"center"}>
      <Center flexDirection={"column"}>
        <ColorModeSwitcher />
        <VStack spacing={3}>
          <Heading>MyPass Global L2 Tools</Heading>
          <Stack justifyContent="center" direction="row" flexWrap="wrap" marginTop="2em">
            <ClickableBox boxDetails={{
              link: "/watermarks-check",
              linkText: "Check Watermarks Repetition",
              linkDesc: "Identifies how many times watermarks were repeated in a certain Kibana JSON log"
            }} />
            <ClickableBox boxDetails={{
              link: "/bookings-check",
              linkText: "Check 204 Bookings",
              linkDesc: "Identifies which booking requests returned 204 error and which ones are using LMS IDs"
            }} />
            <ClickableBox boxDetails={{
              link: "/bhp-simulation",
              linkText: "BHP Simulation",
              linkDesc: "A simulation of BHP's Integration with MyPass"
            }} />
            <ClickableBox boxDetails={{
              link: "/lh-simulation",
              linkText: "Lighthouse Simulation",
              linkDesc: "A simulation of INPEX's integration with MyPass (Lighthouse)"
            }} />
          </Stack>
        </VStack>
      </Center>
    </Flex>
  );
}

export default App;
