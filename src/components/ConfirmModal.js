import React from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Text
} from "@chakra-ui/react";

const ConfirmModal = ({ isOpen, onClose, onProceed, modalData }) => {

    return (
        <>
            <Modal isCentered isOpen={isOpen}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{modalData.title}</ModalHeader>
                    <ModalBody>
                        <Text align="center">{modalData.message}</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme='blue' mr={3} onClick={onProceed}>
                            Proceed
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ConfirmModal;