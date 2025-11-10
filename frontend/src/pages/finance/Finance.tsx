import React, { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Card,
    CardBody,
    VStack,
    HStack,
    Text,
    Badge,
    useColorModeValue,
    Spinner
} from '@chakra-ui/react';
import axios from 'axios';

interface RevenueData {
    totalRevenue: number;
    projectRevenue: number;
    completedProjects: number;
    activeProjects: number;
}

const Finance: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [revenueData, setRevenueData] = useState<RevenueData>({
        totalRevenue: 0,
        projectRevenue: 0,
        completedProjects: 0,
        activeProjects: 0
    });

    const bgColor = useColorModeValue('white', 'gray.800');
    const summaryBg = useColorModeValue('gray.50', 'gray.700');

    useEffect(() => {
        fetchRevenueData();
    }, []);

    const fetchRevenueData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/projects', {
                withCredentials: true
            });
            
            const projects = response.data.data || [];
            
            const totalRevenue = projects.reduce((sum: number, project: any) => {
                return sum + (project.budget || 0);
            }, 0);
            
            const projectRevenue = projects
                .filter((p: any) => p.status === 'completed')
                .reduce((sum: number, project: any) => sum + (project.budget || 0), 0);
            
            const completedProjects = projects.filter((p: any) => p.status === 'completed').length;
            const activeProjects = projects.filter((p: any) => p.status === 'active').length;
            
            setRevenueData({
                totalRevenue,
                projectRevenue,
                completedProjects,
                activeProjects
            });
        } catch (error) {
            console.error('Failed to fetch revenue data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" h="400px">
                <Spinner size="xl" />
            </Box>
        );
    }

    return (
        <Box>
            <Heading mb={6}>Finance Overview</Heading>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
                <Card bg={bgColor}>
                    <CardBody>
                        <Stat>
                            <StatLabel>Total Revenue</StatLabel>
                            <StatNumber color="green.500">${revenueData.totalRevenue.toLocaleString()}</StatNumber>
                            <StatHelpText>All projects combined</StatHelpText>
                        </Stat>
                    </CardBody>
                </Card>

                <Card bg={bgColor}>
                    <CardBody>
                        <Stat>
                            <StatLabel>Completed Projects Revenue</StatLabel>
                            <StatNumber color="blue.500">${revenueData.projectRevenue.toLocaleString()}</StatNumber>
                            <StatHelpText>From completed projects</StatHelpText>
                        </Stat>
                    </CardBody>
                </Card>

                <Card bg={bgColor}>
                    <CardBody>
                        <Stat>
                            <StatLabel>Completed Projects</StatLabel>
                            <StatNumber>{revenueData.completedProjects}</StatNumber>
                            <StatHelpText>Total completed</StatHelpText>
                        </Stat>
                    </CardBody>
                </Card>

                <Card bg={bgColor}>
                    <CardBody>
                        <Stat>
                            <StatLabel>Active Projects</StatLabel>
                            <StatNumber>{revenueData.activeProjects}</StatNumber>
                            <StatHelpText>Currently in progress</StatHelpText>
                        </Stat>
                    </CardBody>
                </Card>
            </SimpleGrid>

            <Card bg={bgColor}>
                <CardBody>
                    <Heading size="md" mb={4}>Revenue Summary</Heading>
                    <VStack spacing={4} align="stretch">
                        <HStack justify="space-between" p={3} bg={summaryBg} rounded="md">
                            <Text fontWeight="medium">Organization Total Revenue:</Text>
                            <Badge colorScheme="green" fontSize="lg" p={2}>
                                ${revenueData.totalRevenue.toLocaleString()}
                            </Badge>
                        </HStack>
                        <HStack justify="space-between" p={3} bg={summaryBg} rounded="md">
                            <Text fontWeight="medium">Average Project Value:</Text>
                            <Text fontSize="lg" fontWeight="bold">
                                ${revenueData.completedProjects > 0 
                                    ? Math.round(revenueData.totalRevenue / (revenueData.completedProjects + revenueData.activeProjects)).toLocaleString()
                                    : 0}
                            </Text>
                        </HStack>
                        <HStack justify="space-between" p={3} bg={summaryBg} rounded="md">
                            <Text fontWeight="medium">Completion Rate:</Text>
                            <Text fontSize="lg" fontWeight="bold">
                                {revenueData.completedProjects + revenueData.activeProjects > 0
                                    ? Math.round((revenueData.completedProjects / (revenueData.completedProjects + revenueData.activeProjects)) * 100)
                                    : 0}%
                            </Text>
                        </HStack>
                    </VStack>
                </CardBody>
            </Card>
        </Box>
    );
};

export default Finance;
