import React from 'react';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    Avatar,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Text,
    HStack,
    useColorModeValue
} from '@chakra-ui/react';
import { FiMoreVertical, FiMail, FiPhone, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Lead } from '../../../types';
import usePermissions from '../../../hooks/usePermissions';

const statusColors = {
    'new': 'gray',
    'contacted': 'blue',
    'qualified': 'purple',
    'proposal': 'orange',
    'negotiation': 'pink',
    'closed-won': 'green',
    'closed-lost': 'red'
};

interface LeadTableProps {
    leads: Lead[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => Promise<void>;
}

const LeadTable: React.FC<LeadTableProps> = ({ leads, onEdit, onDelete }) => {
    const { canUpdate, canDelete, user } = usePermissions();
    const navigate = useNavigate();
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const hoverBgColor = useColorModeValue('gray.50', 'gray.700');

    return (
        <Box overflowX="auto">
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Name</Th>
                        <Th>Company</Th>
                        <Th>Status</Th>
                        <Th>Assigned To</Th>
                        <Th>Last Updated</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {leads.map(lead => {
                        const canEditLead = canUpdate('crm') || user?._id === lead.assignedTo;
                        const canDeleteLead = canDelete('crm') || user?._id === lead.assignedTo;

                        return (
                            <Tr 
                                key={lead._id}
                                cursor="pointer"
                                _hover={{ bg: hoverBgColor }}
                                onClick={() => navigate(`/crm/leads/${lead._id}`)}
                            >
                                <Td>
                                    <Text fontWeight="medium">
                                        {lead.name}
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        {lead.email}
                                    </Text>
                                </Td>
                                <Td>{lead.company}</Td>
                                <Td>
                                    <Badge colorScheme={statusColors[lead.status as keyof typeof statusColors]}>
                                        {lead.status}
                                    </Badge>
                                </Td>
                                <Td>
                                    <HStack>
                                        <Avatar 
                                            size="sm" 
                                            name={lead.assignedTo}
                                        />
                                        <Text>{lead.assignedTo}</Text>
                                    </HStack>
                                </Td>
                                <Td>{new Date(lead.updatedAt).toLocaleDateString()}</Td>
                                <Td onClick={e => e.stopPropagation()}>
                                    <Menu>
                                        <MenuButton
                                            as={IconButton}
                                            icon={<FiMoreVertical />}
                                            variant="ghost"
                                            size="sm"
                                        />
                                        <MenuList>
                                            {canEditLead && (
                                                <MenuItem 
                                                    icon={<FiEdit2 />} 
                                                    onClick={() => onEdit(lead._id)}
                                                >
                                                    Edit
                                                </MenuItem>
                                            )}
                                            {canDeleteLead && (
                                                <MenuItem 
                                                    icon={<FiTrash2 />} 
                                                    onClick={() => onDelete(lead._id)}
                                                    color="red.400"
                                                >
                                                    Delete
                                                </MenuItem>
                                            )}
                                            <MenuItem 
                                                icon={<FiMail />}
                                                onClick={() => window.location.href = `mailto:${lead.email}`}
                                            >
                                                Send Email
                                            </MenuItem>
                                            <MenuItem 
                                                icon={<FiPhone />}
                                                onClick={() => window.location.href = `tel:${lead.phone}`}
                                            >
                                                Call
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        </Box>
    );
};

export default LeadTable;