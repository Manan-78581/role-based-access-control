import React, { ReactNode } from 'react';
import { Box, Container, Flex } from '@chakra-ui/react';
import Navbar from './Navbar';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <Box minH="100vh" bg="gray.50">
            <Navbar />
            <Container maxW="container.xl" py={8}>
                <Flex direction="column">
                    {children}
                </Flex>
            </Container>
        </Box>
    );
};

export default Layout;