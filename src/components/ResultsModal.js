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
    Button
} from "@chakra-ui/react";
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
                                    <Heading as="h5" size="sm">Successful Calls</Heading>
                                </Box>
                                <Box fontSize="small">
                                    <JSONTree hideRoot={false} data={modalData.success_calls} theme={brewer} invertTheme={true} />
                                </Box>
                            </VStack>
                            <VStack>
                                <Box>
                                    <Heading as="h5" size="sm">Successful Calls with Errors</Heading>
                                </Box>
                                <Box fontSize="small">
                                    <JSONTree hideRoot={false} data={modalData.success_calls_with_errors} theme={brewer} invertTheme={true} />
                                </Box>
                            </VStack>
                            <VStack>
                                <Box>
                                    <Heading as="h5" size="sm">Failed Calls</Heading>
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