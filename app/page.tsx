'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Button,
  Heading,
  Text,
  Stack,
  Flex,
  Spinner,
  Container,
  SimpleGrid,
  Icon,
} from '@chakra-ui/react'
import { CheckCircleIcon, TimeIcon, EditIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import { supabase } from '@/lib/db/supabase'
import type { User } from '@supabase/supabase-js'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase().auth.getSession()
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Error checking session:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()

    const { data: { subscription } } = supabase().auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handlePrimaryCta = () => {
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/signup')
    }
  }

  return (
    <Box minH="100vh" bgGradient="linear(to-b, primary.50, white)">
      <Container maxW="container.xl" py={{ base: 10, md: 16 }}>
        {/* Top bar */}
        <Flex justify="space-between" align="center" mb={{ base: 8, md: 12 }}>
          <Flex align="center" gap={2}>
            <Box
              w={8}
              h={8}
              borderRadius="full"
              bg="primary.500"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontWeight="bold" color="white">n</Text>
            </Box>
            <Heading as="h1" size="md" color="gray.800">
              nutri_app
            </Heading>
          </Flex>

          {isLoading ? (
            <Spinner size="sm" color="primary.500" />
          ) : user ? (
            <Flex align="center" gap={3}>
              <Text fontSize="sm" color="gray.600">
                {user.email}
              </Text>
              <Button
                as={Link}
                href="/dashboard"
                colorScheme="primary"
                size="sm"
              >
                Go to dashboard
              </Button>
            </Flex>
          ) : (
            <Flex gap={3}>
              <Button as={Link} href="/login" variant="ghost" size="sm">
                Log in
              </Button>
              <Button as={Link} href="/signup" colorScheme="primary" size="sm">
                Sign up
              </Button>
            </Flex>
          )}
        </Flex>

        {/* Hero section */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 10, md: 16 }} alignItems="center">
          <Stack spacing={6}>
            <Heading as="h2" size="2xl" color="gray.800">
              Build nutrition habits,
              <br /> one meal at a time.
            </Heading>
            <Text fontSize="lg" color="gray.700" maxW="lg">
              A learning-first nutrition tracker that helps you log meals, follow a structured plan,
              and understand how daily choices add up over time.
            </Text>

            <Flex gap={4} wrap="wrap">
              <Button
                colorScheme="primary"
                size="lg"
                onClick={handlePrimaryCta}
              >
                {user ? 'Open dashboard' : 'Get started free'}
              </Button>
              {!user && (
                <Button
                  as={Link}
                  href="/login"
                  variant="outline"
                  size="lg"
                >
                  I already have an account
                </Button>
              )}
            </Flex>

            <Flex gap={6} fontSize="sm" color="gray.600" flexWrap="wrap">
              <Flex align="center" gap={2}>
                <Icon as={CheckCircleIcon} color="success.400" />
                <Text>No calorie math required</Text>
              </Flex>
              <Flex align="center" gap={2}>
                <Icon as={TimeIcon} color="primary.500" />
                <Text>Log a meal in under 30s</Text>
              </Flex>
            </Flex>
          </Stack>

          {/* Highlight card */}
          <Box
            bg="white"
            borderRadius="2xl"
            boxShadow="xl"
            p={6}
          >
            <Stack spacing={5}>
              <Heading as="h3" size="md" color="gray.800">
                Today at a glance
              </Heading>
              <Text fontSize="sm" color="gray.600">
                Track your meals, macros, and follow your nutrition plan from a single dashboard.
              </Text>

              <Stack spacing={3}>
                <Flex justify="space-between" align="center">
                  <Text fontSize="sm" color="gray.600">Logged meals</Text>
                  <Text fontWeight="semibold" color="gray.800">Breakfast, Lunch</Text>
                </Flex>
                <Flex justify="space-between" align="center">
                  <Text fontSize="sm" color="gray.600">Daily macros</Text>
                  <Text fontWeight="semibold" color="primary.600">On track</Text>
                </Flex>
                <Flex justify="space-between" align="center">
                  <Text fontSize="sm" color="gray.600">Active phase</Text>
                  <Text fontWeight="semibold" color="gray.800">Lean gain • Week 3</Text>
                </Flex>
              </Stack>

              <Button
                leftIcon={<Icon as={EditIcon} />}
                colorScheme="primary"
                variant="outline"
                alignSelf="flex-start"
                as={Link}
                href={user ? '/meals/new' : '/signup'}
              >
                {user ? 'Log your next meal' : 'See how it works'}
              </Button>
            </Stack>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  )
}
