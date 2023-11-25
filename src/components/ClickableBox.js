import { Box, Flex, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import React from 'react';

const ClickableBox = ({ boxDetails }) => {

    return (
        <Flex
            width="17em"
            height="11em"
            border="1px"
            borderColor="gray.200"
            borderRadius="1em"
            align="center"
            justify="center"
            p="1.5em"
        >
            <Box textAlign="center">
                <Text as="b" color="blue.500">
                    <Link className='hoverable-link' to={boxDetails.link}>{boxDetails.linkText}</Link>
                </Text>
                <Text marginTop="0.2em" color="gray.500" fontSize="xs">{boxDetails.linkDesc}</Text>
            </Box>
        </Flex>
    );
};

export default ClickableBox;
