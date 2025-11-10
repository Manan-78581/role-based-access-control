import React, { useState } from 'react';
import {
    Box,
    Heading,
    VStack,
    HStack,
    FormControl,
    FormLabel,
    Input,
    Button,
    Switch,
    Text,
    useToast,
    useColorMode,
    Divider,
    Card,
    CardBody,
    Badge
} from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';

const Settings: React.FC = () => {
    const { user } = useAuth();
    const { colorMode, toggleColorMode } = useColorMode();
    const toast = useToast();
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast({
                title: 'Error',
                description: 'New passwords do not match',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast({
                title: 'Error',
                description: 'Password must be at least 6 characters long',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        // Simulate password reset
        toast({
            title: 'Success',
            description: 'Password updated successfully',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    return (
        <Box>
            <Heading mb={6}>Settings</Heading>
            
            <VStack spacing={6} align="stretch">
                {/* User Profile Section */}
                <Card>
                    <CardBody>
                        <Heading size="md" mb={4}>User Profile</Heading>
                        <VStack spacing={4} align="stretch">
                            <HStack>
                                <Text fontWeight="medium" w="120px">Username:</Text>
                                <Text>{user?.username}</Text>
                            </HStack>
                            <HStack>
                                <Text fontWeight="medium" w="120px">Email:</Text>
                                <Text>{user?.email}</Text>
                            </HStack>
                            <HStack>
                                <Text fontWeight="medium" w="120px">Role:</Text>
                                <Badge colorScheme="blue">{user?.role}</Badge>
                            </HStack>
                            <HStack>
                                <Text fontWeight="medium" w="120px">Permissions:</Text>
                                <Text>{user?.permissions?.length || 0} permissions</Text>
                            </HStack>
                        </VStack>
                    </CardBody>
                </Card>

                {/* Password Reset Section */}
                <Card>
                    <CardBody>
                        <Heading size="md" mb={4}>Change Password</Heading>
                        <form onSubmit={handlePasswordReset}>
                            <VStack spacing={4} align="stretch">
                                <FormControl>
                                    <FormLabel>Current Password</FormLabel>
                                    <Input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                        required
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>New Password</FormLabel>
                                    <Input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                        required
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <Input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                        required
                                    />
                                </FormControl>
                                <Button type="submit" colorScheme="blue" w="fit-content">
                                    Update Password
                                </Button>
                            </VStack>
                        </form>
                    </CardBody>
                </Card>

                {/* Appearance Settings */}
                <Card>
                    <CardBody>
                        <Heading size="md" mb={4}>Appearance</Heading>
                        <HStack justify="space-between">
                            <VStack align="start" spacing={1}>
                                <Text fontWeight="medium">Dark Mode</Text>
                                <Text fontSize="sm" color="gray.500">
                                    Toggle between light and dark theme
                                </Text>
                            </VStack>
                            <Switch
                                isChecked={colorMode === 'dark'}
                                onChange={toggleColorMode}
                                colorScheme="blue"
                                size="lg"
                            />
                        </HStack>
                    </CardBody>
                </Card>
            </VStack>
        </Box>
    );
};

export default Settings;