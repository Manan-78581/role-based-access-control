import React, { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    useColorModeValue,
    Button,
    HStack,
    Input,
    Select,
    IconButton,
    useDisclosure,
    VStack,
    Text
} from '@chakra-ui/react';
import { apiClient } from '../../../utils/api';
import { Lead } from '../../../types';
import { FiPlus, FiSearch, FiGrid, FiList } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import LeadKanban from './LeadKanban';
import LeadTable from './LeadTable';
import usePermissions from '../../../hooks/usePermissions';

const LeadsView: React.FC = () => {
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const { canCreate, user } = usePermissions();
    const bgColor = useColorModeValue('white', 'gray.800');

    useEffect(() => {
        fetchLeads();
    }, [statusFilter]);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/api/crm/leads', {
                params: {
                    status: statusFilter !== 'all' ? statusFilter : undefined,
                    search: searchTerm || undefined
                }
            });
            setLeads(response.data);
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditLead = (id: string) => {
        navigate(`/crm/leads/${id}/edit`);
    };

    const handleDeleteLead = async (id: string): Promise<void> => {
        try {
            // TODO: Implement delete API call
            await fetchLeads();
        } catch (error) {
            console.error('Error deleting lead:', error);
        }
    };

    return (
        <Box>
            <Box mb={6}>
                <HStack justify="space-between" mb={4}>
                    <Heading size="lg">Leads</Heading>
                    {canCreate('crm') && (
                        <Button
                            leftIcon={<FiPlus />}
                            colorScheme="blue"
                            onClick={() => navigate('/crm/leads/new')}
                        >
                            New Lead
                        </Button>
                    )}
                </HStack>

                {/* Filters */}
                <HStack spacing={4} mb={4} align="center">
                    <Input
                        placeholder="Search leads..."
                        maxW="300px"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        maxW="200px"
                    >
                        <option value="all">All Status</option>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="proposal">Proposal</option>
                        <option value="negotiation">Negotiation</option>
                        <option value="closed-won">Won</option>
                        <option value="closed-lost">Lost</option>
                    </Select>
                    <HStack spacing={2} ml="auto">
                        <IconButton
                            aria-label="Kanban view"
                            icon={<FiGrid />}
                            variant={viewMode === 'kanban' ? 'solid' : 'ghost'}
                            onClick={() => setViewMode('kanban')}
                        />
                        <IconButton
                            aria-label="List view"
                            icon={<FiList />}
                            variant={viewMode === 'list' ? 'solid' : 'ghost'}
                            onClick={() => setViewMode('list')}
                        />
                    </HStack>
                </HStack>
            </Box>

            <Box bg={bgColor} borderRadius="lg" shadow="sm">
                <Tabs>
                    <TabList px={4}>
                        <Tab>All Leads</Tab>
                        <Tab>My Leads</Tab>
                        <Tab>Recent</Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel p={4}>
                            {loading ? (
                                <VStack spacing={4} align="center" py={8}>
                                    <Text>Loading leads...</Text>
                                </VStack>
                            ) : viewMode === 'kanban' ? (
                                <LeadKanban
                                    leads={leads}
                                    onEdit={handleEditLead}
                                    onDelete={handleDeleteLead}
                                />
                            ) : (
                                <LeadTable
                                    leads={leads}
                                    onEdit={handleEditLead}
                                    onDelete={handleDeleteLead}
                                />
                            )}
                        </TabPanel>
                        <TabPanel p={4}>
                            <LeadTable
                                leads={leads.filter(lead => lead.assignedTo === user?._id)}
                                onEdit={handleEditLead}
                                onDelete={handleDeleteLead}
                            />
                        </TabPanel>
                        <TabPanel p={4}>
                            <LeadTable
                                leads={leads.sort((a, b) => 
                                    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                                ).slice(0, 10)}
                                onEdit={handleEditLead}
                                onDelete={handleDeleteLead}
                            />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Box>
    );
};

export default LeadsView;