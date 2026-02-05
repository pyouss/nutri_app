'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  Link,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { supabase } from '@/lib/db/supabase'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')

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

  // Validate password
  const validatePassword = (value: string): boolean => {
    if (!value) {
      setPasswordError('Password is required')
      return false
    }
    if (value.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return false
    }
    setPasswordError('')
    return true
  }

  // Validate password confirmation
  const validateConfirmPassword = (value: string): boolean => {
    if (!value) {
      setConfirmPasswordError('Please confirm your password')
      return false
    }
    if (value !== password) {
      setConfirmPasswordError('Passwords do not match')
      return false
    }
    setConfirmPasswordError('')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate all fields
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword)

    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return
    }

    setIsLoading(true)

    try {
      // Sign up user with Supabase Auth
      const { data, error: signupError } = await supabase().auth.signUp({
        email,
        password,
      })

      // Log the response for debugging duplicate email issues
      console.log('Signup response:', { 
        hasUser: !!data?.user, 
        hasSession: !!data?.session, 
        hasError: !!signupError,
        errorMessage: signupError?.message,
        errorCode: signupError?.code,
        errorStatus: signupError?.status
      })

      if (signupError) {
        // Handle specific Supabase errors
        const errorMessage = signupError.message.toLowerCase()
        
        // Check for rate limiting errors
        if (
          errorMessage.includes('rate limit') ||
          errorMessage.includes('too many requests') ||
          errorMessage.includes('email rate limit') ||
          errorMessage.includes('too many signup') ||
          signupError.status === 429 // HTTP 429 Too Many Requests
        ) {
          setError(
            'Too many signup attempts. Please wait a few minutes or delete test users in Supabase Dashboard. ' +
            'See DEVELOPMENT_TIPS.md for instructions.'
          )
        }
        // Check for various duplicate email error patterns
        else if (
          errorMessage.includes('already registered') ||
          errorMessage.includes('user already exists') ||
          errorMessage.includes('email already exists') ||
          errorMessage.includes('already exists') ||
          signupError.status === 422 || // Supabase often returns 422 for duplicate emails
          signupError.code === '23505' // PostgreSQL unique constraint violation
        ) {
          setError('This email is already registered. Please log in instead.')
        } else if (errorMessage.includes('password')) {
          setError('Password does not meet requirements. Please use a stronger password.')
        } else {
          // Log the actual error for debugging
          console.error('Signup error:', signupError)
          setError(signupError.message || 'An error occurred during signup. Please try again.')
        }
        setIsLoading(false)
        return
      }

      // Check if user was created but no session (email confirmation required)
      if (data.user && !data.session) {
        // Email confirmation required OR user already exists
        // Check if user was just created (new user) or already existed
        // Try to get session to check if user is already logged in
        const { data: sessionData } = await supabase().auth.getSession()
        
        if (sessionData?.session) {
          // User already has a session - they're already registered
          setError('This email is already registered. Please log in instead.')
          setIsLoading(false)
          return
        }
        
        // No session - email confirmation required for new user
        setError(null)
        // Show success message that email confirmation is required
        alert('Please check your email to confirm your account before logging in.')
        router.push('/login')
        return
      }

      // Verify we have a session before redirecting
      if (!data.session) {
        // This shouldn't happen, but handle it gracefully
        setError('Account created but unable to log in. Please try logging in.')
        setIsLoading(false)
        return
      }

      // Success - user is automatically logged in
      // Redirect to dashboard and refresh to update middleware state
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      console.error('Unexpected signup error:', err)
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
            Create Account
          </Heading>
          
          <Text textAlign="center" color="gray.600">
            Sign up to start tracking your nutrition
          </Text>

          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle>Signup Failed</AlertTitle>
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

              <FormControl isInvalid={!!passwordError}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (passwordError) validatePassword(e.target.value)
                  }}
                  onBlur={() => validatePassword(password)}
                  placeholder="At least 6 characters"
                  disabled={isLoading}
                />
                {passwordError && <FormErrorMessage>{passwordError}</FormErrorMessage>}
              </FormControl>

              <FormControl isInvalid={!!confirmPasswordError}>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (confirmPasswordError) validateConfirmPassword(e.target.value)
                  }}
                  onBlur={() => validateConfirmPassword(confirmPassword)}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
                {confirmPasswordError && <FormErrorMessage>{confirmPasswordError}</FormErrorMessage>}
              </FormControl>

              <Button
                type="submit"
                colorScheme="primary"
                size="lg"
                w="100%"
                isLoading={isLoading}
                loadingText="Creating account..."
              >
                Sign Up
              </Button>
            </VStack>
          </form>

          <Text textAlign="center" fontSize="sm" color="gray.600">
            Already have an account?{' '}
            <Link href="/login" color="primary.500" fontWeight="semibold">
              Log in
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  )
}
