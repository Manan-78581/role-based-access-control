import React from 'react';
import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import Sidebar from '../components/navigation/Sidebar';
import Header from '../components/navigation/Header';
import { useAuth } from '../context/AuthContext';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const { user } = useAuth();
    const bgColor = useColorModeValue('gray.50', 'gray.900');

    if (!user) {
        return null;
    }

    return (
        <Flex h="100vh" bg={bgColor}>
            <Sidebar />
            <Box flex="1" overflow="auto">
                <Header />
                <Box as="main" p={8}>
                    {children}
                </Box>
            </Box>
        </Flex>
    );
};

export default MainLayout;