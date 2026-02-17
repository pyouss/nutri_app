'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Heading,
  Button,
  Text,
  VStack,
  HStack,
  Spinner,
} from '@chakra-ui/react'
import Link from 'next/link'
import { supabase } from '@/lib/db/supabase'
import { MealList } from '@/components/features/meals/MealList'
import { DailyMacroTracker } from '@/components/features/meals/DailyMacroTracker'
import { QuickAddButton } from '@/components/features/meals/QuickAddFromTemplate'
import type { Meal } from '@/lib/types/meal'
import { PageHeader } from '@/components/common/PageHeader'
import { AppShell } from '@/components/common/AppShell'

export default function MealsPage() {
  const router = useRouter()
  const [meals, setMeals] = useState<Meal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadMeals = async () => {
    try {
      // Check authentication
      const { data: { session }, error: sessionError } = await supabase().auth.getSession()
      
      if (sessionError || !session) {
        router.push('/login')
        return
      }

      // Fetch meals
      const { data, error: fetchError } = await supabase()
        .from('meals')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (fetchError) {
        setError(fetchError.message)
      } else {
        setMeals(data as Meal[])
      }
    } catch (err) {
      setError('Failed to load meals')
      console.error('Error loading meals:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMeals()
  }, [router])

  if (isLoading) {
    return (
      <AppShell>
        <VStack spacing={4} py={12} align="center" justify="center">
          <Spinner size="xl" color="primary.500" />
          <Text color="gray.600">Loading your meals...</Text>
        </VStack>
      </AppShell>
    )
  }

  if (error) {
    return (
      <AppShell>
        <Box py={12} textAlign="center">
          <Heading size="lg" mb={4}>Error loading meals</Heading>
          <Text color="red.500" mb={4}>{error}</Text>
          <Button as={Link} href="/dashboard" colorScheme="primary">Return to dashboard</Button>
        </Box>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <PageHeader
        title="My meals"
        subtitle="Review what you’ve logged and quickly add new meals to keep your day on track."
        actions={(
          <HStack spacing={2}>
            <QuickAddButton onSuccess={() => loadMeals()} />
            <Button
              as={Link}
              href="/meals/new"
              colorScheme="primary"
            >
              Add new meal
            </Button>
          </HStack>
        )}
      />

      <Box mb={6}>
        <DailyMacroTracker />
      </Box>

      <MealList 
        meals={meals} 
        onMealDeleted={(deletedMealId) => {
          setMeals(prev => prev.filter(m => m.id !== deletedMealId))
        }} 
      />
    </AppShell>
  )
}
