'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  Heading,
  Text,
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { supabase } from '@/lib/db/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState('')

  // Validate email format
  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!value) {
      setEmailError('Email is required')
      return false
    }
    if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email address')
      return false
    }
    setEmailError('')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate email
    const isEmailValid = validateEmail(email)
    if (!isEmailValid) {
      return
    }

    if (!password) {
      setError('Password is required')
      return
    }

    setIsLoading(true)

    try {
      // Sign in user with Supabase Auth
      const { data, error: loginError } = await supabase().auth.signInWithPassword({
        email,
        password,
      })

      if (loginError) {
        // Handle specific Supabase errors
        const errorMessage = loginError.message.toLowerCase()
        
        // Check for rate limiting errors
        if (
          errorMessage.includes('rate limit') ||
          errorMessage.includes('too many requests') ||
          loginError.status === 429
        ) {
          setError('Too many login attempts. Please wait a few minutes before trying again.')
        }
        // Check for invalid credentials
        else if (
          errorMessage.includes('invalid login credentials') ||
          errorMessage.includes('invalid credentials') ||
          errorMessage.includes('email not confirmed') ||
          errorMessage.includes('wrong password') ||
          loginError.status === 400
        ) {
          setError('Invalid email or password. Please check your credentials and try again.')
        }
        // Check for email confirmation required
        else if (
          errorMessage.includes('email not confirmed') ||
          errorMessage.includes('confirmation')
        ) {
          setError('Please confirm your email address before logging in. Check your inbox for a confirmation email.')
        }
        else {
          // Log the actual error for debugging
          console.error('Login error:', loginError)
          setError(loginError.message || 'An error occurred during login. Please try again.')
        }
        setIsLoading(false)
        return
      }

      // Verify we have a session
      if (!data.session) {
        setError('Login successful but unable to create session. Please try again.')
        setIsLoading(false)
        return
      }

      // Success - user is logged in
      // Check if there's a redirect parameter
      const searchParams = new URLSearchParams(window.location.search)
      const redirectTo = searchParams.get('redirect')
      
      // Redirect to intended page or dashboard
      if (redirectTo && redirectTo.startsWith('/')) {
        router.push(redirectTo)
      } else {
        router.push('/dashboard')
      }
      
      // Force a refresh to update middleware state
      router.refresh()
    } catch (err) {
      console.error('Unexpected login error:', err)
      setError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50" p={4}>
      <Box
        w="100%"
        maxW="400px"
        bg="white"
        p={8}
        borderRadius="md"
        boxShadow="sm"
      >
        <VStack spacing={6} align="stretch">
          <Heading as="h1" size="2xl" textAlign="center" color="gray.800">
            Log In
          </Heading>
          
          <Text textAlign="center" color="gray.600">
            Sign in to access your account
          </Text>

          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle>Login Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Box>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl isInvalid={!!emailError}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (emailError) validateEmail(e.target.value)
                  }}
                  onBlur={() => validateEmail(email)}
                  placeholder="your@email.com"
                  disabled={isLoading}
                />
                {emailError && <FormErrorMessage>{emailError}</FormErrorMessage>}
              </FormControl>

              <FormControl>
                <Flex justify="space-between" align="center" mb={2}>
                  <FormLabel mb={0}>Password</FormLabel>
                  <Link href="/forgot-password" style={{ fontSize: '14px', color: 'var(--chakra-colors-primary-500)' }}>
                    Forgot password?
                  </Link>
                </Flex>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="primary"
                size="lg"
                w="100%"
                isLoading={isLoading}
                loadingText="Logging in..."
              >
                Log In
              </Button>
            </VStack>
          </form>

          <Text textAlign="center" fontSize="sm" color="gray.600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" style={{ color: 'var(--chakra-colors-primary-500)', fontWeight: '600' }}>
              Sign up
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  )
}
