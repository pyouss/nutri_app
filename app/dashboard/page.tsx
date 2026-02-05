'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Heading,
  Text,
  Stack,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  Button,
  HStack,
} from '@chakra-ui/react'
import Link from 'next/link'
import { supabase } from '@/lib/db/supabase'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase().auth.getSession()
        
        if (sessionError) {
          setError('Error checking authentication')
          setIsLoading(false)
          return
        }

        if (!session) {
          // Redirect to login if not authenticated
          router.push('/login?redirect=/dashboard')
          return
        }

        setUser(session.user)
        setIsLoading(false)
      } catch (err) {
        console.error('Unexpected error:', err)
        setError('An unexpected error occurred')
        setIsLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase().auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login?redirect=/dashboard')
      } else {
        setUser(session.user)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  if (isLoading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
        <VStack spacing={4}>
          <Spinner size="xl" color="primary.500" />
          <Text color="gray.600">Loading...</Text>
        </VStack>
      </Box>
    )
  }

  if (error) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50" p={4}>
        <Alert status="error" maxW="400px">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <Box minH="100vh" bg="gray.50" p={8}>
      <Stack gap={6} align="stretch" maxW="1200px" mx="auto">
        <HStack justify="space-between" align="center">
          <Heading as="h1" size="3xl" color="gray.800">
            Dashboard
          </Heading>
          <HStack spacing={4}>
            <Button as={Link} href="/meals/new" colorScheme="primary" variant="solid">
              Log New Meal
            </Button>
            <Button as={Link} href="/account" colorScheme="primary" variant="outline">
              View Account
            </Button>
          </HStack>
        </HStack>
        
        <Box p={6} bg="white" borderRadius="md" boxShadow="sm">
          <VStack align="stretch" spacing={4}>
            <Heading as="h2" size="xl" color="gray.800">
              Welcome back!
            </Heading>
            
            <Text color="gray.700">
              You are successfully logged in and viewing a protected route.
            </Text>

            <Box p={4} bg="gray.50" borderRadius="md">
              <Text fontSize="sm" color="gray.600" mb={2}>
                <strong>Email:</strong> {user.email}
              </Text>
              <Text fontSize="sm" color="gray.600">
                <strong>User ID:</strong> {user.id}
              </Text>
            </Box>

            <Text color="gray.600" fontSize="sm">
              This is a protected route. Only authenticated users can access this page.
              Try refreshing the page - your session will persist!
            </Text>
          </VStack>
        </Box>
      </Stack>
    </Box>
  )
}
