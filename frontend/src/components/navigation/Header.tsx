import React from 'react';
import {
    Box,
    Flex,
    HStack,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    Avatar,
    Text,
    useColorMode,
    useColorModeValue,
    Divider
} from '@chakra-ui/react';
import { FiMenu, FiMoon, FiSun, FiBell, FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import usePermissions from '../../hooks/usePermissions';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { colorMode, toggleColorMode } = useColorMode();
    const bgColor = useColorModeValue('surface', 'surface');

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <Box
            as="header"
            bg={bgColor}
            px={4}
            py={2}
            borderBottom="1px"
            borderColor={useColorModeValue('border', 'border')}
            position="sticky"
            top={0}
            zIndex={10}
        >
            <Flex justify="space-between" align="center">
                <IconButton
                    display={{ base: 'flex', md: 'none' }}
                    aria-label="Open menu"
                    icon={<FiMenu />}
                    variant="ghost"
                />

                <HStack spacing={4}>
                    {/* Color mode toggle */}
                    <IconButton
                        aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
                        icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
                        onClick={toggleColorMode}
                        variant="ghost"
                    />

                    {/* Notifications */}
                    <Menu>
                        <MenuButton
                            as={IconButton}
                            aria-label="Notifications"
                            icon={<FiBell />}
                            variant="ghost"
                        />
                        <MenuList>
                            <MenuItem>No new notifications</MenuItem>
                        </MenuList>
                    </Menu>

                    {/* User menu */}
                    <Menu>
                        <MenuButton
                            as={Button}
                            variant="ghost"
                            rightIcon={<FiSettings />}
                        >
                            <HStack>
                                <Avatar 
                                    size="sm" 
                                    name={user?.username}
                                    src={user?.profile?.avatar}
                                />
                                <Box textAlign="left">
                                    <Text fontWeight="medium" color="primary">{user?.username}</Text>
                                    <Text fontSize="xs" color="mutedText">
                                        {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}
                                    </Text>
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList>
                            <MenuItem onClick={() => navigate('/profile')}>
                                Profile
                            </MenuItem>
                            <MenuItem onClick={() => navigate('/settings')}>
                                Settings
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleLogout} color="red.400">
                                Logout
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </HStack>
            </Flex>
        </Box>
    );
};

export default Header;