import React from 'react';
import { Box, Heading, Button, Text } from '@chakra-ui/react';
import usePermissions from '../../hooks/usePermissions';

const Leave: React.FC = () => {
  const { canCreate } = usePermissions();

  return (
    <Box>
      <Heading mb={4}>Leave Requests</Heading>
      {canCreate('hr') && <Button colorScheme="primary">Request Leave</Button>}
      <Text color="mutedText" mt={4}>Leave request list placeholder.</Text>
    </Box>
  );
};

export default Leave;
