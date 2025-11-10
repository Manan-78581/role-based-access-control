import React from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import usePermissions from '../../hooks/usePermissions';

const TaskNew: React.FC = () => {
  const { canCreate } = usePermissions();

  return (
    <Box>
      <Heading mb={4}>Add Task</Heading>
      {canCreate('projects') ? (
        <Text color="mutedText">Task form placeholder.</Text>
      ) : (
        <Text color="mutedText">You don't have permission to add tasks.</Text>
      )}
    </Box>
  );
};

export default TaskNew;
