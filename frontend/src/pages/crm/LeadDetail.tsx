import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

const LeadDetail: React.FC = () => {
  const { id } = useParams();

  return (
    <Box>
      <Heading mb={4}>Lead Detail</Heading>
      <Text color="mutedText">Details for lead ID: {id}</Text>
    </Box>
  );
};

export default LeadDetail;
