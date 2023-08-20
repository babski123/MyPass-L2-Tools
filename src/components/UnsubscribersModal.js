import React, { useEffect, useState } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Skeleton,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Text,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper
} from "@chakra-ui/react";
import { getToken } from "../services/getToken";
import { getUnsubscribers } from "../services/retrievers";

const UnsubscribersModal = ({ isOpen, modalData, setIsUnsubscribersModalOpen }) => {

    const [hasTableLoaded, setHasTableLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [unsubscribersList, setUnsubscribersList] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(100);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            if (isOpen) {
                try {
                    const utoken = await getToken(modalData.appKey, modalData.secretKey);
                    let unsubsFetchResult = await getUnsubscribers(modalData.appKey, utoken, rowsPerPage, currentPage);
                    setHasError(false);
                    setHasTableLoaded(true);
                    setUnsubscribersList(unsubsFetchResult.response.unsubscribers);
                } catch (error) {
                    console.error("Error fetching data", error);
                    setHasTableLoaded(true);
                    setHasError(true);
                }
            }
        }

        fetchData();
    }, [isOpen, modalData.appKey, modalData.secretKey, hasError, rowsPerPage, currentPage]);


    const handleRowsPerPageChange = (value) => {
        setRowsPerPage(value);
        setCurrentPage(1); // Reset to the first page when changing rows per page
        setHasTableLoaded(false);
    };

    const handlePageNumberChange = (value) => {
        setCurrentPage(value);
        setHasTableLoaded(false);
    };

    return (
        <>
            <Modal
                scrollBehavior="inside"
                size="5xl"
                isCentered
                isOpen={isOpen}
                onClose={() => {
                    setIsUnsubscribersModalOpen(false);
                    setHasError(false);
                    setHasTableLoaded(false);
                    setUnsubscribersList([]);
                    setCurrentPage(1); //reset to default
                    setRowsPerPage(100); //reset to default
                }}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Unsubscribers List</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {
                            <Skeleton isLoaded={hasTableLoaded}>
                                {
                                    hasError ? <Text textAlign="center" color="red">Failed to retrieve data</Text> :
                                        <TableContainer>
                                            <Table variant='simple'>
                                                <TableCaption>This table contains {unsubscribersList.length} rows</TableCaption>
                                                <Thead>
                                                    <Tr>
                                                        <Th textAlign="center">email_type_id</Th>
                                                        <Th textAlign="center">id</Th>
                                                        <Th textAlign="center"> unsubscribed_by_name</Th>
                                                        <Th textAlign="center">user_email</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {unsubscribersList.map((unsubscriber) => (
                                                        <Tr key={unsubscriber.id}>
                                                            <Td textAlign="center">{unsubscriber.email_type_id}</Td>
                                                            <Td textAlign="center">{unsubscriber.id}</Td>
                                                            <Td textAlign="center">{unsubscriber.unsubscirbed_by_name}</Td>
                                                            <Td textAlign="center">{unsubscriber.user_email}</Td>
                                                        </Tr>
                                                    ))}
                                                </Tbody>
                                            </Table>
                                        </TableContainer>
                                }

                            </Skeleton>
                        }
                    </ModalBody>

                    <ModalFooter>
                        {
                            !hasError &&
                            <>
                                <Text mx={2}>Rows per page: </Text>
                                <NumberInput mx={2} value={rowsPerPage} defaultValue={rowsPerPage} min={1} max={5000} onChange={handleRowsPerPageChange}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                <Text mx={2}>Page number: </Text>
                                <NumberInput mx={2} value={currentPage} defaultValue={currentPage} min={1} max={5000} onChange={handlePageNumberChange}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </>
                        }
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UnsubscribersModal;