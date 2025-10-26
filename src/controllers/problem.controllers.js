import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Problem } from "../models/problem.models.js"
import { ProblemSchema } from "../validators/problem.validators.js"
import { LanguageCode } from "../constants.js"
import axios from "axios"
import { token } from "morgan"

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const getLanguageIdByName = (name) => {
  for (const [id, lang] of Object.entries(LanguageCode)) {
    if (lang.toUpperCase() === name.toUpperCase()) {
      return Number(id)
    }
  }
  return null
}

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
    statement,
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

const getAllProblems = asyncHandler(async (req, res) => {
  // const page = req.query.page
  // const limit = req.query.limit
  // const skip = (page - 1) * limit

  // const total = await Problem.countDocuments()

  // const problems = await Problem.aggregate([
  //   { $sort: { createdAt: -1 } }, // latest problems first
  //   { $skip: skip }, // skip previous pages
  //   { $limit: limit }, // limit current page data
  // ])

  // res.status(200).json({
  //   success: true,
  //   page,
  //   limit,
  //   totalPages: Math.ceil(total / limit),
  //   totalProblems: total,
  //   problems,
  // })

  // const problem = await Problem.find({})
  const problem = await Problem.find({}, {id:1,title: 1 , difficulty: 1}).sort({ id: 1 })

  if (!problem)
    throw new ApiError(
      500,
      "something went wrong while fetching the problems !!"
    )

  return res
    .status(200)
    .json(new ApiResponse(200, problem, "Problems fetched successfully!!!"))
})

// working fine
const addProblem = asyncHandler(async (req, res) => {
  // will to add teh validations

  const {
    id,
    title,
    statement,
    difficulty,
    tags,
    example,
    constraints,
    companies,
    hint,
    editorial,
    testCases,
    codeSnippet,
    refrenceSolutions,
  } = req.body

  console.log("This is the data incoming @addproblem controller: ", req.body)

  // check the refrenceSolution before saving it in the database
  // const batchForJudge0 = refrenceSolutions.map((element) => ({ source_code: element,solution,  language_id:getLanguageIdByName(element.language), stdin:}))

  let batchSubmissionForJudge0 = []
  for (const soln of refrenceSolutions) {
    for (const test of testCases) {
      batchSubmissionForJudge0.push({
        source_code: soln.solution,
        language_id: getLanguageIdByName(soln.language),
        stdin: test.input,
      })
    }
  }

  console.log(
    "This is the batch submission sent to judge0 @addproblem controller: ",
    batchSubmissionForJudge0
  )

  const response = await axios.post(
    `${process.env.JUDGE0_URL}/submissions/batch/?base64_encoded=false`,
    { submissions: batchSubmissionForJudge0 }
  )

  console.log("These are the response tokens: ", response.data)

  if (!response) throw new ApiError(500, "failed to evaluate the solution")

  const tokens = response.data.map((element) => element.token)
  console.log(
    "These are the tokens being sent to poll judge0 @addproblem controller: ",
    tokens
  )
  // axios.interceptors.request.use((config) => {
  //   console.log("👉 Axios Request:", config.method?.toUpperCase(), config.url)
  //   console.log("👉 Params:", config.params)
  //   console.log("👉 Data:", config.data)
  //   return config
  // })

  // polling tihe judge0 for results
  let pollingResults
  let index = 1
  while (true) {
    try {
      const response = await axios.get(
        `${process.env.JUDGE0_URL}/submissions/batch`,
        {
          params: {
            tokens: tokens.join(","),
            base64_encoded: false,
            // fields: "token,stdout,stderr,status_id,language_id",
          },
        }
      )

      console.log(
        "This is the data coming from judge0: ",
        index,
        ": ",
        response.data.submissions
      )

      let isAllExecuted = response.data.submissions.every((element) => {
        return element.status.id !== 1 && element.status.id !== 2
      })

      if (isAllExecuted) {
        pollingResults = response.data.submissions
        break
      }

      await sleep(1500)
      index++
    } catch (error) {
      console.log("This is the fucking error: ", error)
      console.log("This is the fucking error ka message: ", error.message)
      console.log("This is the fucking error ka response: ", error.response)
      throw new ApiError(500, "maa chud gyii req ki ")
    }
  }

  console.log("These are the polling reaults: ", pollingResults)

  const expectedOutput = testCases.map((element) => element.expectedOutput)
  // const totalTestCases = tokens.length

  index = 0
  let testCaseNumber = 0
  let allPasses = true
  const detailedResults = pollingResults.map((element) => {
    if (index >= expectedOutput.length) index = 0

    const passed = (element.stdout) === (expectedOutput[index])
    if (!passed) allPasses = false

    index++
    testCaseNumber++
    return {
      testCase: testCaseNumber,
      passed,
      stdout: element.stdout,
      expected: expectedOutput[index - 1],
      stderr: element.stderr || null,
      compile_output: element.compile_output || null,
      status: element.status.description,
      time: `${element.time} s`,
      memory: `${element.memory} KB`,
    }
  })

  console.log("These are the detailedResults: ", detailedResults)

  if (!allPasses) throw new ApiError(400, "some reference solution failed")

  const problem = await Problem.create({
    id,
    title,
    statement,
    difficulty,
    example,
    constraints,
    testCases,
    codeSnippet,
    refrenceSolutions,
    tags,
    companies,
    hint,
    editorial,
  })

  problem.refrenceSolutions = "nahi milega bsdk"

  if (!problem) throw new ApiError(500, "failed to save in the db")

  return res
    .status(201)
    .json(new ApiResponse(201, problem, "problem added successfully"))
})

export { updateProblem, getProblemById, getAllProblems, addProblem }
