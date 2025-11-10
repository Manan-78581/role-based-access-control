import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

const ProjectDetail: React.FC = () => {
  const { id } = useParams();

  return (
    <Box>
      <Heading mb={4}>Project Detail</Heading>
      <Text color="mutedText">Details for project {id}</Text>
    </Box>
  );
};

export default ProjectDetail;
