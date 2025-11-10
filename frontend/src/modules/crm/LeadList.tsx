import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    useToast,
    Heading,
    HStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    Select,
    Textarea,
    Text
} from '@chakra-ui/react';

import { leadService } from '../../services/leadService';
import usePermissions from '../../hooks/usePermissions';

interface Lead {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
    value: number;
    createdAt: string;
}

const LeadList: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingLead, setEditingLead] = useState<Lead | null>(null);
    const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
    const [formData, setFormData] = useState<{
        name: string;
        email: string;
        phone: string;
        company: string;
        status: Lead['status'];
        value: number;
        notes: string;
    }>({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'new',
        value: 0,
        notes: ''
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const toast = useToast();

    useEffect(() => {
        fetchLeads();
    }, []);

    const { canDelete, canCreate, canUpdate } = usePermissions();

    const fetchLeads = async () => {
        try {
            const response = await leadService.getAll();
            const data = response.data?.data || response.data || [];
            setLeads(Array.isArray(data) ? data : []);
        } catch (error: any) {
            console.error('Fetch leads error:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to fetch leads',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingLead) {
                await leadService.update(editingLead._id, formData);
                toast({
                    title: 'Success',
                    description: 'Lead updated successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                await leadService.create(formData);
                toast({
                    title: 'Success',
                    description: 'Lead created successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            }
            onClose();
            fetchLeads();
            resetForm();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to save lead';
            toast({
                title: 'Error',
                description: errorMessage,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const resetForm = () => {
        setFormData({ name: '', email: '', phone: '', company: '', status: 'new', value: 0, notes: '' });
        setEditingLead(null);
    };

    const handleEdit = (lead: Lead) => {
        setEditingLead(lead);
        setFormData({
            name: lead.name,
            email: lead.email,
            phone: lead.phone || '',
            company: lead.company || '',
            status: lead.status,
            value: lead.value,
            notes: ''
        });
        onOpen();
    };

    const handleAdd = () => {
        resetForm();
        onOpen();
    };

    const handleDeleteClick = (lead: Lead) => {
        setDeletingLead(lead);
        onDeleteOpen();
    };

    const confirmDelete = async () => {
        if (!deletingLead) return;
        try {
            await leadService.delete(deletingLead._id);
            toast({ 
                title: 'Success', 
                description: 'Lead deleted successfully', 
                status: 'success', 
                duration: 2500, 
                isClosable: true 
            });
            fetchLeads();
            onDeleteClose();
            setDeletingLead(null);
        } catch (error: any) {
            console.error('Delete lead error:', error);
            toast({ 
                title: 'Error', 
                description: error.response?.data?.message || 'Failed to delete lead', 
                status: 'error', 
                duration: 3000, 
                isClosable: true 
            });
        }
    };

    const getStatusColor = (status: string) => {
        const colors: { [key: string]: string } = {
            new: 'blue',
            contacted: 'yellow',
            qualified: 'orange',
            proposal: 'purple',
            won: 'green',
            lost: 'red'
        };
        return colors[status] || 'gray';
    };

    if (loading) return <Box>Loading...</Box>;

    return (
        <Box>
            <HStack justify="space-between" mb={6}>
                <Heading size="lg">CRM - Leads</Heading>
                {canCreate('crm') && (
                    <Button colorScheme="blue" onClick={handleAdd}>Add Lead</Button>
                )}
            </HStack>

            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Name</Th>
                        <Th>Email</Th>
                        <Th>Phone</Th>
                        <Th>Company</Th>
                        <Th>Status</Th>
                        <Th>Value</Th>
                        <Th>Created</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {leads.map((lead) => (
                        <Tr key={lead._id}>
                            <Td>{lead.name}</Td>
                            <Td>{lead.email}</Td>
                            <Td>{lead.phone || '-'}</Td>
                            <Td>{lead.company || '-'}</Td>
                            <Td>
                                <Badge colorScheme={getStatusColor(lead.status)}>
                                    {lead.status}
                                </Badge>
                            </Td>
                            <Td>${lead.value}</Td>
                            <Td>{new Date(lead.createdAt).toLocaleDateString()}</Td>
                            <Td>
                                <HStack spacing={2}>
                                    {canUpdate('crm') && (
                                        <Button 
                                            size="sm" 
                                            colorScheme="blue" 
                                            variant="outline"
                                            onClick={() => handleEdit(lead)}
                                        >
                                            Edit
                                        </Button>
                                    )}
                                    {canDelete('crm') && (
                                        <Button 
                                            size="sm" 
                                            colorScheme="red" 
                                            variant="outline"
                                            onClick={() => handleDeleteClick(lead)}
                                        >
                                            Delete
                                        </Button>
                                    )}
                                </HStack>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{editingLead ? 'Edit Lead' : 'Add New Lead'}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <form onSubmit={handleSubmit}>
                            <FormControl mb={4}>
                                <FormLabel>Name</FormLabel>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Phone</FormLabel>
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Company</FormLabel>
                                <Input
                                    value={formData.company}
                                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                                />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Value ($)</FormLabel>
                                <Input
                                    type="number"
                                    value={formData.value}
                                    onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                                />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Status</FormLabel>
                                <Select
                                    value={formData.status}
                                    onChange={(e) => setFormData({...formData, status: e.target.value as Lead['status']})}
                                >
                                    <option value="new">New</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="qualified">Qualified</option>
                                    <option value="proposal">Proposal</option>
                                    <option value="won">Won</option>
                                    <option value="lost">Lost</option>
                                </Select>
                            </FormControl>
                            <Button type="submit" colorScheme="blue" mr={3}>
                                {editingLead ? 'Update Lead' : 'Create Lead'}
                            </Button>
                            <Button onClick={() => { onClose(); resetForm(); }}>Cancel</Button>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete Lead</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Text>Are you sure you want to delete the lead "{deletingLead?.name}"?</Text>
                        <Text fontSize="sm" color="gray.600" mt={2}>
                            This action cannot be undone.
                        </Text>
                        <HStack spacing={3} mt={6}>
                            <Button colorScheme="red" onClick={confirmDelete}>
                                Yes, Delete
                            </Button>
                            <Button variant="outline" onClick={() => { onDeleteClose(); setDeletingLead(null); }}>
                                No, Cancel
                            </Button>
                        </HStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default LeadList;