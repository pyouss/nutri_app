'use client'

import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  VStack,
  HStack,
  Progress,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  Skeleton,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/db/supabase'
import { motion } from 'framer-motion'

interface MacroTarget {
  calories: number
  protein: number
  carbs: number
  fat: number
}

interface MacroActual {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export function DailyMacroTracker() {
  const [isLoading, setIsLoading] = useState(true)
  const [target, setTarget] = useState<MacroTarget | null>(null)
  const [actual, setActual] = useState<MacroActual>({ calories: 0, protein: 0, carbs: 0, fat: 0 })
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    loadMacroData()
  }, [date])

  const loadMacroData = async () => {
    try {
      setIsLoading(true)
      const { data: { session } } = await supabase().auth.getSession()
      if (!session) return

      // Load user's nutrition plan target
      const { data: planData } = await supabase()
        .from('user_nutrition_plans')
        .select(`
          *,
          current_phase:protocol_phases!user_nutrition_plans_current_phase_id_fkey (
            daily_calories,
            target_protein,
            target_carbs,
            target_fat
          )
        `)
        .eq('user_id', session.user.id)
        .eq('is_active', true)
        .single()

      if (planData && planData.current_phase) {
        setTarget({
          calories: planData.current_phase.daily_calories,
          protein: planData.current_phase.target_protein,
          carbs: planData.current_phase.target_carbs,
          fat: planData.current_phase.target_fat,
        })
      }

      // Load today's meals
      const { data: mealsData } = await supabase()
        .from('meals')
        .select('total_calories, total_protein, total_carbs, total_fat')
        .eq('user_id', session.user.id)
        .eq('meal_date', date)

      if (mealsData) {
        const totals = mealsData.reduce(
          (acc, meal) => ({
            calories: acc.calories + (meal.total_calories || 0),
            protein: acc.protein + (meal.total_protein || 0),
            carbs: acc.carbs + (meal.total_carbs || 0),
            fat: acc.fat + (meal.total_fat || 0),
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
        )
        setActual(totals)
      }
    } catch (err) {
      console.error('Error loading macro data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Keep macros in sync when meals change using a simple browser event
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handler = () => {
      loadMacroData()
    }

    window.addEventListener('meals:changed', handler)
    return () => {
      window.removeEventListener('meals:changed', handler)
    }
  }, [date])

  const calculatePercentage = (actual: number, target: number): number => {
    if (!target) return 0
    return Math.min(Math.round((actual / target) * 100), 100)
  }

  const getProgressColor = (percentage: number): string => {
    if (percentage < 50) return 'red'
    if (percentage < 80) return 'yellow'
    if (percentage < 110) return 'green'
    return 'orange'
  }

  const MotionBox = motion(Box)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Heading size="md">Today's Macros</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4}>
            <Skeleton height="60px" width="100%" />
            <Skeleton height="60px" width="100%" />
            <Skeleton height="60px" width="100%" />
          </VStack>
        </CardBody>
      </Card>
    )
  }

  if (!target) {
    return (
      <Card>
        <CardHeader>
          <Heading size="md">Today's Macros</Heading>
        </CardHeader>
        <CardBody>
          <Text color="gray.600">
            No nutrition plan active. Set up your plan to track macros!
          </Text>
        </CardBody>
      </Card>
    )
  }

  const caloriesPercentage = calculatePercentage(actual.calories, target.calories)
  const proteinPercentage = calculatePercentage(actual.protein, target.protein)
  const carbsPercentage = calculatePercentage(actual.carbs, target.carbs)
  const fatPercentage = calculatePercentage(actual.fat, target.fat)

  return (
    <Card>
      <CardHeader>
        <HStack justify="space-between">
          <Heading size="md">Today's Macros</Heading>
          <Badge colorScheme={caloriesPercentage >= 90 ? 'green' : 'yellow'}>
            {caloriesPercentage}% of target
          </Badge>
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack spacing={6} align="stretch">
          {/* Calories */}
          <MotionBox
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <HStack justify="space-between" mb={1}>
              <Text fontWeight="semibold">Calories</Text>
              <Text fontSize="sm" color="gray.600">
                {actual.calories} / {target.calories} kcal
              </Text>
            </HStack>
            <Progress
              value={caloriesPercentage}
              colorScheme={getProgressColor(caloriesPercentage)}
              size="lg"
              borderRadius="md"
            />
          </MotionBox>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {/* Protein */}
            <MotionBox
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}
            >
              <Text fontWeight="semibold" fontSize="sm" mb={1}>
                Protein
              </Text>
              <HStack justify="space-between" mb={1}>
                <Text fontSize="sm" color="gray.600">
                  {actual.protein.toFixed(1)}g / {target.protein}g
                </Text>
                <Badge colorScheme={getProgressColor(proteinPercentage)} fontSize="xs">
                  {proteinPercentage}%
                </Badge>
              </HStack>
              <Progress
                value={proteinPercentage}
                colorScheme={getProgressColor(proteinPercentage)}
                size="sm"
                borderRadius="md"
              />
            </MotionBox>

            {/* Carbs */}
            <MotionBox
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.1 }}
            >
              <Text fontWeight="semibold" fontSize="sm" mb={1}>
                Carbs
              </Text>
              <HStack justify="space-between" mb={1}>
                <Text fontSize="sm" color="gray.600">
                  {actual.carbs.toFixed(1)}g / {target.carbs}g
                </Text>
                <Badge colorScheme={getProgressColor(carbsPercentage)} fontSize="xs">
                  {carbsPercentage}%
                </Badge>
              </HStack>
              <Progress
                value={carbsPercentage}
                colorScheme={getProgressColor(carbsPercentage)}
                size="sm"
                borderRadius="md"
              />
            </MotionBox>

            {/* Fat */}
            <MotionBox
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.15 }}
            >
              <Text fontWeight="semibold" fontSize="sm" mb={1}>
                Fat
              </Text>
              <HStack justify="space-between" mb={1}>
                <Text fontSize="sm" color="gray.600">
                  {actual.fat.toFixed(1)}g / {target.fat}g
                </Text>
                <Badge colorScheme={getProgressColor(fatPercentage)} fontSize="xs">
                  {fatPercentage}%
                </Badge>
              </HStack>
              <Progress
                value={fatPercentage}
                colorScheme={getProgressColor(fatPercentage)}
                size="sm"
                borderRadius="md"
              />
            </MotionBox>
          </SimpleGrid>

          {/* Remaining */}
          <MotionBox
            pt={4}
            borderTopWidth="1px"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.2 }}
          >
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
              <Stat size="sm">
                <StatLabel fontSize="xs">Remaining Calories</StatLabel>
                <StatNumber fontSize="lg" color={target.calories - actual.calories < 0 ? 'red.500' : 'green.500'}>
                  {Math.max(0, target.calories - actual.calories)}
                </StatNumber>
                <StatHelpText fontSize="xs">kcal left</StatHelpText>
              </Stat>
              <Stat size="sm">
                <StatLabel fontSize="xs">Protein Left</StatLabel>
                <StatNumber fontSize="lg">
                  {Math.max(0, target.protein - actual.protein).toFixed(0)}g
                </StatNumber>
              </Stat>
              <Stat size="sm">
                <StatLabel fontSize="xs">Carbs Left</StatLabel>
                <StatNumber fontSize="lg">
                  {Math.max(0, target.carbs - actual.carbs).toFixed(0)}g
                </StatNumber>
              </Stat>
              <Stat size="sm">
                <StatLabel fontSize="xs">Fat Left</StatLabel>
                <StatNumber fontSize="lg">
                  {Math.max(0, target.fat - actual.fat).toFixed(0)}g
                </StatNumber>
              </Stat>
            </SimpleGrid>
          </MotionBox>
        </VStack>
      </CardBody>
    </Card>
  )
}
