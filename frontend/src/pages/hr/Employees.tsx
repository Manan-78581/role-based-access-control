import React from 'react';
import { Box, Heading, Button, VStack, Text } from '@chakra-ui/react';
import usePermissions from '../../hooks/usePermissions';

const Employees: React.FC = () => {
  const { canCreate } = usePermissions();

  return (
    <Box>
      <Heading mb={4}>Employees</Heading>
      <VStack align="start" spacing={4}>
        {canCreate('hr') && <Button colorScheme="primary">Add Employee</Button>}
        <Text color="mutedText">Employee directory placeholder.</Text>
      </VStack>
    </Box>
  );
};

export default Employees;
