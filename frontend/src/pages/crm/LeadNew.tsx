import React, { useState } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  useToast
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { leadService } from '../../services/crm.service';

const LeadNew: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'new',
    value: 0,
    notes: ''
  });
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await leadService.create(form as any);
      toast({ title: 'Lead created', status: 'success', duration: 2500, isClosable: true });
      navigate('/crm');
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to create lead', status: 'error', duration: 3000, isClosable: true });
    }
  };

  return (
    <Box maxW="700px">
      <Heading mb={4}>Create Lead</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb={3} isRequired>
          <FormLabel>Name</FormLabel>
          <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </FormControl>
        <FormControl mb={3} isRequired>
          <FormLabel>Email</FormLabel>
          <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </FormControl>
        <FormControl mb={3}>
          <FormLabel>Phone</FormLabel>
          <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        </FormControl>
        <FormControl mb={3}>
          <FormLabel>Company</FormLabel>
          <Input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
        </FormControl>
        <FormControl mb={3}>
          <FormLabel>Status</FormLabel>
          <Select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="proposal">Proposal</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </Select>
        </FormControl>
        <FormControl mb={3}>
          <FormLabel>Notes</FormLabel>
          <Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
        </FormControl>
        <Button type="submit" colorScheme="blue" mr={3}>Create</Button>
        <Button variant="ghost" onClick={() => navigate('/crm')}>Cancel</Button>
      </form>
    </Box>
  );
};

export default LeadNew;
