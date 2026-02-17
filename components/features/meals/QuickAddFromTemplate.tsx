'use client'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Box,
  SimpleGrid,
  Card,
  CardBody,
  Heading,
  Badge,
  useDisclosure,
  useToast,
  Input,
  FormControl,
  FormLabel,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/db/supabase'
import type { MealTemplate } from '@/lib/types/nutrition-plan'

interface QuickAddFromTemplateProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function QuickAddFromTemplate({ isOpen, onClose, onSuccess }: QuickAddFromTemplateProps) {
  const router = useRouter()
  const toast = useToast()
  const [templates, setTemplates] = useState<MealTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<MealTemplate | null>(null)
  const [mealDate, setMealDate] = useState(new Date().toISOString().split('T')[0])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadTemplates()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase()
        .from('meal_templates_v2')
        .select('*')
        .eq('is_public', true)
        .order('name')

      if (error) throw error
      setTemplates(data || [])
    } catch (err) {
      console.error('Error loading templates:', err)
      toast({
        title: 'Error loading templates',
        status: 'error',
        duration: 3000,
      })
    }
  }

  const handleAddMeal = async () => {
    if (!selectedTemplate) return

    try {
      setIsLoading(true)
      const { data: { session } } = await supabase().auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase()
        .from('meals')
        .insert({
          user_id: session.user.id,
          meal_name: selectedTemplate.name,
          meal_date: mealDate,
          total_calories: selectedTemplate.total_calories,
          total_protein: selectedTemplate.total_protein,
          total_carbs: selectedTemplate.total_carbs,
          total_fat: selectedTemplate.total_fat,
          ingredients: selectedTemplate.ingredients,
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: 'Meal added successfully!',
        description: `${selectedTemplate.name} has been logged for ${mealDate}`,
        status: 'success',
        duration: 3000,
      })

      // Notify other components (like DailyMacroTracker) that meals changed
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('meals:changed'))
      }

      setSelectedTemplate(null)
      onClose()
      onSuccess?.()
    } catch (err: any) {
      console.error('Error adding meal:', err)
      toast({
        title: 'Error adding meal',
        description: err.message || 'Failed to add meal',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Quick Add from Nutrition Plan</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Date</FormLabel>
              <Input
                type="date"
                value={mealDate}
                onChange={(e) => setMealDate(e.target.value)}
              />
            </FormControl>

            <Box>
              <Text fontWeight="semibold" mb={2}>
                Select a meal template:
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} maxH="400px" overflowY="auto">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    cursor="pointer"
                    onClick={() => setSelectedTemplate(template)}
                    bg={selectedTemplate?.id === template.id ? 'green.50' : 'white'}
                    borderWidth="2px"
                    borderColor={selectedTemplate?.id === template.id ? 'green.500' : 'gray.200'}
                    _hover={{ borderColor: 'green.300', bg: 'green.50' }}
                    transition="all 0.2s"
                  >
                    <CardBody p={3}>
                      <Heading size="xs" mb={2} noOfLines={1}>
                        {template.name}
                      </Heading>
                      <VStack align="stretch" spacing={1} fontSize="xs">
                        <HStack justify="space-between">
                          <Text color="gray.600">Calories:</Text>
                          <Badge colorScheme="purple">{template.total_calories} kcal</Badge>
                        </HStack>
                        <HStack justify="space-between" fontSize="2xs">
                          <Text color="gray.500">
                            P: {template.total_protein}g
                          </Text>
                          <Text color="gray.500">
                            C: {template.total_carbs}g
                          </Text>
                          <Text color="gray.500">
                            F: {template.total_fat}g
                          </Text>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </Box>

            {selectedTemplate && (
              <Box p={4} bg="green.50" borderRadius="md" borderWidth="1px" borderColor="green.200">
                <Text fontWeight="bold" mb={2}>
                  Selected: {selectedTemplate.name}
                </Text>
                <SimpleGrid columns={4} spacing={2} fontSize="sm">
                  <Box>
                    <Text fontSize="xs" color="gray.600">Calories</Text>
                    <Text fontWeight="bold">{selectedTemplate.total_calories}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" color="gray.600">Protein</Text>
                    <Text fontWeight="bold">{selectedTemplate.total_protein}g</Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" color="gray.600">Carbs</Text>
                    <Text fontWeight="bold">{selectedTemplate.total_carbs}g</Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" color="gray.600">Fat</Text>
                    <Text fontWeight="bold">{selectedTemplate.total_fat}g</Text>
                  </Box>
                </SimpleGrid>
                {selectedTemplate.description && (
                  <Text mt={2} fontSize="xs" color="gray.600" fontStyle="italic">
                    {selectedTemplate.description}
                  </Text>
                )}
              </Box>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="green"
            onClick={handleAddMeal}
            isDisabled={!selectedTemplate}
            isLoading={isLoading}
          >
            Add Meal
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export function QuickAddButton({ onSuccess }: { onSuccess?: () => void }) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleSuccess = () => {
    onSuccess?.()
  }

  return (
    <>
      <Button
        onClick={onOpen}
        colorScheme="purple"
        variant="outline"
        size="sm"
      >
        Quick Add from Plan
      </Button>
      <QuickAddFromTemplate isOpen={isOpen} onClose={onClose} onSuccess={handleSuccess} />
    </>
  )
}
