'use client'

import { SimpleGrid } from '@chakra-ui/react'
import { MealCard } from './MealCard'
import { EmptyState } from '@/components/common/EmptyState'
import type { Meal } from '@/lib/types/meal'

interface MealListProps {
  meals: Meal[]
  onMealDeleted?: (mealId: string) => void
}

export function MealList({ meals, onMealDeleted }: MealListProps) {
  // Show empty state if no meals
  if (meals.length === 0) {
    return (
      <EmptyState
        title="No meals logged yet"
        message="Start tracking your nutrition by logging your first meal."
        actionText="Add Your First Meal"
        actionHref="/meals/new"
      />
    )
  }

  // Display meals in a grid
  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
      {meals.map((meal) => (
        <MealCard key={meal.id} meal={meal} onDelete={onMealDeleted} />
      ))}
    </SimpleGrid>
  )
}
