'use client'

import { useState } from 'react'
import {
  Card,
  CardBody,
  Heading,
  Text,
  Stack,
  HStack,
  Badge,
  Box,
  IconButton,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import { useRef } from 'react'
import { supabase } from '@/lib/db/supabase'
import type { Meal } from '@/lib/types/meal'
import { motion } from 'framer-motion'

interface MealCardProps {
  meal: Meal
  onDelete?: (mealId: string) => void
}

export function MealCard({ meal, onDelete }: MealCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const toast = useToast()
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Format meal date (stored as meal_date field)
  const mealDateFormatted = formatDate(meal.meal_date)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const { error } = await supabase()
        .from('meals')
        .delete()
        .eq('id', meal.id)

      if (error) throw error

      // Optimistically update UI before showing toast
      if (onDelete) {
        onDelete(meal.id)
      }

      // Notify other components (like DailyMacroTracker) that meals changed
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('meals:changed'))
      }

      toast({
        title: 'Meal deleted',
        description: 'The meal has been removed from your log.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Error deleting meal:', error)
      toast({
        title: 'Error deleting meal',
        description: 'There was an error removing the meal. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsDeleting(false)
      setIsOpen(false)
    }
  }

  const MotionCard = motion(Card)

  return (
    <>
    <MotionCard
      position="relative"
      whileHover={{ y: -4, boxShadow: 'var(--chakra-shadows-lg)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <IconButton
        aria-label="Delete meal"
        icon={<DeleteIcon />}
        size="sm"
        colorScheme="red"
        variant="ghost"
        position="absolute"
        top={2}
        right={2}
        zIndex={2}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsOpen(true)
        }}
        isLoading={isDeleting}
      />
      <Box
        as={Link}
        href={`/meals/${meal.id}`}
        display="block"
      >
      <CardBody>
        <Stack spacing={3}>
          {/* Meal Name */}
          <Heading size="md" noOfLines={2}>
            {meal.meal_name}
          </Heading>

          {/* Meal Date */}
          <Text fontSize="sm" color="gray.600">
            {mealDateFormatted}
          </Text>

          {/* Macro Summary */}
          <Box>
            <HStack spacing={2} wrap="wrap">
              {meal.total_calories !== null && (
                <Badge colorScheme="blue" fontSize="xs">
                  {meal.total_calories} cal
                </Badge>
              )}
              {meal.total_protein !== null && (
                <Badge colorScheme="green" fontSize="xs">
                  {meal.total_protein}g protein
                </Badge>
              )}
              {meal.total_carbs !== null && (
                <Badge colorScheme="orange" fontSize="xs">
                  {meal.total_carbs}g carbs
                </Badge>
              )}
              {meal.total_fat !== null && (
                <Badge colorScheme="purple" fontSize="xs">
                  {meal.total_fat}g fat
                </Badge>
              )}
            </HStack>
          </Box>

          {/* Indicator for ingredient-level meals */}
          {meal.ingredients && Array.isArray(meal.ingredients) && (
            <Text fontSize="xs" color="gray.500">
              {meal.ingredients.length} ingredient{meal.ingredients.length !== 1 ? 's' : ''}
            </Text>
          )}
        </Stack>
      </CardBody>
      </Box>
    </MotionCard>

    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={() => setIsOpen(false)}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Meal
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to delete "{meal.meal_name}"? This action cannot be undone.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDelete}
              ml={3}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
    </>
  )
}
