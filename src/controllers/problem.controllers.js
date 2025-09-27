import asyncHandler from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Problem } from "../models/problem.models.js"
import { ProblemSchema } from "../validators/problem.validators.js"

// will add all the problems in one go
const updateProblem = asyncHandler(async (req, res) => {
  //   const validate = ProblemSchema.safeParse()
  //     if (!validate.success)
  //       throw new ApiError(
  //         401,
  //         validate.error.issues.map((mess) => mess.message)
  //       )

  const {
    id,
    titie,
    description,
    difficulty,
    tags,
    userId,
    example,
    companies,
    hints,
    editorial,
    testCases,
    codeSnippet,
    refrenceSolution,
    relatedTopics,
  } = req.body
})

const getProblemById = asyncHandler(async (req, res) => {
  const { problemId } = req.params
  if (!req.params)
    throw new ApiError(404, "problemId not found in the req params")

  const problem = await Problem.findById(problemId)
  if (!problem) throw new ApiError(404, "problem not found")

  return res
    .status(200)
    .json(new ApiResponse(200, problem, "problem fetched successfully"))
})

export const getAllProblems = asyncHandler(async (req, res) => {
  const page = req.query.page
  const limit = req.query.limit
  const skip = (page - 1) * limit

  const total = await Problem.countDocuments()

  const problems = await Problem.aggregate([
    { $sort: { createdAt: -1 } }, // latest problems first
    { $skip: skip }, // skip previous pages
    { $limit: limit }, // limit current page data
  ])

  res.status(200).json({
    success: true,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    totalProblems: total,
    problems,
  })
})

export { updateProblem, getProblemById, getAllProblems }
