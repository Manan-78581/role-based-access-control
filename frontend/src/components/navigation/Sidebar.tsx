import React from 'react';
import {
    Box,
    VStack,
    Drawer,
    DrawerContent,
    DrawerOverlay,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    useDisclosure,
    useColorModeValue,
    Icon
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import usePermissions from '../../hooks/usePermissions';
import { 
    FiHome, FiUsers, FiPhone, FiUserCheck, 
    FiPackage, FiDollarSign, FiFolder, FiBarChart2, FiSettings 
} from 'react-icons/fi';

interface NavItemProps {
    icon: React.ElementType;
    children: React.ReactNode;
    to: string;
    active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, children, to, active }) => {
    const bgColor = useColorModeValue(active ? 'accent' : 'transparent', active ? 'accent' : 'transparent');
    const textColor = useColorModeValue(active ? 'primary' : 'mutedText', active ? 'surface' : 'gray.200');

    return (
        <Box
            as={Link}
            to={to}
            p={3}
            borderRadius="md"
            bg={bgColor}
            color={textColor}
            _hover={{
                bg: useColorModeValue('surface', 'surface'),
                color: useColorModeValue('primary', 'surface')
            }}
            display="flex"
            alignItems="center"
            gap={3}
            w="full"
        >
            <Icon as={icon} boxSize={5} />
            {children}
        </Box>
    );
};

const Sidebar: React.FC = () => {
    const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });
    const { user, canRead } = usePermissions();
    const location = useLocation();

    const allItems = [
        { name: 'Dashboard', icon: FiHome, path: '/dashboard', permission: 'dashboard' },
        { name: 'Analytics', icon: FiBarChart2, path: '/analytics', permission: 'analytics' },
        { name: 'CRM', icon: FiPhone, path: '/crm', permission: 'crm' },
        { name: 'Projects', icon: FiFolder, path: '/projects', permission: 'projects' },
        { name: 'HR', icon: FiUserCheck, path: '/hr', permission: 'hr' },
        { name: 'Inventory', icon: FiPackage, path: '/inventory', permission: 'inventory' },
        { name: 'Finance', icon: FiDollarSign, path: '/finance', permission: 'finance' },
        { name: 'Users', icon: FiUsers, path: '/users', permission: 'users' }
    ];

    const navItems = [
        ...allItems.filter(item => canRead(item.permission)),
        { name: 'Settings', icon: FiSettings, path: '/settings', permission: 'settings' }
    ];
    
    console.log('Nav items:', navItems.map(i => i.name));

    const sidebarContent = (
        <VStack spacing={4} align="stretch" w="full" p={4}>
            {navItems.map((item) => (
                <NavItem
                    key={item.path}
                    icon={item.icon}
                    to={item.path}
                    active={location.pathname.startsWith(item.path)}
                >
                    {item.name}
                </NavItem>
            ))}
        </VStack>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <Box
                display={{ base: 'none', md: 'flex' }}
                w="64"
                bg={useColorModeValue('surface', 'surface')}
                borderRight="1px"
                borderColor={useColorModeValue('border', 'border')}
                flexDir="column"
            >
                {sidebarContent}
            </Box>

            {/* Mobile Drawer */}
            <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Menu</DrawerHeader>
                    <DrawerBody>
                        {sidebarContent}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default Sidebar;