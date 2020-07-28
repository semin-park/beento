import React, { useState } from 'react';
import {
    Button,
    Collapse,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
} from 'reactstrap';

export default function NavigationBar(props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleOpen = () => setIsOpen(!isOpen);
    const toggleModal = () => setIsModalOpen(!isModalOpen);

    return (
        <Navbar color="light" light expand="md">
            <NavbarBrand href="#">Been To</NavbarBrand>
            <NavbarToggler onClick={toggleOpen} />
            <Collapse isOpen={isOpen} navbar>
                <Nav className="mr-auto" navbar>
                    <NavItem>
                        <NavLink href='#' onClick={toggleModal}>Login</NavLink>
                    </NavItem>
                </Nav>
            </Collapse>
            <Modal isOpen={isModalOpen} toggle={toggleModal} centered>
                    <ModalHeader toggle={toggleModal}>Sign in</ModalHeader>
                    <ModalBody>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                    </ModalFooter>
            </Modal>
        </Navbar>
    );
}
