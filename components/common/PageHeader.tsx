"use client"

import { ReactNode } from 'react'
import { Box, Heading, Text, Flex, Stack } from '@chakra-ui/react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <Box mb={6}>
      <Flex
        align={{ base: 'flex-start', md: 'center' }}
        justify="space-between"
        flexDir={{ base: 'column', md: 'row' }}
        gap={4}
      >
        <Stack spacing={2}>
          <Heading as="h1" size="xl" color="gray.800">
            {title}
          </Heading>
          {subtitle && (
            <Text fontSize="md" color="gray.600" maxW="2xl">
              {subtitle}
            </Text>
          )}
        </Stack>
        {actions && (
          <Flex gap={3} flexShrink={0}>
            {actions}
          </Flex>
        )}
      </Flex>
    </Box>
  )
}
