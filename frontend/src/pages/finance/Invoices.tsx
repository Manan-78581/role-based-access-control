import React from 'react';
import { Box, Heading, Button, Text } from '@chakra-ui/react';
import usePermissions from '../../hooks/usePermissions';

const Invoices: React.FC = () => {
  const { canCreate } = usePermissions();

  return (
    <Box>
      <Heading mb={4}>Invoices</Heading>
      {canCreate('finance') && <Button colorScheme="primary">Create Invoice</Button>}
      <Text color="mutedText" mt={4}>Invoice table placeholder.</Text>
    </Box>
  );
};

export default Invoices;
