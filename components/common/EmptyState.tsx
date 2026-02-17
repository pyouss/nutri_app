'use client'

import { Box, Heading, Text, Button, VStack, Icon } from '@chakra-ui/react'
import Link from 'next/link'

interface EmptyStateProps {
  title: string
  message: string
  actionText: string
  actionHref: string
}

export function EmptyState({
  title,
  message,
  actionText,
  actionHref,
}: EmptyStateProps) {
  return (
    <Box
      textAlign="center"
      py={16}
      px={6}
      bg="gray.50"
      borderRadius="lg"
      border="2px dashed"
      borderColor="gray.300"
    >
      <VStack spacing={4}>
        <Icon
          viewBox="0 0 200 200"
          color="primary.200"
          boxSize={16}
        >
          <path
            fill="currentColor"
            d="M100 20c-33 0-60 27-60 60s27 60 60 60 60-27 60-60-27-60-60-60Zm0 18c23.2 0 42 18.8 42 42s-18.8 42-42 42S58 103.2 58 80s18.8-42 42-42Z"
          />
        </Icon>
        <Heading size="lg" color="gray.700">
          {title}
        </Heading>
        <Text color="gray.600" maxW="md">
          {message}
        </Text>
        <Button
          as={Link}
          href={actionHref}
          colorScheme="green"
          size="lg"
          mt={4}
        >
          {actionText}
        </Button>
      </VStack>
    </Box>
  )
}
