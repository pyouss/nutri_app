'use client'

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  Spinner,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/db/supabase'
import type {
  NutritionProtocol,
  ProtocolPhase,
  UserNutritionPlan,
  MealTemplate,
  DailyMealPlan,
} from '@/lib/types/nutrition-plan'
import { PageHeader } from '@/components/common/PageHeader'
import { AppShell } from '@/components/common/AppShell'

export default function NutritionPlanPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userPlan, setUserPlan] = useState<UserNutritionPlan | null>(null)
  const [protocol, setProtocol] = useState<NutritionProtocol | null>(null)
  const [phases, setPhases] = useState<ProtocolPhase[]>([])
  const [currentPhase, setCurrentPhase] = useState<ProtocolPhase | null>(null)
  const [mealTemplates, setMealTemplates] = useState<MealTemplate[]>([])
  const [dailyPlans, setDailyPlans] = useState<DailyMealPlan[]>([])

  useEffect(() => {
    loadNutritionPlan()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadNutritionPlan = async () => {
    try {
      setIsLoading(true)
      const { data: { session } } = await supabase().auth.getSession()

      if (!session) {
        router.push('/login?redirect=/nutrition-plan')
        return
      }

      // Load user's active plan
      const { data: planData, error: planError } = await supabase()
        .from('user_nutrition_plans')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('is_active', true)
        .single()

      if (planError && planError.code !== 'PGRST116') {
        throw planError
      }

      setUserPlan(planData)

      // Load protocol and phases
      const { data: protocolData, error: protocolError } = await supabase()
        .from('nutrition_protocols')
        .select('*')
        .limit(1)
        .single()

      if (protocolError) throw protocolError
      setProtocol(protocolData)

      const { data: phasesData, error: phasesError } = await supabase()
        .from('protocol_phases')
        .select('*')
        .eq('protocol_id', protocolData.id)
        .order('phase_order')

      if (phasesError) throw phasesError
      setPhases(phasesData)

      // Set current phase
      if (planData?.current_phase_id) {
        const phase = phasesData.find(p => p.id === planData.current_phase_id)
        setCurrentPhase(phase || null)
      } else {
        setCurrentPhase(phasesData[0] || null)
      }

      // Load meal templates
      const { data: templatesData, error: templatesError } = await supabase()
        .from('meal_templates_v2')
        .select('*')
        .eq('is_public', true)
        .order('name')

      if (templatesError) throw templatesError
      setMealTemplates(templatesData)

      // Load daily meal plans for current phase
      if (planData?.current_phase_id || phasesData[0]) {
        const phaseId = planData?.current_phase_id || phasesData[0].id
        const { data: plansData, error: plansError } = await supabase()
          .from('daily_meal_plans_v2')
          .select('*')
          .eq('phase_id', phaseId)

        if (plansError) throw plansError
        setDailyPlans(plansData)
      }

    } catch (err: any) {
      console.error('Error loading nutrition plan:', err)
      setError(err.message || 'Failed to load nutrition plan')
    } finally {
      setIsLoading(false)
    }
  }

  const createUserPlan = async (phaseId: string) => {
    try {
      const { data: { session } } = await supabase().auth.getSession()
      if (!session || !protocol) return

      const { data, error } = await supabase()
        .from('user_nutrition_plans')
        .insert({
          user_id: session.user.id,
          protocol_id: protocol.id,
          current_phase_id: phaseId,
          age: 30,
          height_cm: 185,
          weight_kg: 86,
          body_fat_percentage: 20,
          start_date: new Date().toISOString().split('T')[0],
          current_phase_start_date: new Date().toISOString().split('T')[0],
          is_active: true,
        })
        .select()
        .single()

      if (error) throw error

      setUserPlan(data)
      await loadNutritionPlan()
    } catch (err: any) {
      console.error('Error creating user plan:', err)
      setError(err.message)
    }
  }

  if (isLoading) {
    return (
      <AppShell>
        <VStack spacing={4} py={12} align="center" justify="center">
          <Spinner size="xl" color="primary.500" />
          <Text color="gray.600">Loading your nutrition plan...</Text>
        </VStack>
      </AppShell>
    )
  }

  if (error) {
    return (
      <AppShell>
        <Box py={8}>
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        </Box>
      </AppShell>
    )
  }

  if (!protocol) {
    return (
      <AppShell>
        <Box py={8}>
          <Alert status="info">
            <AlertIcon />
            No nutrition plan found. Please run the import script first.
          </Alert>
          <Text mt={4} fontSize="sm" color="gray.600">
            Run: <code>npm run import:nutrition-plan</code>
          </Text>
        </Box>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <VStack spacing={6} align="stretch">
        <PageHeader
          title={protocol.name}
          subtitle={protocol.description || 'Follow a structured protocol with clear phases and daily calorie/macro targets.'}
          actions={(
            userPlan && (
              <Badge colorScheme="primary" fontSize="sm">Active plan</Badge>
            )
          )}
        />

        {/* Current Phase Info */}
        {currentPhase && (
          <Card>
            <CardHeader>
              <HStack justify="space-between">
                <Heading size="md">Current Phase: {currentPhase.phase_name}</Heading>
                {userPlan && (
                  <Badge colorScheme="green" fontSize="md">Active</Badge>
                )}
              </HStack>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                <Stat>
                  <StatLabel>Daily Calories</StatLabel>
                  <StatNumber>{currentPhase.daily_calories}</StatNumber>
                  <StatHelpText>kcal/day</StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel>Protein</StatLabel>
                  <StatNumber>{currentPhase.target_protein}g</StatNumber>
                  <StatHelpText>per day</StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel>Carbs</StatLabel>
                  <StatNumber>{currentPhase.target_carbs}g</StatNumber>
                  <StatHelpText>per day</StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel>Fat</StatLabel>
                  <StatNumber>{currentPhase.target_fat}g</StatNumber>
                  <StatHelpText>per day</StatHelpText>
                </Stat>
              </SimpleGrid>

              {!userPlan && (
                <Button
                  mt={4}
                  colorScheme="primary"
                  onClick={() => createUserPlan(currentPhase.id)}
                >
                  Start This Plan
                </Button>
              )}
            </CardBody>
          </Card>
        )}

        {/* Phases */}
        <Card>
          <CardHeader>
            <Heading size="md">Available Phases</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {phases.map(phase => (
                <Box
                  key={phase.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  bg={phase.id === currentPhase?.id ? 'green.50' : 'white'}
                  borderColor={phase.id === currentPhase?.id ? 'green.500' : 'gray.200'}
                >
                  <Heading size="sm" mb={2}>{phase.phase_name}</Heading>
                  <Text fontSize="sm" color="gray.600" mb={2}>
                    {phase.daily_calories} kcal/day
                  </Text>
                  <HStack spacing={4} fontSize="xs">
                    <Text><strong>P:</strong> {phase.target_protein}g</Text>
                    <Text><strong>C:</strong> {phase.target_carbs}g</Text>
                    <Text><strong>F:</strong> {phase.target_fat}g</Text>
                  </HStack>
                </Box>
              ))}
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Tabs for Meal Templates and Daily Plans */}
        <Tabs colorScheme="green">
          <TabList>
            <Tab>Meal Templates ({mealTemplates.length})</Tab>
            <Tab>Daily Meal Plans ({dailyPlans.length})</Tab>
          </TabList>

          <TabPanels>
            {/* Meal Templates */}
            <TabPanel>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {mealTemplates.map(template => (
                  <Card key={template.id} size="sm">
                    <CardBody>
                      <Heading size="sm" mb={2}>{template.name}</Heading>
                      <VStack align="stretch" spacing={1} fontSize="sm">
                        <HStack justify="space-between">
                          <Text color="gray.600">Calories:</Text>
                          <Text fontWeight="bold">{template.total_calories} kcal</Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text color="gray.600">Protein:</Text>
                          <Text>{template.total_protein}g</Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text color="gray.600">Carbs:</Text>
                          <Text>{template.total_carbs}g</Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text color="gray.600">Fat:</Text>
                          <Text>{template.total_fat}g</Text>
                        </HStack>
                      </VStack>
                      {template.description && (
                        <Text mt={2} fontSize="xs" color="gray.500">
                          {template.description}
                        </Text>
                      )}
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </TabPanel>

            {/* Daily Meal Plans */}
            <TabPanel>
              <VStack spacing={4} align="stretch">
                {dailyPlans.map(plan => (
                  <Card key={plan.id}>
                    <CardBody>
                      <HStack justify="space-between" mb={3}>
                        <Heading size="sm">{plan.menu_name}</Heading>
                        {plan.menu_type && (
                          <Badge colorScheme="purple">{plan.menu_type}</Badge>
                        )}
                      </HStack>
                      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={2} mb={3}>
                        <Text fontSize="sm">
                          <strong>{plan.total_calories}</strong> kcal
                        </Text>
                        <Text fontSize="sm">
                          <strong>P:</strong> {plan.total_protein}g
                        </Text>
                        <Text fontSize="sm">
                          <strong>C:</strong> {plan.total_carbs}g
                        </Text>
                        <Text fontSize="sm">
                          <strong>F:</strong> {plan.total_fat}g
                        </Text>
                      </SimpleGrid>
                      {plan.notes && (
                        <Text fontSize="sm" color="gray.600" fontStyle="italic">
                          {plan.notes}
                        </Text>
                      )}
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Quick Actions */}
        <HStack justify="space-between">
          <Button as={Link} href="/dashboard" variant="outline">
            Back to Dashboard
          </Button>
          <Button as={Link} href="/meals" colorScheme="green">
            Track Meals
          </Button>
        </HStack>
      </VStack>
    </AppShell>
  )
}
