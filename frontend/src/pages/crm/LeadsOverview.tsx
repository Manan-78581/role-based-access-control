import React from 'react';
import { Box, Heading, Button, VStack, Text } from '@chakra-ui/react';
import usePermissions from '../../hooks/usePermissions';
import { Link as RouterLink } from 'react-router-dom';

const LeadsOverview: React.FC = () => {
  const { canCreate } = usePermissions();

  return (
    <Box>
      <Heading mb={4}>Leads</Heading>
      <VStack align="start" spacing={4}>
        {canCreate('crm') && (
          <Button as={RouterLink} to="/crm/new" colorScheme="primary">Add Lead</Button>
        )}
        <Text color="mutedText">This is a placeholder for the Leads overview (kanban + list).</Text>
      </VStack>
    </Box>
  );
};

export default LeadsOverview;
