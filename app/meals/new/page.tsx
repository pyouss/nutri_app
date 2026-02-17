'use client'

import { useState, useEffect } from 'react'
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
  Stack,
  Flex,
  RadioGroup,
  Radio,
  HStack,
  IconButton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import { supabase } from '@/lib/db/supabase'

interface Ingredient {
  id: string
  name: string
  portionSize: string
  calories: string
  protein: string
  carbs: string
  fat: string
}

type MacroEntryMode = 'ingredient-level' | 'meal-level'

export default function NewMealPage() {
  const router = useRouter()
  const [mealName, setMealName] = useState('')
  const [mealDate, setMealDate] = useState(new Date().toISOString().split('T')[0])
  const [macroMode, setMacroMode] = useState<MacroEntryMode>('ingredient-level')
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: '1', name: '', portionSize: '', calories: '', protein: '', carbs: '', fat: '' },
  ])
  const [mealCalories, setMealCalories] = useState('')
  const [mealProtein, setMealProtein] = useState('')
  const [mealCarbs, setMealCarbs] = useState('')
  const [mealFat, setMealFat] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isAuthChecking, setIsAuthChecking] = useState(true)

  // Check authentication on page load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase().auth.getSession()
        if (!session) {
          router.push('/login?redirect=/meals/new')
          return
        }
        setIsAuthChecking(false)
      } catch (err) {
        console.error('Auth check error:', err)
        router.push('/login?redirect=/meals/new')
      }
    }
    checkAuth()
  }, [router])

  // Auto-dismiss success message after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [success])

  // Validation errors
  const [mealNameError, setMealNameError] = useState('')
  const [ingredientErrors, setIngredientErrors] = useState<Record<string, string>>({})
  const [mealMacroError, setMealMacroError] = useState('')

  // Validate meal name
  const validateMealName = (value: string): boolean => {
    if (!value.trim()) {
      setMealNameError('Meal name is required')
      return false
    }
    if (value.length > 255) {
      setMealNameError('Meal name must be 255 characters or less')
      return false
    }
    setMealNameError('')
    return true
  }

  // Validate numeric field
  const validateNumeric = (value: string, fieldName: string, allowZero: boolean = true): boolean => {
    if (!value.trim()) {
      return true // Optional field
    }
    const num = parseFloat(value)
    if (isNaN(num)) {
      return false
    }
    if (allowZero) {
      return num >= 0
    }
    return num > 0
  }

  // Validate ingredient
  const validateIngredient = (ingredient: Ingredient, index: number): boolean => {
    const errors: string[] = []
    
    if (!ingredient.name.trim()) {
      errors.push('Ingredient name is required')
    }
    
    if (!ingredient.portionSize.trim()) {
      errors.push('Portion size is required')
    } else if (!validateNumeric(ingredient.portionSize, 'portion size', false)) {
      errors.push('Portion size must be a positive number')
    }
    
    if (ingredient.calories && !validateNumeric(ingredient.calories, 'calories')) {
      errors.push('Calories must be a valid number')
    }
    if (ingredient.protein && !validateNumeric(ingredient.protein, 'protein')) {
      errors.push('Protein must be a valid number')
    }
    if (ingredient.carbs && !validateNumeric(ingredient.carbs, 'carbs')) {
      errors.push('Carbs must be a valid number')
    }
    if (ingredient.fat && !validateNumeric(ingredient.fat, 'fat')) {
      errors.push('Fat must be a valid number')
    }

    if (errors.length > 0) {
      setIngredientErrors((prev) => ({ ...prev, [ingredient.id]: errors.join(', ') }))
      return false
    }
    
    setIngredientErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[ingredient.id]
      return newErrors
    })
    return true
  }

  // Validate meal-level macros
  const validateMealMacros = (): boolean => {
    const hasAnyMacro = mealCalories || mealProtein || mealCarbs || mealFat
    if (!hasAnyMacro) {
      setMealMacroError('At least one macro value is required')
      return false
    }
    
    if (mealCalories && !validateNumeric(mealCalories, 'calories')) {
      setMealMacroError('Calories must be a valid number')
      return false
    }
    if (mealProtein && !validateNumeric(mealProtein, 'protein')) {
      setMealMacroError('Protein must be a valid number')
      return false
    }
    if (mealCarbs && !validateNumeric(mealCarbs, 'carbs')) {
      setMealMacroError('Carbs must be a valid number')
      return false
    }
    if (mealFat && !validateNumeric(mealFat, 'fat')) {
      setMealMacroError('Fat must be a valid number')
      return false
    }
    
    setMealMacroError('')
    return true
  }

  // Add ingredient
  const addIngredient = () => {
    const newId = Date.now().toString()
    setIngredients([
      ...ingredients,
      { id: newId, name: '', portionSize: '', calories: '', protein: '', carbs: '', fat: '' },
    ])
  }

  // Remove ingredient
  const removeIngredient = (id: string) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((ing) => ing.id !== id))
      setIngredientErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[id]
        return newErrors
      })
    }
  }

  // Update ingredient
  const updateIngredient = (id: string, field: keyof Ingredient, value: string) => {
    setIngredients(
      ingredients.map((ing) => (ing.id === id ? { ...ing, [field]: value } : ing))
    )
    // Clear error when user starts typing
    if (ingredientErrors[id]) {
      setIngredientErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[id]
        return newErrors
      })
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Validate meal name
    if (!validateMealName(mealName)) {
      return
    }

    // Validate based on mode
    if (macroMode === 'ingredient-level') {
      // Validate all ingredients
      let allValid = true
      ingredients.forEach((ing) => {
        if (!validateIngredient(ing, 0)) {
          allValid = false
        }
      })
      if (!allValid) {
        setError('Please fix ingredient errors before submitting')
        return
      }
    } else {
      // Validate meal-level macros
      if (!validateMealMacros()) {
        return
      }
    }

    setIsLoading(true)

    try {
      // Check authentication and get access token
      const { data: { session } } = await supabase().auth.getSession()
      if (!session) {
        setError('You must be logged in to save meals')
        setIsLoading(false)
        return
      }

      // Prepare request data
      const requestData = {
        meal_name: mealName,
        meal_date: mealDate,
        macro_mode: macroMode,
        ...(macroMode === 'ingredient-level'
          ? {
              ingredients: ingredients.map(ing => ({
                name: ing.name,
                portionSize: parseFloat(ing.portionSize),
                calories: parseFloat(ing.calories) || 0,
                protein: parseFloat(ing.protein) || 0,
                carbs: parseFloat(ing.carbs) || 0,
                fat: parseFloat(ing.fat) || 0,
              }))
            }
          : {
              total_calories: mealCalories ? parseFloat(mealCalories) : undefined,
              total_protein: mealProtein ? parseFloat(mealProtein) : undefined,
              total_carbs: mealCarbs ? parseFloat(mealCarbs) : undefined,
              total_fat: mealFat ? parseFloat(mealFat) : undefined,
            }
        ),
      }

      // Call API with Authorization header
      const response = await fetch('/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(requestData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to save meal')
      }

      // Success!
      setSuccess(true)

      // Notify other components (like DailyMacroTracker) that meals changed
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('meals:changed'))
      }
      
      // Redirect to meals list after short delay to show success message
      setTimeout(() => {
        router.push('/meals')
      }, 1000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save meal')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box minH="100vh" bg="gray.50" p={8}>
      <Stack gap={6} align="stretch" maxW="800px" mx="auto">
        <Heading as="h1" size="3xl" color="gray.800">
          Log New Meal
        </Heading>

        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Box>
          </Alert>
        )}

        {success && (
          <Alert status="success" borderRadius="md">
            <AlertIcon />
            <AlertTitle>Meal logged successfully!</AlertTitle>
            <AlertDescription>Your meal has been saved to your account.</AlertDescription>
          </Alert>
        )}

        <Box p={6} bg="white" borderRadius="md" boxShadow="sm">
          <form onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch">
              {/* Meal Name */}
              <FormControl id="mealName" isInvalid={!!mealNameError}>
                <FormLabel>Meal Name *</FormLabel>
                <Input
                  type="text"
                  value={mealName}
                  onChange={(e) => {
                    setMealName(e.target.value)
                    if (mealNameError) validateMealName(e.target.value)
                  }}
                  onBlur={() => validateMealName(mealName)}
                  placeholder="e.g., Grilled Chicken Salad"
                  bg="gray.50"
                />
                <FormErrorMessage>{mealNameError}</FormErrorMessage>
              </FormControl>

              {/* Meal Date */}
              <FormControl id="mealDate">
                <FormLabel>Meal Date</FormLabel>
                <Input
                  type="date"
                  value={mealDate}
                  onChange={(e) => setMealDate(e.target.value)}
                  bg="gray.50"
                />
              </FormControl>

              {/* Macro Entry Mode */}
              <FormControl id="macroMode">
                <FormLabel>Macro Entry Mode *</FormLabel>
                <RadioGroup value={macroMode} onChange={(value) => setMacroMode(value as MacroEntryMode)}>
                  <Stack direction="row" spacing={4}>
                    <Radio value="ingredient-level">Ingredient-Level Macros</Radio>
                    <Radio value="meal-level">Meal-Level Macros</Radio>
                  </Stack>
                </RadioGroup>
                <Text fontSize="sm" color="gray.600" mt={2}>
                  {macroMode === 'ingredient-level'
                    ? 'Enter macros for each ingredient separately'
                    : 'Enter total macros for the entire meal'}
                </Text>
              </FormControl>

              {/* Ingredient-Level Macros */}
              {macroMode === 'ingredient-level' && (
                <Box>
                  <Flex justify="space-between" align="center" mb={4}>
                    <FormLabel mb={0}>Ingredients *</FormLabel>
                    <Button
                      leftIcon={<AddIcon />}
                      size="sm"
                      colorScheme="primary"
                      variant="outline"
                      onClick={addIngredient}
                    >
                      Add Ingredient
                    </Button>
                  </Flex>

                  <VStack spacing={4} align="stretch">
                    {ingredients.map((ingredient, index) => (
                      <Box key={ingredient.id} p={4} bg="gray.50" borderRadius="md" border="1px" borderColor="gray.200">
                        <Flex justify="space-between" align="center" mb={3}>
                          <Text fontWeight="semibold" color="gray.700">
                            Ingredient {index + 1}
                          </Text>
                          {ingredients.length > 1 && (
                            <IconButton
                              aria-label="Remove ingredient"
                              icon={<DeleteIcon />}
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => removeIngredient(ingredient.id)}
                            />
                          )}
                        </Flex>

                        {ingredientErrors[ingredient.id] && (
                          <Alert status="error" size="sm" mb={3} borderRadius="md">
                            <AlertIcon />
                            <AlertDescription fontSize="xs">{ingredientErrors[ingredient.id]}</AlertDescription>
                          </Alert>
                        )}

                        <VStack spacing={3} align="stretch">
                          <FormControl isInvalid={!!ingredientErrors[ingredient.id]}>
                            <FormLabel fontSize="sm">Ingredient Name *</FormLabel>
                            <Input
                              type="text"
                              value={ingredient.name}
                              onChange={(e) => updateIngredient(ingredient.id, 'name', e.target.value)}
                              placeholder="e.g., Chicken Breast"
                              bg="white"
                              size="sm"
                            />
                          </FormControl>

                          <FormControl isInvalid={!!ingredientErrors[ingredient.id]}>
                            <FormLabel fontSize="sm">Portion Size (g) *</FormLabel>
                            <NumberInput
                              value={ingredient.portionSize}
                              onChange={(value) => updateIngredient(ingredient.id, 'portionSize', value)}
                              min={0.1}
                              precision={1}
                              size="sm"
                            >
                              <NumberInputField bg="white" />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </FormControl>

                          <HStack spacing={3}>
                            <FormControl>
                              <FormLabel fontSize="sm">Calories</FormLabel>
                              <NumberInput
                                value={ingredient.calories}
                                onChange={(value) => updateIngredient(ingredient.id, 'calories', value)}
                                min={0}
                                precision={1}
                                size="sm"
                              >
                                <NumberInputField bg="white" />
                              </NumberInput>
                            </FormControl>

                            <FormControl>
                              <FormLabel fontSize="sm">Protein (g)</FormLabel>
                              <NumberInput
                                value={ingredient.protein}
                                onChange={(value) => updateIngredient(ingredient.id, 'protein', value)}
                                min={0}
                                precision={1}
                              >
                                <NumberInputField bg="white" />
                              </NumberInput>
                            </FormControl>

                            <FormControl>
                              <FormLabel fontSize="sm">Carbs (g)</FormLabel>
                              <NumberInput
                                value={ingredient.carbs}
                                onChange={(value) => updateIngredient(ingredient.id, 'carbs', value)}
                                min={0}
                                precision={1}
                              >
                                <NumberInputField bg="white" />
                              </NumberInput>
                            </FormControl>

                            <FormControl>
                              <FormLabel fontSize="sm">Fat (g)</FormLabel>
                              <NumberInput
                                value={ingredient.fat}
                                onChange={(value) => updateIngredient(ingredient.id, 'fat', value)}
                                min={0}
                                precision={1}
                              >
                                <NumberInputField bg="white" />
                              </NumberInput>
                            </FormControl>
                          </HStack>
                        </VStack>
                      </Box>
                    ))}
                  </VStack>
                </Box>
              )}

              {/* Meal-Level Macros */}
              {macroMode === 'meal-level' && (
                <Box>
                  <FormLabel mb={4}>Meal Macros *</FormLabel>
                  {mealMacroError && (
                    <Alert status="error" size="sm" mb={4} borderRadius="md">
                      <AlertIcon />
                      <AlertDescription>{mealMacroError}</AlertDescription>
                    </Alert>
                  )}

                  <HStack spacing={4}>
                    <FormControl isInvalid={!!mealMacroError}>
                      <FormLabel fontSize="sm">Total Calories</FormLabel>
                      <NumberInput
                        value={mealCalories}
                        onChange={(value) => {
                          setMealCalories(value)
                          if (mealMacroError) setMealMacroError('')
                        }}
                        min={0}
                        precision={0}
                      >
                        <NumberInputField bg="gray.50" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>

                    <FormControl isInvalid={!!mealMacroError}>
                      <FormLabel fontSize="sm">Protein (g)</FormLabel>
                      <NumberInput
                        value={mealProtein}
                        onChange={(value) => {
                          setMealProtein(value)
                          if (mealMacroError) setMealMacroError('')
                        }}
                        min={0}
                        precision={1}
                      >
                        <NumberInputField bg="gray.50" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>

                    <FormControl isInvalid={!!mealMacroError}>
                      <FormLabel fontSize="sm">Carbs (g)</FormLabel>
                      <NumberInput
                        value={mealCarbs}
                        onChange={(value) => {
                          setMealCarbs(value)
                          if (mealMacroError) setMealMacroError('')
                        }}
                        min={0}
                        precision={1}
                      >
                        <NumberInputField bg="gray.50" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>

                    <FormControl isInvalid={!!mealMacroError}>
                      <FormLabel fontSize="sm">Fat (g)</FormLabel>
                      <NumberInput
                        value={mealFat}
                        onChange={(value) => {
                          setMealFat(value)
                          if (mealMacroError) setMealMacroError('')
                        }}
                        min={0}
                        precision={1}
                      >
                        <NumberInputField bg="gray.50" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </HStack>
                </Box>
              )}

              {/* Submit Button */}
              <Flex justify="flex-end" gap={4}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/meals')}
                  isDisabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  colorScheme="primary"
                  size="lg"
                  isLoading={isLoading}
                  loadingText="Logging meal..."
                >
                  Log Meal
                </Button>
              </Flex>
            </VStack>
          </form>
        </Box>
      </Stack>
    </Box>
  )
}
