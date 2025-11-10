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
    VStack
} from '@chakra-ui/react';
import axios from 'axios';
import usePermissions from '../../hooks/usePermissions';

interface Meeting {
    _id: string;
    title: string;
    projectId: { _id: string; name: string };
    companyName: string;
    meetingDate: string;
    meetingTime: string;
    duration: number;
    attendees: string[];
    location?: string;
    meetingType: 'onboarding' | 'kickoff' | 'review' | 'planning';
    status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
    notes?: string;
}

const HR: React.FC = () => {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
    const [meetingToDelete, setMeetingToDelete] = useState<Meeting | null>(null);
    const [formData, setFormData] = useState<{
        title: string;
        projectId: string;
        companyName: string;
        meetingDate: string;
        meetingTime: string;
        duration: number;
        attendees: string;
        location: string;
        meetingType: 'onboarding' | 'kickoff' | 'review' | 'planning';
        status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
        notes: string;
    }>({
        title: '',
        projectId: '',
        companyName: '',
        meetingDate: '',
        meetingTime: '',
        duration: 60,
        attendees: '',
        location: '',
        meetingType: 'onboarding',
        status: 'scheduled',
        notes: ''
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const toast = useToast();
    const { canCreate, canUpdate, canDelete } = usePermissions();

    useEffect(() => {
        fetchMeetings();
        fetchProjects();
    }, []);

    const fetchMeetings = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/hr/meetings', {
                withCredentials: true
            });
            setMeetings(response.data.data || []);
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to fetch meetings',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/projects', {
                withCredentials: true
            });
            setProjects(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const meetingData = {
                ...formData,
                attendees: formData.attendees.split(',').map(a => a.trim()).filter(a => a)
            };

            if (editingMeeting) {
                await axios.put(`http://localhost:3001/api/hr/meetings/${editingMeeting._id}`, meetingData, {
                    withCredentials: true
                });
                toast({
                    title: 'Success',
                    description: 'Meeting updated successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                await axios.post('http://localhost:3001/api/hr/meetings', meetingData, {
                    withCredentials: true
                });
                toast({
                    title: 'Success',
                    description: 'Meeting scheduled successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            }
            onClose();
            fetchMeetings();
            resetForm();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to save meeting',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            projectId: '',
            companyName: '',
            meetingDate: '',
            meetingTime: '',
            duration: 60,
            attendees: '',
            location: '',
            meetingType: 'onboarding' as const,
            status: 'scheduled' as const,
            notes: ''
        });
        setEditingMeeting(null);
    };

    const handleEdit = (meeting: Meeting) => {
        setEditingMeeting(meeting);
        setFormData({
            title: meeting.title,
            projectId: meeting.projectId._id,
            companyName: meeting.companyName,
            meetingDate: meeting.meetingDate.split('T')[0],
            meetingTime: meeting.meetingTime,
            duration: meeting.duration,
            attendees: meeting.attendees.join(', '),
            location: meeting.location || '',
            meetingType: meeting.meetingType,
            status: meeting.status,
            notes: meeting.notes || ''
        });
        onOpen();
    };

    const handleDelete = (meeting: Meeting) => {
        setMeetingToDelete(meeting);
        onDeleteOpen();
    };

    const confirmDelete = async () => {
        if (!meetingToDelete) return;
        try {
            await axios.delete(`http://localhost:3001/api/hr/meetings/${meetingToDelete._id}`, {
                withCredentials: true
            });
            toast({
                title: 'Success',
                description: 'Meeting deleted successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            fetchMeetings();
            onDeleteClose();
            setMeetingToDelete(null);
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to delete meeting',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const getStatusColor = (status: string) => {
        const colors: { [key: string]: string } = {
            scheduled: 'blue',
            completed: 'green',
            cancelled: 'red',
            rescheduled: 'yellow'
        };
        return colors[status] || 'gray';
    };

    if (loading) return <Box>Loading...</Box>;

    return (
        <Box>
            <HStack justify="space-between" mb={6}>
                <Heading size="lg">Onboarding Meetings</Heading>
                {canCreate('hr') && (
                    <Button colorScheme="blue" onClick={() => { resetForm(); onOpen(); }}>
                        Schedule Meeting
                    </Button>
                )}
            </HStack>

            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Title</Th>
                        <Th>Company</Th>
                        <Th>Project</Th>
                        <Th>Date</Th>
                        <Th>Time</Th>
                        <Th>Type</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {meetings.map((meeting) => (
                        <Tr key={meeting._id}>
                            <Td>{meeting.title}</Td>
                            <Td>{meeting.companyName}</Td>
                            <Td>{meeting.projectId?.name || 'N/A'}</Td>
                            <Td>{new Date(meeting.meetingDate).toLocaleDateString()}</Td>
                            <Td>{meeting.meetingTime}</Td>
                            <Td>
                                <Badge colorScheme="purple">{meeting.meetingType}</Badge>
                            </Td>
                            <Td>
                                <Badge colorScheme={getStatusColor(meeting.status)}>
                                    {meeting.status}
                                </Badge>
                            </Td>
                            <Td>
                                <HStack spacing={2}>
                                    {canUpdate('hr') && (
                                        <Button size="sm" colorScheme="blue" variant="outline" onClick={() => handleEdit(meeting)}>
                                            Edit
                                        </Button>
                                    )}
                                    {canDelete('hr') && (
                                        <Button size="sm" colorScheme="red" variant="outline" onClick={() => handleDelete(meeting)}>
                                            Delete
                                        </Button>
                                    )}
                                </HStack>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>

            {/* Meeting Form Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{editingMeeting ? 'Edit Meeting' : 'Schedule New Meeting'}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <form onSubmit={handleSubmit}>
                            <VStack spacing={4}>
                                <FormControl isRequired>
                                    <FormLabel>Meeting Title</FormLabel>
                                    <Input
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Project</FormLabel>
                                    <Select
                                        value={formData.projectId}
                                        onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                                    >
                                        <option value="">Select Project</option>
                                        {projects.map(p => (
                                            <option key={p._id} value={p._id}>{p.name}</option>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Company Name</FormLabel>
                                    <Input
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                                    />
                                </FormControl>
                                <HStack w="full">
                                    <FormControl isRequired>
                                        <FormLabel>Date</FormLabel>
                                        <Input
                                            type="date"
                                            value={formData.meetingDate}
                                            onChange={(e) => setFormData({...formData, meetingDate: e.target.value})}
                                        />
                                    </FormControl>
                                    <FormControl isRequired>
                                        <FormLabel>Time</FormLabel>
                                        <Input
                                            type="time"
                                            value={formData.meetingTime}
                                            onChange={(e) => setFormData({...formData, meetingTime: e.target.value})}
                                        />
                                    </FormControl>
                                </HStack>
                                <HStack w="full">
                                    <FormControl>
                                        <FormLabel>Duration (minutes)</FormLabel>
                                        <Input
                                            type="number"
                                            value={formData.duration}
                                            onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Meeting Type</FormLabel>
                                        <Select
                                            value={formData.meetingType}
                                            onChange={(e) => setFormData({...formData, meetingType: e.target.value as any})}
                                        >
                                            <option value="onboarding">Onboarding</option>
                                            <option value="kickoff">Kickoff</option>
                                            <option value="review">Review</option>
                                            <option value="planning">Planning</option>
                                        </Select>
                                    </FormControl>
                                </HStack>
                                <FormControl>
                                    <FormLabel>Attendees (comma separated)</FormLabel>
                                    <Input
                                        value={formData.attendees}
                                        onChange={(e) => setFormData({...formData, attendees: e.target.value})}
                                        placeholder="John Doe, Jane Smith"
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Location</FormLabel>
                                    <Select
                                        value={formData.location}
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                    >
                                        <option value="">Select Location</option>
                                        <option value="onsite">Onsite</option>
                                        <option value="online">Online</option>
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Status</FormLabel>
                                    <Select
                                        value={formData.status}
                                        onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                                    >
                                        <option value="scheduled">Scheduled</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="rescheduled">Rescheduled</option>
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Notes</FormLabel>
                                    <Textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                    />
                                </FormControl>
                                <HStack spacing={3} w="full">
                                    <Button type="submit" colorScheme="blue" w="full">
                                        {editingMeeting ? 'Update Meeting' : 'Schedule Meeting'}
                                    </Button>
                                    <Button onClick={() => { onClose(); resetForm(); }} w="full">Cancel</Button>
                                </HStack>
                            </VStack>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete Meeting</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Text>Are you sure you want to delete the meeting "{meetingToDelete?.title}"?</Text>
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

export default HR;
