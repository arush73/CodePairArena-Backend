import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Problem } from "../models/problem.models.js"
import axios from "axios"
import { LanguageCode } from "../constants.js"

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const getLanguageIdByName = (name) => {
  for (const [id, lang] of Object.entries(LanguageCode)) {
    if (lang.toUpperCase() === name.toUpperCase()) {
      return Number(id)
    }
  }
  return null
}

const executeCode = asyncHandler(async (req, res) => {
  // validations to be added later
  const { code, language } = req.body
  const problemId = req.params.problemId

  if (!problemId) throw new ApiError(404, "problemId not found in the params")

  const problem = await Problem.findById(problemId)
  if (!problem) throw new ApiError(404, "No problem found")

  // executing the code using judge0
  const batchSubmission = problem.testCases.map((element) => ({
    source_code: code,
    stdin: element.input,
    language_id: getLanguageIdByName(language),
  }))

  console.log("This is the batch submission for judge0: ", batchSubmission)

  const submitBatch = await axios.post(
    `${process.env.JUDGE0_URL}/submissions/batch/?base64_encoded=false`,
    { submissions: batchSubmission }
  )

  console.log(
    "these are the tokens coming after batch submission: ",
    submitBatch.data
  )
  const tokens = submitBatch.data.map((element) => element.token)

  let pollingResults
  let index = 1
  while (true) {
    try {
      const response = await axios.get(
        `${process.env.JUDGE0_URL}/submissions/batch`,
        { params: { tokens: tokens.join(","), base64_encoded: false } }
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
      throw new ApiError(500, "maa chud gyii polling ki: " + error.message)
    }
  }
  console.log("These are the polling results: ", pollingResults)

  const expectedOutput = problem.testCases.map(
    (element) => element.expectedOutput
  )
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
      input:problem.testCases[testCaseNumber - 1].input,
      stdout: element.stdout,
      expected: expectedOutput[index - 1],
      stderr: element.stderr || null,
      compile_output: element.compile_output || null,
      status: passed? "Accepted" : "Wrong Answer",
      time: `${element.time} s`,
      memory: `${element.memory} KB`,
    }
  })

  console.log("These are the detailed poling results: ", detailedResults)


  return res
    .status(200)
    .json(new ApiResponse(200, detailedResults, "code executed successfully"))
})

export { executeCode }
