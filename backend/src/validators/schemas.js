import { z } from 'zod';

// User validation schemas
const registerSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(50, 'Name cannot be more than 50 characters')
    .trim(),
  email: z.string()
    .email('Please provide a valid email')
    .toLowerCase(),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password cannot be more than 100 characters')
});

const loginSchema = z.object({
  email: z.string()
    .email('Please provide a valid email')
    .toLowerCase(),
  password: z.string()
    .min(1, 'Password is required')
});

// Transaction validation schemas
const transactionSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title cannot be more than 100 characters')
    .trim(),
  amount: z.number()
    .refine(val => val !== 0, 'Amount cannot be zero'),
  type: z.enum(['income', 'expense'], {
    errorMap: () => ({ message: 'Type must be either income or expense' })
  }),
  category: z.string()
    .min(1, 'Category is required')
    .max(50, 'Category cannot be more than 50 characters')
    .trim(),
  description: z.string()
    .max(500, 'Description cannot be more than 500 characters')
    .trim()
    .optional(),
  date: z.string()
    .datetime('Please provide a valid date')
    .optional()
});

const updateTransactionSchema = transactionSchema.partial();

// Monthly summary validation
const monthlySummarySchema = z.object({
  year: z.number()
    .int('Year must be an integer')
    .min(2000, 'Year must be 2000 or later')
    .max(2100, 'Year must be 2100 or earlier'),
  month: z.number()
    .int('Month must be an integer')
    .min(1, 'Month must be between 1 and 12')
    .max(12, 'Month must be between 1 and 12')
});

export {
  registerSchema,
  loginSchema,
  transactionSchema,
  updateTransactionSchema,
  monthlySummarySchema
};

