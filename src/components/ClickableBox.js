import { Box, Flex, Text, Link } from "@chakra-ui/react";
import React from "react";

const ClickableBox = ({boxDetails}) => {
    console.log(boxDetails)

    return (
        <Flex
            width="17em"
            height="12em"
            border="1px"
            borderColor="gray.200"
            borderRadius="1em"
            align="center"
            justify="center"
            p="1.5em"
        >
            <Box textAlign="center">
                <Text as="b">
                    <Link href={boxDetails.link}>{boxDetails.linkText}</Link>
                </Text>
                <Text fontSize="xs">{boxDetails.linkDesc}</Text>
            </Box>
        </Flex>
    )
}

export default ClickableBox;