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
    Text,
    VStack,
    Progress,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel
} from '@chakra-ui/react';
import axios from 'axios';
import usePermissions from '../../hooks/usePermissions';

interface Project {
    _id: string;
    name: string;
    description?: string;
    status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    budget?: number;
    progress?: number;
    startDate?: string;
    endDate?: string;
    manager: {
        username: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}

interface ProjectUpdate {
    _id: string;
    projectId: string;
    title: string;
    description: string;
    createdAt: string;
    createdBy: {
        username: string;
    };
}

const ProjectList: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [projectUpdates, setProjectUpdates] = useState<ProjectUpdate[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [formData, setFormData] = useState<{
        name: string;
        description: string;
        status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
        priority: 'low' | 'medium' | 'high' | 'urgent';
        budget: number;
        progress: number;
        startDate: string;
        endDate: string;
    }>({
        name: '',
        description: '',
        status: 'planning',
        priority: 'medium',
        budget: 0,
        progress: 0,
        startDate: '',
        endDate: ''
    });
    const [updateData, setUpdateData] = useState({ title: '', description: '' });
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const toast = useToast();
    const { canCreate, canUpdate, canDelete } = usePermissions();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/projects', {
                withCredentials: true
            });
            setProjects(response.data.data || []);
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to fetch projects',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchProjectUpdates = async (projectId: string) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/projects/${projectId}/updates`, {
                withCredentials: true
            });
            setProjectUpdates(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch project updates:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate dates
        if (formData.startDate && formData.endDate) {
            const startDate = new Date(formData.startDate);
            const endDate = new Date(formData.endDate);
            
            if (startDate >= endDate) {
                toast({
                    title: 'Invalid Dates',
                    description: 'End date must be after start date',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }
        }
        
        try {
            const projectData = {
                ...formData,
                startDate: formData.startDate || undefined,
                endDate: formData.endDate || undefined
            };
            
            if (editingProject) {
                await axios.put(`http://localhost:3001/api/projects/${editingProject._id}`, projectData, {
                    withCredentials: true
                });
                toast({
                    title: 'Success',
                    description: 'Project updated successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                await axios.post('http://localhost:3001/api/projects', projectData, {
                    withCredentials: true
                });
                toast({
                    title: 'Success',
                    description: 'Project created successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            }
            onClose();
            fetchProjects();
            resetForm();
        } catch (error: any) {
            console.error('Project save error:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to save project',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleAddUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProject) return;
        try {
            await axios.post(`http://localhost:3001/api/projects/${selectedProject._id}/updates`, updateData, {
                withCredentials: true
            });
            toast({
                title: 'Success',
                description: 'Project update added successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            onUpdateClose();
            fetchProjectUpdates(selectedProject._id);
            setUpdateData({ title: '', description: '' });
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to add update',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', status: 'planning' as const, priority: 'medium' as const, budget: 0, progress: 0, startDate: '', endDate: '' });
        setEditingProject(null);
    };

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setFormData({
            name: project.name,
            description: project.description || '',
            status: project.status,
            priority: project.priority,
            budget: project.budget || 0,
            progress: project.progress || 0,
            startDate: project.startDate ? project.startDate.split('T')[0] : '',
            endDate: project.endDate ? project.endDate.split('T')[0] : ''
        });
        onOpen();
    };

    const handleViewUpdates = (project: Project) => {
        setSelectedProject(project);
        fetchProjectUpdates(project._id);
    };

    const handleDelete = (project: Project) => {
        setProjectToDelete(project);
        onDeleteOpen();
    };

    const confirmDelete = async () => {
        if (!projectToDelete) return;
        try {
            await axios.delete(`http://localhost:3001/api/projects/${projectToDelete._id}`, {
                withCredentials: true
            });
            toast({
                title: 'Success',
                description: 'Project deleted successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            fetchProjects();
            onDeleteClose();
            setProjectToDelete(null);
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to delete project',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const getStatusColor = (status: string) => {
        const colors: { [key: string]: string } = {
            planning: 'blue',
            active: 'green',
            'on-hold': 'yellow',
            completed: 'purple',
            cancelled: 'red'
        };
        return colors[status] || 'gray';
    };

    const getPriorityColor = (priority: string) => {
        const colors: { [key: string]: string } = {
            low: 'green',
            medium: 'yellow',
            high: 'orange',
            urgent: 'red'
        };
        return colors[priority] || 'gray';
    };

    if (loading) return <Box>Loading...</Box>;

    return (
        <Box>
            <Tabs>
                <TabList>
                    <Tab>All Projects</Tab>
                    {selectedProject && <Tab>Project Updates</Tab>}
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <HStack justify="space-between" mb={6}>
                            <Heading size="lg">Projects</Heading>
                            {canCreate('projects') && (
                                <Button colorScheme="blue" onClick={() => { resetForm(); onOpen(); }}>Add Project</Button>
                            )}
                        </HStack>

                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Status</Th>
                                    <Th>Priority</Th>
                                    <Th>Progress</Th>
                                    <Th>Budget</Th>
                                    <Th>Manager</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {projects.map((project) => (
                                    <Tr key={project._id}>
                                        <Td>
                                            <VStack align="start" spacing={1}>
                                                <Text fontWeight="medium">{project.name}</Text>
                                                {project.description && (
                                                    <Text fontSize="sm" color="gray.600">{project.description.substring(0, 50)}...</Text>
                                                )}
                                            </VStack>
                                        </Td>
                                        <Td>
                                            <Badge colorScheme={getStatusColor(project.status)}>
                                                {project.status}
                                            </Badge>
                                        </Td>
                                        <Td>
                                            <Badge colorScheme={getPriorityColor(project.priority)}>
                                                {project.priority}
                                            </Badge>
                                        </Td>
                                        <Td>
                                            <VStack align="start" spacing={1}>
                                                <Progress value={project.progress || 0} size="sm" colorScheme="blue" w="100px" />
                                                <Text fontSize="xs">{project.progress || 0}%</Text>
                                            </VStack>
                                        </Td>
                                        <Td>${project.budget || 0}</Td>
                                        <Td>{project.manager?.username || 'Unassigned'}</Td>
                                        <Td>
                                            <HStack spacing={2}>
                                                {canUpdate('projects') && (
                                                    <Button size="sm" colorScheme="blue" variant="outline" onClick={() => handleEdit(project)}>Edit</Button>
                                                )}
                                                {canDelete('projects') && (
                                                    <Button size="sm" colorScheme="red" variant="outline" onClick={() => handleDelete(project)}>Delete</Button>
                                                )}
                                            </HStack>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TabPanel>

                    {selectedProject && (
                        <TabPanel>
                            <HStack justify="space-between" mb={6}>
                                <Heading size="lg">Updates for {selectedProject.name}</Heading>
                                <Button colorScheme="green" onClick={onUpdateOpen}>Add Update</Button>
                            </HStack>

                            <VStack spacing={4} align="stretch">
                                {projectUpdates.map((update) => (
                                    <Box key={update._id} p={4} bg="white" rounded="lg" shadow="sm" borderLeft="4px solid" borderColor="blue.400">
                                        <HStack justify="space-between" mb={2}>
                                            <Text fontWeight="bold">{update.title}</Text>
                                            <Text fontSize="sm" color="gray.500">
                                                {new Date(update.createdAt).toLocaleDateString()} by {update.createdBy.username}
                                            </Text>
                                        </HStack>
                                        <Text>{update.description}</Text>
                                    </Box>
                                ))}
                                {projectUpdates.length === 0 && (
                                    <Text color="gray.500" textAlign="center" py={8}>No updates yet for this project.</Text>
                                )}
                            </VStack>
                        </TabPanel>
                    )}
                </TabPanels>
            </Tabs>

            {/* Project Form Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{editingProject ? 'Edit Project' : 'Add New Project'}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <form onSubmit={handleSubmit}>
                            <FormControl mb={4}>
                                <FormLabel>Project Name</FormLabel>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Description</FormLabel>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </FormControl>
                            <HStack spacing={4} mb={4}>
                                <FormControl>
                                    <FormLabel>Status</FormLabel>
                                    <Select
                                        value={formData.status}
                                        onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                                    >
                                        <option value="planning">Planning</option>
                                        <option value="active">Active</option>
                                        <option value="on-hold">On Hold</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Priority</FormLabel>
                                    <Select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </Select>
                                </FormControl>
                            </HStack>
                            <HStack spacing={4} mb={4}>
                                <FormControl>
                                    <FormLabel>Budget ($)</FormLabel>
                                    <Input
                                        type="number"
                                        value={formData.budget}
                                        onChange={(e) => setFormData({...formData, budget: Number(e.target.value)})}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Progress (%)</FormLabel>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData.progress}
                                        onChange={(e) => setFormData({...formData, progress: Number(e.target.value)})}
                                    />
                                </FormControl>
                            </HStack>
                            <HStack spacing={4} mb={4}>
                                <FormControl>
                                    <FormLabel>Start Date</FormLabel>
                                    <Input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>End Date</FormLabel>
                                    <Input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                    />
                                </FormControl>
                            </HStack>
                            <HStack spacing={3}>
                                <Button type="submit" colorScheme="blue">
                                    {editingProject ? 'Update Project' : 'Create Project'}
                                </Button>
                                <Button onClick={() => { onClose(); resetForm(); }}>Cancel</Button>
                            </HStack>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Project Update Modal */}
            <Modal isOpen={isUpdateOpen} onClose={onUpdateClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Project Update</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <form onSubmit={handleAddUpdate}>
                            <FormControl mb={4}>
                                <FormLabel>Update Title</FormLabel>
                                <Input
                                    value={updateData.title}
                                    onChange={(e) => setUpdateData({...updateData, title: e.target.value})}
                                    required
                                />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Description</FormLabel>
                                <Textarea
                                    value={updateData.description}
                                    onChange={(e) => setUpdateData({...updateData, description: e.target.value})}
                                    required
                                />
                            </FormControl>
                            <HStack spacing={3}>
                                <Button type="submit" colorScheme="green">Add Update</Button>
                                <Button onClick={() => { onUpdateClose(); setUpdateData({ title: '', description: '' }); }}>Cancel</Button>
                            </HStack>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete Project</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Text>Are you sure you want to delete the project "{projectToDelete?.name}"?</Text>
                        <Text mt={2} color="red.500" fontSize="sm">This action cannot be undone.</Text>
                        <HStack spacing={3} mt={6}>
                            <Button colorScheme="red" onClick={confirmDelete}>Delete</Button>
                            <Button onClick={onDeleteClose}>Cancel</Button>
                        </HStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default ProjectList;