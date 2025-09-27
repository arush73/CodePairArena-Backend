import { z } from "zod"
import { AvailableProblemDifficulty, problemDifficulty } from "../constants"

// Example
const ExampleSchema = z.object({
  input: z.string(),
  output: z.string(),
  explanation: z.string().optional(),
})

// Testcase
const TestcaseSchema = z.object({
  input: z.array(z.string()),
  expectedOutput: z.string(),
  hidden: z.boolean().default(false),
})

// CodeSnippet
const CodeSnippetSchema = z.object({
  language: z.string(),
  code: z.string(),
})

// ReferenceSolution
const RefrenceSolutionSchema = z.object({
  language: z.string(),
  solution: z.string(),
})

// Main Problem Schema
export const ProblemSchema = z.object({
  id: z.number(),
  title: z.string().trim(),
  description: z.string(),
  difficulty: z
    .enum(AvailableProblemDifficulty)
    .default(problemDifficulty.EASY),
  tags: z.array(z.string()).optional(),
  userId: z.string(), // MongoDB ObjectId ko string hi treat karna
  example: z.array(ExampleSchema),
  constraints: z.array(z.string()),
  companies: z.array(z.string()).optional(),
  hints: z.array(z.string()).optional(),
  editorial: z.string().optional(),
  testCases: z.array(TestcaseSchema),
  codeSnippet: z.array(CodeSnippetSchema),
  refrenceSolution: z.array(RefrenceSolutionSchema),
  relatedTopics: z.string().optional(),
})
