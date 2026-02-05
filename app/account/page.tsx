'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Heading,
  Text,
  Stack,
  VStack,
  HStack,
  Spinner,
  Alert,
  AlertIcon,
  Divider,
  Badge,
} from '@chakra-ui/react'
import { supabase } from '@/lib/db/supabase'

interface UserData {
  email: string
  created_at: string
}

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check authentication - use getUser() which refreshes session if needed
        const { data: { user: authUser }, error: userError } = await supabase().auth.getUser()
        
        if (userError || !authUser) {
          console.error('Error getting user:', userError)
          // If getUser fails, try getSession as fallback
          const { data: { session }, error: sessionError } = await supabase().auth.getSession()
          if (sessionError || !session) {
            setError('Error checking authentication')
            setIsLoading(false)
            router.push('/login?redirect=/account')
            return
          }
          setUser(session.user)
          
          // Fetch user data from public.users table
          const { data: userRecord, error: dbError } = await supabase()
            .from('users')
            .select('created_at')
            .eq('id', session.user.id)
            .single()
          
          if (dbError) {
            console.error('Error fetching user data:', dbError)
            setUserData({
              email: session.user.email || '',
              created_at: session.user.created_at || new Date().toISOString(),
            })
          } else {
            setUserData({
              email: session.user.email || '',
              created_at: userRecord?.created_at || session.user.created_at || new Date().toISOString(),
            })
          }
          setIsLoading(false)
          return
        }

        // We have a valid user
        setUser(authUser)

        // Fetch user data from public.users table
        const { data: userRecord, error: dbError } = await supabase()
          .from('users')
          .select('created_at')
          .eq('id', authUser.id)
          .single()

        if (dbError) {
          console.error('Error fetching user data:', dbError)
          // Still show email even if we can't get creation date
          setUserData({
            email: authUser.email || '',
            created_at: authUser.created_at || new Date().toISOString(),
          })
        } else {
          setUserData({
            email: authUser.email || '',
            created_at: userRecord?.created_at || authUser.created_at || new Date().toISOString(),
          })
        }

        setIsLoading(false)
      } catch (err) {
        console.error('Unexpected error:', err)
        setError('An unexpected error occurred')
        setIsLoading(false)
      }
    }

    fetchUserData()

    // Listen for auth changes
    const { data: { subscription } } = supabase().auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login?redirect=/account')
      } else {
        setUser(session.user)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  if (isLoading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
        <VStack spacing={4}>
          <Spinner size="xl" color="primary.500" />
          <Text color="gray.600">Loading account information...</Text>
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

  if (!user || !userData) {
    return null // Will redirect
  }

  return (
    <Box minH="100vh" bg="gray.50" p={8}>
      <Stack gap={6} align="stretch" maxW="800px" mx="auto">
        <Heading as="h1" size="3xl" color="gray.800">
          Account Information
        </Heading>
        
        <Box p={6} bg="white" borderRadius="md" boxShadow="sm">
          <VStack align="stretch" spacing={6}>
            <Box>
              <Heading as="h2" size="xl" color="gray.800" mb={4}>
                Profile Details
              </Heading>
              <Divider mb={4} />
            </Box>

            <VStack align="stretch" spacing={4}>
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1} fontWeight="semibold">
                  Email Address
                </Text>
                <HStack spacing={2} align="center">
                  <Text fontSize="md" color="gray.800">
                    {userData.email}
                  </Text>
                  <Badge colorScheme="green" fontSize="xs">
                    Verified
                  </Badge>
                </HStack>
              </Box>

              <Box>
                <Text fontSize="sm" color="gray.600" mb={1} fontWeight="semibold">
                  Account Created
                </Text>
                <Text fontSize="md" color="gray.800">
                  {formatDate(userData.created_at)}
                </Text>
              </Box>

              <Box>
                <Text fontSize="sm" color="gray.600" mb={1} fontWeight="semibold">
                  User ID
                </Text>
                <Text fontSize="xs" color="gray.500" fontFamily="mono">
                  {user.id}
                </Text>
              </Box>
            </VStack>
          </VStack>
        </Box>

        <Box p={6} bg="white" borderRadius="md" boxShadow="sm">
          <VStack align="stretch" spacing={4}>
            <Heading as="h2" size="lg" color="gray.800">
              Account Settings
            </Heading>
            <Divider />
            <Text color="gray.600" fontSize="sm">
              Account settings and preferences will be available in future updates.
            </Text>
            <Text color="gray.500" fontSize="xs" fontStyle="italic">
              Coming soon: Password change, email update, notification preferences, and more.
            </Text>
          </VStack>
        </Box>
      </Stack>
    </Box>
  )
}
