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
    Progress,
    Badge,
    useColorModeValue,
    Spinner
} from '@chakra-ui/react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsData {
    totalRevenue: number;
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalLeads: number;
    totalMeetings: number;
    projectsByStatus: { [key: string]: number };
    growthRate: number;
}

interface TimeSeriesData {
    month: string;
    revenue: number;
    projects: number;
}

const Analytics: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<AnalyticsData>({
        totalRevenue: 0,
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        totalLeads: 0,
        totalMeetings: 0,
        projectsByStatus: {},
        growthRate: 0
    });

    const bgColor = useColorModeValue('white', 'gray.800');
    const chartBg = useColorModeValue('gray.50', 'gray.700');

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);

    const fetchAnalyticsData = async () => {
        try {
            const [projectsRes, leadsRes, meetingsRes] = await Promise.all([
                axios.get('http://localhost:3001/api/projects', { withCredentials: true }),
                axios.get('http://localhost:3001/api/crm/leads', { withCredentials: true }).catch(() => ({ data: { data: [] } })),
                axios.get('http://localhost:3001/api/hr/meetings', { withCredentials: true }).catch(() => ({ data: { data: [] } }))
            ]);

            const projects = projectsRes.data.data || [];
            const leads = leadsRes.data.data || [];
            const meetings = meetingsRes.data.data || [];

            const totalRevenue = projects.reduce((sum: number, p: any) => sum + (p.budget || 0), 0);
            const activeProjects = projects.filter((p: any) => p.status === 'active').length;
            const completedProjects = projects.filter((p: any) => p.status === 'completed').length;

            const projectsByStatus = projects.reduce((acc: any, p: any) => {
                acc[p.status] = (acc[p.status] || 0) + 1;
                return acc;
            }, {});

            const growthRate = projects.length > 0 ? Math.round((completedProjects / projects.length) * 100) : 0;

            // Generate time series data
            const monthlyData: { [key: string]: { revenue: number; projects: number } } = {};
            projects.forEach((p: any) => {
                const date = new Date(p.createdAt || Date.now());
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                if (!monthlyData[monthKey]) {
                    monthlyData[monthKey] = { revenue: 0, projects: 0 };
                }
                monthlyData[monthKey].revenue += p.budget || 0;
                monthlyData[monthKey].projects += 1;
            });

            const sortedMonths = Object.keys(monthlyData).sort();
            const timeSeries = sortedMonths.map(month => ({
                month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
                revenue: monthlyData[month].revenue,
                projects: monthlyData[month].projects
            }));

            // If only one month of data, create a trend by adding previous months with 0 values
            if (timeSeries.length === 1) {
                const currentDate = new Date(sortedMonths[0] + '-01');
                const previousMonths = [];
                for (let i = 5; i > 0; i--) {
                    const prevDate = new Date(currentDate);
                    prevDate.setMonth(currentDate.getMonth() - i);
                    previousMonths.push({
                        month: prevDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
                        revenue: 0,
                        projects: 0
                    });
                }
                setTimeSeriesData([...previousMonths, ...timeSeries]);
            } else {
                setTimeSeriesData(timeSeries.slice(-6)); // Last 6 months
            }

            setData({
                totalRevenue,
                totalProjects: projects.length,
                activeProjects,
                completedProjects,
                totalLeads: leads.length,
                totalMeetings: meetings.length,
                projectsByStatus,
                growthRate
            });
        } catch (error) {
            console.error('Failed to fetch analytics data:', error);
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
            <Heading mb={6}>Company Analytics</Heading>

            {/* Key Metrics */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
                <Card bg={bgColor}>
                    <CardBody>
                        <Stat>
                            <StatLabel>Total Revenue</StatLabel>
                            <StatNumber color="green.500">${data.totalRevenue.toLocaleString()}</StatNumber>
                            <StatHelpText>All projects combined</StatHelpText>
                        </Stat>
                    </CardBody>
                </Card>

                <Card bg={bgColor}>
                    <CardBody>
                        <Stat>
                            <StatLabel>Total Projects</StatLabel>
                            <StatNumber color="blue.500">{data.totalProjects}</StatNumber>
                            <StatHelpText>{data.activeProjects} active</StatHelpText>
                        </Stat>
                    </CardBody>
                </Card>

                <Card bg={bgColor}>
                    <CardBody>
                        <Stat>
                            <StatLabel>Total Leads</StatLabel>
                            <StatNumber color="purple.500">{data.totalLeads}</StatNumber>
                            <StatHelpText>CRM pipeline</StatHelpText>
                        </Stat>
                    </CardBody>
                </Card>

                <Card bg={bgColor}>
                    <CardBody>
                        <Stat>
                            <StatLabel>Scheduled Meetings</StatLabel>
                            <StatNumber color="orange.500">{data.totalMeetings}</StatNumber>
                            <StatHelpText>HR onboarding</StatHelpText>
                        </Stat>
                    </CardBody>
                </Card>
            </SimpleGrid>

            {/* Project Status Distribution */}
            <Card bg={bgColor} mb={8}>
                <CardBody>
                    <Heading size="md" mb={4}>Project Status Distribution</Heading>
                    <VStack spacing={4} align="stretch">
                        {Object.entries(data.projectsByStatus).map(([status, count]) => {
                            const percentage = data.totalProjects > 0 ? (count / data.totalProjects) * 100 : 0;
                            const colors: { [key: string]: string } = {
                                planning: 'blue',
                                active: 'green',
                                'on-hold': 'yellow',
                                completed: 'purple',
                                cancelled: 'red'
                            };
                            return (
                                <Box key={status}>
                                    <HStack justify="space-between" mb={2}>
                                        <HStack>
                                            <Badge colorScheme={colors[status] || 'gray'}>{status}</Badge>
                                            <Text fontSize="sm">{count} projects</Text>
                                        </HStack>
                                        <Text fontSize="sm" fontWeight="bold">{percentage.toFixed(1)}%</Text>
                                    </HStack>
                                    <Progress value={percentage} colorScheme={colors[status] || 'gray'} size="sm" />
                                </Box>
                            );
                        })}
                    </VStack>
                </CardBody>
            </Card>

            {/* Time Series Graph */}
            <Card bg={bgColor} mb={8}>
                <CardBody>
                    <Heading size="md" mb={6}>Revenue & Onboarded Projects Over Time</Heading>
                    {timeSeriesData.length > 0 ? (
                        <Box h="350px">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={timeSeriesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis dataKey="month" />
                                    <YAxis yAxisId="left" stroke="#48BB78" label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft' }} />
                                    <YAxis yAxisId="right" orientation="right" stroke="#4299E1" label={{ value: 'Projects', angle: 90, position: 'insideRight' }} />
                                    <Tooltip />
                                    <Legend />
                                    <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#48BB78" strokeWidth={3} name="Revenue" dot={{ r: 5 }} />
                                    <Line yAxisId="right" type="monotone" dataKey="projects" stroke="#4299E1" strokeWidth={3} strokeDasharray="5 5" name="Onboarded Projects" dot={{ r: 5 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                    ) : (
                        <Box textAlign="center" py={8}>
                            <Text color="gray.500">No time series data available</Text>
                        </Box>
                    )}
                </CardBody>
            </Card>

            {/* Growth Metrics */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Card bg={bgColor}>
                    <CardBody>
                        <Heading size="md" mb={4}>Company Growth</Heading>
                        <VStack spacing={4} align="stretch">
                            <Box p={4} bg={chartBg} rounded="md">
                                <HStack justify="space-between">
                                    <Text fontWeight="medium">Completion Rate</Text>
                                    <Badge colorScheme="green" fontSize="lg">{data.growthRate}%</Badge>
                                </HStack>
                                <Progress value={data.growthRate} colorScheme="green" size="lg" mt={2} />
                            </Box>
                            <Box p={4} bg={chartBg} rounded="md">
                                <HStack justify="space-between">
                                    <Text fontWeight="medium">Active Projects</Text>
                                    <Text fontSize="lg" fontWeight="bold">{data.activeProjects}</Text>
                                </HStack>
                            </Box>
                            <Box p={4} bg={chartBg} rounded="md">
                                <HStack justify="space-between">
                                    <Text fontWeight="medium">Completed Projects</Text>
                                    <Text fontSize="lg" fontWeight="bold">{data.completedProjects}</Text>
                                </HStack>
                            </Box>
                        </VStack>
                    </CardBody>
                </Card>

                <Card bg={bgColor}>
                    <CardBody>
                        <Heading size="md" mb={6}>Revenue Insights</Heading>
                        <VStack spacing={6} align="stretch">
                            {/* Circular Chart for Total Revenue */}
                            <Box position="relative" display="flex" justifyContent="center" alignItems="center" h="250px">
                                <Box position="relative" w="200px" h="200px">
                                    <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
                                        <circle
                                            cx="100"
                                            cy="100"
                                            r="80"
                                            fill="none"
                                            stroke={chartBg}
                                            strokeWidth="20"
                                        />
                                        <circle
                                            cx="100"
                                            cy="100"
                                            r="80"
                                            fill="none"
                                            stroke="url(#gradient1)"
                                            strokeWidth="20"
                                            strokeDasharray={`${2 * Math.PI * 80}`}
                                            strokeDashoffset={`${2 * Math.PI * 80 * (1 - data.growthRate / 100)}`}
                                            strokeLinecap="round"
                                        />
                                        <defs>
                                            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#48BB78" />
                                                <stop offset="100%" stopColor="#38A169" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <Box
                                        position="absolute"
                                        top="50%"
                                        left="50%"
                                        transform="translate(-50%, -50%)"
                                        textAlign="center"
                                    >
                                        <Text fontSize="3xl" fontWeight="bold" color="green.500">
                                            ${(data.totalRevenue / 1000).toFixed(1)}K
                                        </Text>
                                        <Text fontSize="xs" color="gray.500">Total Revenue</Text>
                                    </Box>
                                </Box>
                            </Box>

                            {/* Gradient Bars */}
                            <VStack spacing={4}>
                                <Box w="full" p={4} bg={chartBg} rounded="lg" position="relative" overflow="hidden">
                                    <HStack justify="space-between" mb={2}>
                                        <Text fontWeight="medium" fontSize="sm">Average Project Value</Text>
                                        <Text fontSize="lg" fontWeight="bold" color="blue.500">
                                            ${data.totalProjects > 0 ? Math.round(data.totalRevenue / data.totalProjects).toLocaleString() : 0}
                                        </Text>
                                    </HStack>
                                    <Box
                                        position="absolute"
                                        bottom="0"
                                        left="0"
                                        h="4px"
                                        w="full"
                                        bgGradient="linear(to-r, blue.400, blue.600)"
                                    />
                                </Box>

                                <Box w="full" p={4} bg={chartBg} rounded="lg" position="relative" overflow="hidden">
                                    <HStack justify="space-between" mb={2}>
                                        <Text fontWeight="medium" fontSize="sm">Revenue per Completed</Text>
                                        <Text fontSize="lg" fontWeight="bold" color="purple.500">
                                            ${data.completedProjects > 0 ? Math.round(data.totalRevenue / data.completedProjects).toLocaleString() : 0}
                                        </Text>
                                    </HStack>
                                    <Box
                                        position="absolute"
                                        bottom="0"
                                        left="0"
                                        h="4px"
                                        w="full"
                                        bgGradient="linear(to-r, purple.400, purple.600)"
                                    />
                                </Box>

                                <Box w="full" p={4} bg={chartBg} rounded="lg" position="relative" overflow="hidden">
                                    <HStack justify="space-between" mb={2}>
                                        <Text fontWeight="medium" fontSize="sm">Growth Rate</Text>
                                        <Text fontSize="lg" fontWeight="bold" color="green.500">
                                            {data.growthRate}%
                                        </Text>
                                    </HStack>
                                    <Box
                                        position="absolute"
                                        bottom="0"
                                        left="0"
                                        h="4px"
                                        w={`${data.growthRate}%`}
                                        bgGradient="linear(to-r, green.400, green.600)"
                                        transition="width 1s ease"
                                    />
                                </Box>
                            </VStack>
                        </VStack>
                    </CardBody>
                </Card>
            </SimpleGrid>
        </Box>
    );
};

export default Analytics;
