import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Heading,
    Text,
    Link,
    useToast,
    FormErrorMessage,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { RegisterData } from '../types';

const Register: React.FC = () => {
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const { 
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting } 
    } = useForm<RegisterData>();

    const onSubmit: SubmitHandler<RegisterData> = async (data) => {
        try {
            await registerUser(data);
            toast({
                title: 'Success',
                description: 'Registration successful. Please login.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            navigate('/login');
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to register',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box maxW="md" mx="auto" mt={8} p={6} borderRadius="lg" bg="surface" boxShadow="lg">
            <Stack spacing={8}>
                <Stack align="center">
                    <Heading fontSize="2xl">Create new account</Heading>
                    <Text fontSize="md" color="mutedText">
                        Already have an account?{' '}
                        <Link as={RouterLink} to="/login" color="blue.500">
                            Login
                        </Link>
                    </Text>
                </Stack>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={4}>
                        <FormControl id="username" isInvalid={!!errors.username}>
                            <FormLabel>Username</FormLabel>
                            <Input
                                {...register('username', {
                                    required: 'Username is required',
                                    minLength: {
                                        value: 3,
                                        message: 'Username must be at least 3 characters',
                                    },
                                })}
                            />
                            <FormErrorMessage>
                                {errors.username?.message}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl id="email" isInvalid={!!errors.email}>
                            <FormLabel>Email address</FormLabel>
                            <Input
                                type="email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address',
                                    },
                                })}
                            />
                            <FormErrorMessage>
                                {errors.email?.message}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl id="password" isInvalid={!!errors.password}>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters',
                                    },
                                })}
                            />
                            <FormErrorMessage>
                                {errors.password?.message}
                            </FormErrorMessage>
                        </FormControl>

                        <Button
                            type="submit"
                            colorScheme="blue"
                            size="lg"
                            fontSize="md"
                            isLoading={isSubmitting}
                        >
                            Register
                        </Button>
                    </Stack>
                </form>
            </Stack>
        </Box>
    );
};

export default Register;