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
    Text
} from "@chakra-ui/react";
import { getToken } from "../services/getToken";
import { getUnsubscribers } from "../services/retrievers";

const UnsubscribersModal = ({ isOpen, modalData, setIsUnsubscribersModalOpen }) => {

    const [hasTableLoaded, setHasTableLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [unsubscribersList, setUnsubscribersList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (isOpen) {
                try {
                    const utoken = await getToken(modalData.appKey, modalData.secretKey);
                    let unsubsFetchResult = await getUnsubscribers(modalData.appKey, utoken);
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
    }, [isOpen, modalData.appKey, modalData.secretKey, hasError]);
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
                                                        <Th>email_type_id</Th>
                                                        <Th>id</Th>
                                                        <Th>unsubscribed_by_name</Th>
                                                        <Th>user_email</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {unsubscribersList.map((unsubscriber) => (
                                                        <Tr key={unsubscriber.id}>
                                                            <Td>{unsubscriber.email_type_id}</Td>
                                                            <Td>{unsubscriber.id}</Td>
                                                            <Td>{unsubscriber.unsubscirbed_by_name}</Td>
                                                            <Td>{unsubscriber.user_email}</Td>
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
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UnsubscribersModal;