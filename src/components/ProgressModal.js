import React from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Progress,
    Text
} from "@chakra-ui/react";

const ProgressModal = ({ isOpen, modalData }) => {
    return (
        <>
            <Modal isCentered isOpen={isOpen}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Processing</ModalHeader>
                    <ModalBody>
                        {modalData.message}
                        {modalData.progressVisibility &&
                            <>
                                <Progress value={modalData.progressValue} />
                                <Text mt={2} fontSize="sm" align="center">{modalData.progressCaption}</Text>
                            </>
                        }
                    </ModalBody>

                    <ModalFooter>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProgressModal;