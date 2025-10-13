import mongoose from "mongoose"
import { AvailableProblemDifficulty, problemDifficulty } from "../constants.js"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate"

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
    id: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    statement: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: AvailableProblemDifficulty,
      default: problemDifficulty.EASY,
    },
    tags: [{ type: String }],
    // userId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
    example: [ExampleSchema],
    constraints: [
      {
        type: String,
        required: true,
      },
    ],
    companies: [{ type: String }],
    hints: [{ type: String }],
    editorial: { type: String },
    testCases: [TestcaseSchema],// input output
    codeSnippet: [CodeSnippetSchema], // language code
    refrenceSolutions: [RefrenceSolutionSchema],// language solution
    relatedTopics: {
      type: String,
    },
  },
  { timestamps: true , strict:false}
)

problemSchema.plugin(mongooseAggregatePaginate)

export const Problem = mongoose.model("Problem", problemSchema)
