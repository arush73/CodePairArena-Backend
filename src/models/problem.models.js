import mongoose from "mongoose"
import { AvailableProblemDifficulty, problemDifficulty } from "../constants"

const ExampleSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  explanation: { type: String },
})

const TestcaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  hidden: { type: Boolean, default: false },
})

const CodeSnippetSchema = new mongoose.Schema({
  language: { type: String, required: true },
  code: { type: String, required: true },
})

const RefrenceSolutionSchema = new mongoose.Schema({
  language: { type: String, required: true },
  solution: { type: String, required: true },
})

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: AvailableProblemDifficulty,
      default: problemDifficulty.EASY,
    },
    tags: [{ type: String }],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    example: [ExampleSchema],
    constraints: [
      {
        type: String,
        required: true,
      },
    ],
    hints: [{ type: String }],
    editorial: { type: String },
    testCases: [TestcaseSchema],
    codeSnippet: [CodeSnippetSchema],
    refrenceSolutions: [RefrenceSolutionSchema],
  },
  { timestamps: true }
)

export default Problem = mongoose.mode("Problem", problemSchema)
