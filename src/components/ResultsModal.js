import React from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    HStack,
    VStack,
    StackDivider,
    Box,
    Heading,
    Button,
    Tooltip
} from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons"
import { JSONTree } from "react-json-tree";
import { brewer } from "base16";

const ResultsModal = ({ isOpen, modalData }) => {
    return (
        <>
            <Modal scrollBehavior="inside" size="2xl" isCentered isOpen={isOpen}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Results</ModalHeader>
                    <ModalBody>
                        <HStack spacing="1rem" justify="center" align="start" divider={<StackDivider borderColor='gray.200' />}>
                            <VStack>
                                <Box>
                                    <Heading as="h5" size="sm">Successful Calls <Tooltip label="These requests were successfully executed."><QuestionOutlineIcon /></Tooltip></Heading>
                                </Box>
                                <Box fontSize="small">
                                    <JSONTree hideRoot={false} data={modalData.success_calls} theme={brewer} invertTheme={true} />
                                </Box>
                            </VStack>
                            <VStack>
                                <Box>
                                    <Heading as="h5" size="sm">Successful Calls with Errors <Tooltip label="These requests were successfully executed but returned an error on certain email addresses"><QuestionOutlineIcon /></Tooltip></Heading>
                                </Box>
                                <Box fontSize="small">
                                    <JSONTree hideRoot={false} data={modalData.success_calls_with_errors} theme={brewer} invertTheme={true} />
                                </Box>
                            </VStack>
                            <VStack>
                                <Box>
                                    <Heading as="h5" size="sm">Failed Calls <Tooltip label="These requests have failed, it's either the server is down, or your connection is unstable"><QuestionOutlineIcon /></Tooltip></Heading>
                                </Box>
                                <Box fontSize="small">
                                    <JSONTree hideRoot={false} data={modalData.failed_calls} theme={brewer} invertTheme={true} />
                                </Box>
                            </VStack>
                        </HStack>
                    </ModalBody>

                    <ModalFooter>
                        <HStack justify="center">
                            <Button onClick={function () {
                                window.location.reload();
                            }} variant="solid" colorScheme="blue">Do Another</Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ResultsModal;