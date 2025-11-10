import React, { Component, ErrorInfo, ReactNode } from 'react';
import { 
    Box, 
    Heading, 
    Text, 
    Button, 
    VStack, 
    useColorModeValue 
} from '@chakra-ui/react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error
        };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <Box 
                    p={8} 
                    maxW="600px" 
                    mx="auto" 
                    textAlign="center"
                >
                    <VStack spacing={4}>
                        <Heading size="xl">Oops!</Heading>
                        <Text>Something went wrong. Please try again later.</Text>
                        {process.env.NODE_ENV === 'development' && (
                            <Text 
                                color="red.500" 
                                fontSize="sm" 
                                whiteSpace="pre-wrap"
                            >
                                {this.state.error?.message}
                            </Text>
                        )}
                        <Button 
                            colorScheme="blue"
                            onClick={() => window.location.reload()}
                        >
                            Reload Page
                        </Button>
                    </VStack>
                </Box>
            );
        }

        return this.props.children;
    }
}