import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { Problem } from "../models/problem.models.js"
import { AvailableLanguages, LanguageCode } from "../constants.js"
import { submitBatch, pollJudge0ForResults } from "../utils/judge0.js"
import axios from "axios"

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const getLanguageNameById = (langId) => {
  return LanguageCode[langId]
}

const getLanguageIdByName = (name) => {
  for (const [id, lang] of Object.entries(LanguageCode)) {
    if (lang.toUpperCase() === name.toUpperCase()) {
      return Number(id)
    }
  }
  return null // agar nahi mila
}

const executeCode = asyncHandler(async (req, res) => {
  // const { problemId } = req.params
  const { code, language, problem } = req.body

  // if (!code || !language)
  //   throw new ApiError(404, "source code or language_id is missing!!")

  // if (!problemId)
  //   throw new ApiError(404, "problemId not found in the req params")

  // //checking whether language is valid or not
  // const isLanguageValid = AvailableLanguages.includes(language.toUpperCase())
  // if (!isLanguageValid)
  //   throw new ApiError(401, "the language provided is not valid")

  // const problem = await Problem.findById(problem)

  // if (!problem) throw new ApiError(404, "problem not found")

  // the workflow is like
  // creating a batch then it will be submitted to judge0 for execution with source_code language_id and stdin
  // will get tokens from judge0
  // use the tokens to get the status
  // will need to do polling ad no support for ws

  // preparing the batch
  // the testcases will come from the database
  const submissionForJudge0 = problem?.testCases.map((element) => ({
    source_code: code,
    language_id: getLanguageIdByName(language),
    stdin: element.input,
  }))

  // sending the batch which is an array of {souce_code, langauge_id, stdin} to judge0
  const response = await axios.post(
    `${process.env.JUDGE0_URL}/submissions/batch/?base64_encoded=false`,
    { submissions: submissionForJudge0 }
  )

  // making an array of tokens
  const tokens = response.data.map((element) => element.token)

  // polling the judge0 for results
  let pollingResults = []
  while (true) {
    const response = await axios.get(
      `${process.env.JUDGE0_URL}/submissions/batch`,
      {
        params: {
          tokens: tokens.join(","),
          base64_encoded: false,
        },
      }
    )

    let isAllExecuted = response.data.submissions.every((element) => {
      return element.status.id !== 1 && element.status.id !== 2
    })

    if (isAllExecuted) {
      pollingResults = response.data.submissions
      break
    }

    await sleep(1000)
  }

  // logic to check whether all output are matching the expectedoutput or not
  const expectedOutput = problem.testCases.map(
    (element) => element.expectedOutput
  )

  let allPasses = true
  const detailedResults = pollingResults.map((element, index) => {
    const passed = Number(element.stdout) === Number(expectedOutput[index])
    if (!passed) allPasses = false

    return {
      testCase: index + 1,
      passed,
      stdoout: element.stdout,
      expected: expectedOutput[index],
      stderr: element.stderr || null,
      compile_output: element.compile_output || null,
      status: element.status.description,
      time: `${element.time} s`,
      memory: `${element.memory} KB`,
    }
  })

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { detailedResults, pollingResults },
        "code executed successfully"
      )
    )
})

export { executeCode }
