import React from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import usePermissions from '../../hooks/usePermissions';

const UsersAdmin: React.FC = () => {
  const { canRead, canCreate } = usePermissions();

  if (!canRead('users')) {
    return <Box><Text color="mutedText">Access denied</Text></Box>;
  }

  return (
    <Box>
      <Heading mb={4}>User Management</Heading>
      {canCreate('users') && <Button colorScheme="primary">Invite User</Button>}
      <Text color="mutedText" mt={4}>User list and CRUD operations go here.</Text>
    </Box>
  );
};

export default UsersAdmin;
