'use client'

import { Box, Button, Heading, Text, Stack, Flex } from '@chakra-ui/react'

export default function Home() {
  return (
    <Box p={8} minH="100vh" bg="gray.50">
      <Stack gap={6} align="stretch" maxW="1200px" mx="auto">
        <Heading as="h1" size="3xl" color="gray.800">
          nutri_app
        </Heading>
        
        <Text fontSize="md" color="gray.700">
          Learning-first nutrition tracking webapp
        </Text>
        
        <Box p={6} bg="white" borderRadius="md" boxShadow="sm">
          <Heading as="h2" size="2xl" mb={4} color="gray.800">
            Chakra UI Setup Verification
          </Heading>
          
          <Text mb={4} color="gray.700">
            This page demonstrates that Chakra UI is properly configured with the custom theme.
          </Text>
          
          <Stack gap={4} align="stretch">
            <Flex gap={4} wrap="wrap">
              <Button colorScheme="primary">Primary Button</Button>
              <Button colorScheme="secondary">Secondary Button</Button>
              <Button colorScheme="success">Success Button</Button>
              <Button colorScheme="warning">Warning Button</Button>
            </Flex>
            
            <Box p={4} bg="primary.50" borderRadius="md">
              <Text color="primary.700" fontWeight="semibold">
                Primary color background (primary.50)
              </Text>
            </Box>
            
            <Box p={4} bg="gray.100" borderRadius="md">
              <Text color="gray.700">
                Gray background (gray.100) with body text color (gray.700)
              </Text>
            </Box>
            
            <Stack gap={2} align="stretch">
              <Heading as="h3" size="xl" color="gray.800">Heading 3 (20px, semibold)</Heading>
              <Heading as="h4" size="lg" color="gray.800">Heading 4 (18px, semibold)</Heading>
              <Text fontSize="lg">Body Large (18px)</Text>
              <Text fontSize="md">Body Default (16px)</Text>
              <Text fontSize="sm" color="gray.500">Body Small (14px, muted)</Text>
              <Text fontSize="xs" color="gray.500">Caption (12px, muted)</Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
