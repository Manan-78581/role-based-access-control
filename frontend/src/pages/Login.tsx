import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { LoginData } from '../types';

const Login: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
    const { 
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting } 
    } = useForm<LoginData>();

    const onSubmit: SubmitHandler<LoginData> = async (data) => {
        try {
            await login(data.email, data.password);
            const from = (location.state as any)?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to login',
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
                    <Heading fontSize="2xl">Sign in to your account</Heading>
                    <Text fontSize="md" color="mutedText">
                        Don't have an account?{' '}
                        <Link as={RouterLink} to="/register" color="blue.500">
                            Register
                        </Link>
                    </Text>
                </Stack>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={4}>
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
                            Sign in
                        </Button>
                    </Stack>
                </form>
            </Stack>
        </Box>
    );
};

export default Login;