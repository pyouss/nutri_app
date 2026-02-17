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
import { DailyMacroTracker } from '@/components/features/meals/DailyMacroTracker'
import { PageHeader } from '@/components/common/PageHeader'
import { AppShell } from '@/components/common/AppShell'

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
      <AppShell>
        <VStack spacing={4} py={12} align="center" justify="center">
          <Spinner size="xl" color="primary.500" />
          <Text color="gray.600">Loading...</Text>
        </VStack>
      </AppShell>
    )
  }

  if (error) {
    return (
      <AppShell>
        <Box py={12} display="flex" alignItems="center" justifyContent="center">
          <Alert status="error" maxW="400px">
            <AlertIcon />
            {error}
          </Alert>
        </Box>
      </AppShell>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <AppShell>
      <Stack gap={6} align="stretch">
          <PageHeader
            title="Dashboard"
            subtitle="See today’s macros, recent meals, and your active nutrition phase in one place."
            actions={(
              <HStack spacing={3}>
                <Button as={Link} href="/nutrition-plan" colorScheme="primary" variant="ghost">
                  My plan
                </Button>
                <Button as={Link} href="/meals" colorScheme="primary" variant="outline">
                  View meals
                </Button>
                <Button as={Link} href="/meals/new" colorScheme="primary">
                  Log meal
                </Button>
              </HStack>
            )}
          />

          <DailyMacroTracker />

          <Box p={6} bg="white" borderRadius="lg" boxShadow="sm">
            <VStack align="stretch" spacing={4}>
              <Heading as="h2" size="md" color="gray.800">
                Welcome back, {user.email}
              </Heading>

              <Text color="gray.700">
                You’re on a protected page. Your session is kept in sync so you can safely refresh
                or move between pages without losing access.
              </Text>

              <Box p={4} bg="gray.50" borderRadius="md">
                <Text fontSize="sm" color="gray.600" mb={1}>
                  <strong>Email:</strong> {user.email}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>User ID:</strong> {user.id}
                </Text>
              </Box>

              <Text color="gray.600" fontSize="sm">
                From here you can review your meals, follow your nutrition plan, and keep your
                daily macros on track.
              </Text>
            </VStack>
          </Box>
        </Stack>
    </AppShell>
  )
}
