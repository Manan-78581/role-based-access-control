import React, { useState } from 'react';
import { Box, Flex, Button, VStack, Link, Text, IconButton } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const { logout, user, hasPermission } = useAuth();
    const location = useLocation();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', permission: null },
        { name: 'Analytics', path: '/analytics', permission: null },
        { name: 'CRM', path: '/crm', permission: 'crm:read' },
        { name: 'Projects', path: '/projects', permission: 'projects:read' },
        { name: 'HR', path: '/hr', permission: 'hr:read' },
        { name: 'Finance', path: '/finance', permission: 'finance:read' }
    ];

    return (
        <Flex minH="100vh" bg="background">
            {/* Sidebar */}
            <Box 
                w={sidebarCollapsed ? "60px" : "250px"} 
                bg="surface" 
                borderRight="1px" 
                borderColor="border" 
                p={4}
                transition="width 0.3s"
            >
                <Flex justify="space-between" align="center" mb={6}>
                    {!sidebarCollapsed && (
                        <Text fontSize="xl" fontWeight="bold" color="primary">BizFlow</Text>
                    )}
                    <IconButton
                        aria-label="Toggle sidebar"
                        icon={<Text>{sidebarCollapsed ? '→' : '←'}</Text>}
                        size="sm"
                        variant="ghost"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    />
                </Flex>
                <VStack align="stretch" spacing={1}>
                    {navItems.map((item) => {
                        if (item.permission && !hasPermission(item.permission)) {
                            return null;
                        }
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                as={RouterLink}
                                to={item.path}
                                p={3}
                                rounded="md"
                                bg={isActive ? 'accent' : 'transparent'}
                                color={isActive ? 'primary' : 'mutedText'}
                                fontWeight={isActive ? 'medium' : 'normal'}
                                _hover={{ bg: isActive ? 'accent' : 'surface', textDecoration: 'none' }}
                                title={sidebarCollapsed ? item.name : undefined}
                            >
                                {sidebarCollapsed ? item.name.charAt(0) : item.name}
                            </Link>
                        );
                    })}
                </VStack>
            </Box>

            {/* Main Content */}
            <Box flex="1">
                <Flex justify="space-between" align="center" p={4} bg="surface" borderBottom="1px" borderColor="border">
                    <Text fontSize="lg" fontWeight="medium" color="primary">Welcome, {user?.username}</Text>
                    <Flex align="center" gap={4}>
                        <Text fontSize="sm" color="mutedText">Role: {user?.role}</Text>
                        <Button onClick={logout} size="sm" colorScheme="red" variant="outline">Logout</Button>
                    </Flex>
                </Flex>
                <Box p={6} bg="background" minH="calc(100vh - 73px)">{children}</Box>
            </Box>
        </Flex>
    );
};

export default MainLayout;