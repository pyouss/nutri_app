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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { supabase } from '@/lib/db/supabase'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
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
    setSuccess(false)

    // Validate email
    const isEmailValid = validateEmail(email)
    if (!isEmailValid) {
      return
    }

    setIsLoading(true)

    try {
      // Send password reset email
      const { error: resetError } = await supabase().auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (resetError) {
        // Handle specific Supabase errors
        const errorMessage = resetError.message.toLowerCase()
        
        // Check for rate limiting errors
        if (
          errorMessage.includes('rate limit') ||
          errorMessage.includes('too many requests') ||
          resetError.status === 429
        ) {
          setError('Too many password reset attempts. Please wait a few minutes before trying again.')
        }
        // Check for user not found (we'll show success anyway for security)
        else if (
          errorMessage.includes('user not found') ||
          errorMessage.includes('email not found')
        ) {
          // For security, we show success even if user doesn't exist
          setSuccess(true)
          setIsLoading(false)
          return
        }
        else {
          // Log the actual error for debugging
          console.error('Password reset error:', resetError)
          setError(resetError.message || 'An error occurred. Please try again.')
        }
        setIsLoading(false)
        return
      }

      // Success - password reset email sent
      setSuccess(true)
      setIsLoading(false)
    } catch (err) {
      console.error('Unexpected password reset error:', err)
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
            Reset Password
          </Heading>
          
          <Text textAlign="center" color="gray.600">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </Text>

          {success && (
            <Alert status="success" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle>Email Sent</AlertTitle>
                <AlertDescription>
                  If an account exists with this email, you will receive a password reset link shortly.
                </AlertDescription>
              </Box>
            </Alert>
          )}

          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Box>
            </Alert>
          )}

          {!success && (
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

                <Button
                  type="submit"
                  colorScheme="primary"
                  size="lg"
                  w="100%"
                  isLoading={isLoading}
                  loadingText="Sending..."
                >
                  Send Reset Link
                </Button>
              </VStack>
            </form>
          )}

          <Text textAlign="center" fontSize="sm" color="gray.600">
            Remember your password?{' '}
            <Link href="/login" style={{ color: 'var(--chakra-colors-primary-500)', fontWeight: '600' }}>
              Log in
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  )
}
