import React, { useState } from 'react';
import {
    Box,
    Text,
    HStack,
    VStack,
    Badge,
    useColorModeValue,
    Avatar,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem
} from '@chakra-ui/react';
import { FiMoreVertical, FiMail, FiPhone, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { DragDropContext, Droppable, Draggable, DroppableProvided, DraggableProvided } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';
import { Lead } from '../../../types';
import usePermissions from '../../../hooks/usePermissions';

const lanes = [
    { id: 'new', title: 'New', color: 'gray' },
    { id: 'contacted', title: 'Contacted', color: 'blue' },
    { id: 'qualified', title: 'Qualified', color: 'purple' },
    { id: 'proposal', title: 'Proposal', color: 'orange' },
    { id: 'negotiation', title: 'Negotiation', color: 'pink' },
    { id: 'closed-won', title: 'Won', color: 'green' },
    { id: 'closed-lost', title: 'Lost', color: 'red' }
];

interface LeadCardProps {
    lead: Lead;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onEdit, onDelete }) => {
    const { canUpdate, canDelete, user } = usePermissions();
    const cardBg = useColorModeValue('white', 'gray.700');
    const navigate = useNavigate();

    const canEditLead = canUpdate('crm') || user?._id === lead.assignedTo;
    const canDeleteLead = canDelete('crm') || user?._id === lead.assignedTo;

    return (
        <Box
            p={4}
            bg={cardBg}
            borderRadius="md"
            shadow="sm"
            borderWidth="1px"
            borderColor={useColorModeValue('gray.200', 'gray.600')}
            _hover={{ shadow: 'md' }}
            cursor="pointer"
            onClick={() => navigate(`/crm/leads/${lead._id}`)}
        >
            <HStack justify="space-between" mb={2}>
                <Text fontWeight="medium" noOfLines={1}>
                    {lead.name}
                </Text>
                <Menu>
                    <MenuButton
                        as={IconButton}
                        icon={<FiMoreVertical />}
                        variant="ghost"
                        size="sm"
                        onClick={e => e.stopPropagation()}
                    />
                    <MenuList onClick={e => e.stopPropagation()}>
                        {canEditLead && (
                            <MenuItem icon={<FiEdit2 />} onClick={() => onEdit(lead._id)}>
                                Edit
                            </MenuItem>
                        )}
                        {canDeleteLead && (
                            <MenuItem icon={<FiTrash2 />} onClick={() => onDelete(lead._id)} color="red.400">
                                Delete
                            </MenuItem>
                        )}
                        <MenuItem icon={<FiMail />} onClick={() => window.location.href = `mailto:${lead.email}`}>
                            Send Email
                        </MenuItem>
                        <MenuItem icon={<FiPhone />} onClick={() => window.location.href = `tel:${lead.phone}`}>
                            Call
                        </MenuItem>
                    </MenuList>
                </Menu>
            </HStack>

            <Text fontSize="sm" color="gray.500" mb={3} noOfLines={1}>
                {lead.company}
            </Text>

            <HStack spacing={2} mb={3}>
                <Badge colorScheme={lanes.find(l => l.id === lead.status)?.color}>
                    {lead.status}
                </Badge>
            </HStack>

            <HStack justify="space-between" align="center">
                <Text fontSize="xs" color="gray.500">
                    {new Date(lead.updatedAt).toLocaleDateString()}
                </Text>
                <Avatar 
                    size="sm" 
                    name={lead.assignedTo}
                />
            </HStack>
        </Box>
    );
};

interface LeadKanbanProps {
    leads: Lead[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => Promise<void>;
}

const LeadKanban: React.FC<LeadKanbanProps> = ({ leads: allLeads, onEdit, onDelete }) => {
    const [leads, setLeads] = useState<{ [key: string]: Lead[] }>({});
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const laneColor = useColorModeValue('gray.100', 'gray.800');

    React.useEffect(() => {
        const groupedLeads = lanes.reduce((acc, lane) => {
            acc[lane.id] = allLeads.filter(lead => lead.status === lane.id);
            return acc;
        }, {} as { [key: string]: Lead[] });
        setLeads(groupedLeads);
    }, [allLeads]);

    const onDragEnd = (result: any) => {
        // Handle drag and drop logic here
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <HStack 
                spacing={4} 
                p={4} 
                overflowX="auto" 
                bg={bgColor} 
                alignItems="flex-start"
            >
                {lanes.map(lane => (
                    <Box 
                        key={lane.id}
                        minW="300px"
                        bg={laneColor}
                        borderRadius="lg"
                        p={4}
                    >
                        <HStack justify="space-between" mb={4}>
                            <Text fontWeight="medium">{lane.title}</Text>
                            <Badge colorScheme={lane.color}>
                                {leads[lane.id]?.length || 0}
                            </Badge>
                        </HStack>

                        <Droppable droppableId={lane.id}>
                            {(provided) => (
                                <VStack
                                    spacing={4}
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    minH="100px"
                                >
                                    {leads[lane.id]?.map((lead, index) => (
                                        <Draggable 
                                            key={lead._id} 
                                            draggableId={lead._id} 
                                            index={index}
                                        >
                                            {(provided) => (
                                                <Box
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    w="full"
                                                >
                                                    <LeadCard 
                                                        lead={lead}
                                                        onEdit={onEdit}
                                                        onDelete={onDelete}
                                                    />
                                                </Box>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </VStack>
                            )}
                        </Droppable>
                    </Box>
                ))}
            </HStack>
        </DragDropContext>
    );
};

export default LeadKanban;