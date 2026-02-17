"use client"

import { ReactNode, useState } from 'react'
import { Box, Container, Flex, HStack, Button, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/db/supabase'

interface AppShellProps {
  children: ReactNode
}

function NavItem({ href, label }: { href: string; label: string }) {
  const pathname = usePathname()
  const isActive = pathname.startsWith(href)

  return (
    <Button
      as={Link}
      href={href}
      variant={isActive ? 'solid' : 'ghost'}
      size="sm"
      colorScheme="primary"
      borderRadius="full"
    >
      {label}
    </Button>
  )
}

export function AppShell({ children }: AppShellProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      // Attempt Supabase sign-out (server + client)
      const { error } = await supabase().auth.signOut()
      if (error) {
        console.error('Logout error:', error)
      }

      // Hard-clear any lingering Supabase auth tokens in localStorage
      if (typeof window !== 'undefined') {
        try {
          const keys = Object.keys(window.localStorage)
          for (const key of keys) {
            if (key.startsWith('sb-') || key.toLowerCase().includes('supabase')) {
              window.localStorage.removeItem(key)
            }
          }

          // Force a full reload on the login route so all
          // client-side auth state is reset immediately.
          window.location.href = '/login'
          return
        } catch (storageError) {
          console.error('Error clearing local auth storage:', storageError)
        }
      }
    } catch (error) {
      console.error('Unexpected logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <Box minH="100vh" bgGradient="linear(to-b, primary.50, white)">
      <Box
        as="header"
        borderBottomWidth="1px"
        borderColor="gray.100"
        bg="whiteAlpha.900"
        backdropFilter="blur(10px)"
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Container maxW="container.xl" py={3}>
          <Flex align="center" justify="space-between" gap={4}>
            <HStack spacing={2}>
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
              <Text fontWeight="semibold" color="gray.800">
                nutri_app
              </Text>
            </HStack>

            <HStack spacing={2}>
              <NavItem href="/dashboard" label="Dashboard" />
              <NavItem href="/meals" label="Meals" />
              <NavItem href="/nutrition-plan" label="Plan" />
              <NavItem href="/account" label="Account" />
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                isLoading={isLoggingOut}
              >
                Log out
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Container as="main" maxW="container.xl" py={8}>
        {children}
      </Container>
    </Box>
  )
}
