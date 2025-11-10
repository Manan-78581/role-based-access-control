import React from 'react';
import { Box, Flex, Button, Text, HStack, useToast } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import usePermissions from '../hooks/usePermissions';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const { canManageRoles } = usePermissions();
    const navigate = useNavigate();
    const toast = useToast();

    const handleLogout = async (): Promise<void> => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to logout',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box bg="surface" px={4} shadow="sm">
            <Flex h={16} alignItems="center" justifyContent="space-between">
                <HStack spacing={8} alignItems="center">
                    <Text
                        as={RouterLink}
                        to="/"
                        fontSize="xl"
                        fontWeight="bold"
                        color="primary"
                    >
                        RBAC Demo
                    </Text>
                    
                    {user && (
                        <HStack spacing={4}>
                            <Button
                                as={RouterLink}
                                to="/dashboard"
                                variant="ghost"
                            >
                                Dashboard
                            </Button>
                            <Button
                                as={RouterLink}
                                to="/posts"
                                variant="ghost"
                            >
                                Posts
                            </Button>
                            {canManageRoles() && (
                                <Button
                                    as={RouterLink}
                                    to="/admin"
                                    variant="ghost"
                                    colorScheme="purple"
                                >
                                    Admin
                                </Button>
                            )}
                        </HStack>
                    )}
                </HStack>

                <HStack spacing={4}>
                    {user ? (
                        <>
                            <Text color="mutedText">
                                {user.username} ({user.role})
                            </Text>
                            <Button
                                variant="outline"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                as={RouterLink}
                                to="/login"
                                variant="ghost"
                            >
                                Login
                            </Button>
                            <Button
                                as={RouterLink}
                                to="/register"
                                colorScheme="blue"
                            >
                                Register
                            </Button>
                        </>
                    )}
                </HStack>
            </Flex>
        </Box>
    );
};

export default Navbar;