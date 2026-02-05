'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, Heading, Text, Stack, Flex, Spinner } from '@chakra-ui/react'
import Link from 'next/link'
import { supabase } from '@/lib/db/supabase'
import type { User } from '@supabase/supabase-js'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
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

    // Listen for auth changes
    const { data: { subscription } } = supabase().auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    try {
      const { error } = await supabase().auth.signOut()
      if (error) {
        console.error('Logout error:', error)
        alert('Failed to log out properly. Please try again or clear your browser cookies.')
        return // Don't redirect if logout failed
      }
      // Only redirect on successful logout
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Unexpected logout error:', error)
      alert('An unexpected error occurred during logout. Please clear your browser cookies.')
      // Don't redirect on unexpected errors
    }
  }

  return (
    <Box p={8} minH="100vh" bg="gray.50">
      <Stack gap={6} align="stretch" maxW="1200px" mx="auto">
        <Flex justify="space-between" align="center">
          <Heading as="h1" size="3xl" color="gray.800">
            nutri_app
          </Heading>
          {isLoading ? (
            <Spinner size="sm" color="primary.500" />
          ) : user ? (
            <Stack direction="row" spacing={4} align="center">
              <Button as={Link} href="/meals/new" colorScheme="primary" variant="solid" size="sm">
                Log Meal
              </Button>
              <Button as={Link} href="/account" colorScheme="primary" variant="ghost" size="sm">
                Account
              </Button>
              <Text color="gray.700" fontSize="sm">
                {user.email}
              </Text>
              <Button onClick={handleLogout} colorScheme="primary" variant="outline">
                Log Out
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" spacing={4}>
              <Button as={Link} href="/signup" colorScheme="primary" variant="outline">
                Sign Up
              </Button>
              <Button as={Link} href="/login" colorScheme="primary">
                Log In
              </Button>
            </Stack>
          )}
        </Flex>
        
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
