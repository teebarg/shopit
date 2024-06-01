import React, { ReactNode, forwardRef, useImperativeHandle } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";

interface ChildComponentProps {
    children?: ReactNode;
    onClose?: () => void;
    onConfirm?: () => void;
    modalTitle?: string;
    action?: string;
    isPending?: boolean;
    size?: "sm" | "md" | "lg" | "xl";
    backdrop?: "opaque" | "blur" | "transparent";
}

interface ChildComponentHandles {
    onOpen: () => void;
    onClose: () => void;
}

// eslint-disable-next-line react/display-name
const NextModal = forwardRef<ChildComponentHandles, ChildComponentProps>(
    ({ children, modalTitle = "", action = "Save", size = "md", backdrop = "opaque", onConfirm, isPending }, ref) => {
        const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
        useImperativeHandle(ref, () => ({
            onOpen,
            onClose,
        }));

        return (
            <Modal
                backdrop={backdrop}
                size={size}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                classNames={{
                    backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{modalTitle}</ModalHeader>
                            <ModalBody>{children}</ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={onConfirm} isLoading={isPending}>
                                    {action}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        );
    }
);

export default NextModal;
