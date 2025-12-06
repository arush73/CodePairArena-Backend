import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Problem } from "../models/problem.models.js"
import { Submission } from "../models/submission.models.js"
import { UserProfile } from "../models/userProfile.models.js"
import { LanguageCode } from "../constants.js"
import axios from "axios"

const getLanguageIdByName = (name) => {
  for (const [id, lang] of Object.entries(LanguageCode)) {
    if (lang.toUpperCase() === name.toUpperCase()) {
      return Number(id)
    }
  }
  return null
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const createSubmission = asyncHandler(async (req, res) => {
  const { code, language } = req.body
  const problemId = req.params.problemId
  // "68ece11c90c73b758e20492d" = "68ece11c90c73b758e20492d"

  if (!problemId)
    throw new ApiError(404, "problemId not found in the req params")

  const problem = await Problem.findById(problemId)
  if (!problem) throw new ApiError(404, "problem not found")

  // judge the solution

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

      await sleep(3000)
      index++
    } catch (error) {
      throw new ApiError(500, "maa chud gyii polling ki: " + error.message)
    }
  }

  const expectedOutput = problem.testCases.map(
    (element) => element.expectedOutput
  )
  index = 0
  let testCaseNumber = 0

  let allPasses = true
  const detailedResults = pollingResults.map((element) => {
    if (index >= expectedOutput.length) index = 0

    const passed = Number(element.stdout) === Number(expectedOutput[index])
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
      time: element.time,
      memory: element.memory,
    }
  })

  console.log("These are the detailed results: ", detailedResults)

  let submission = null

  // Ensure profile exists
  let profile = await UserProfile.findOne({ owner: req.user._id })
  if (!profile) {
    profile = await UserProfile.create({ owner: req.user._id })
  }

  // Update Streak Logic
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const lastActive = profile.solvedStats?.lastActiveDate
    ? new Date(profile.solvedStats.lastActiveDate)
    : null
  if (lastActive) {
    lastActive.setHours(0, 0, 0, 0)
  }

  if (!lastActive || lastActive.getTime() < today.getTime()) {
    // If last active was yesterday, increment streak
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (lastActive && lastActive.getTime() === yesterday.getTime()) {
      profile.solvedStats.streak = (profile.solvedStats.streak || 0) + 1
    } else if (!lastActive || lastActive.getTime() < yesterday.getTime()) {
      // Streak broken or first time
      profile.solvedStats.streak = 1
    }
    // If lastActive is today, do nothing (already counted)

    profile.solvedStats.lastActiveDate = new Date()
    await profile.save()
  }

  if (allPasses) {
    const averageTime = detailedResults.map((element) => Number(element.time))
    const averageMemory = detailedResults.map((element) => element.memory)

    console.log("the average time array: ", averageTime)
    console.log("the average memory array: ", averageMemory)

    submission = await Submission.create({
      problemId,
      userId: req.user._id,
      sourceCode: code,
      language: language,
      status: "ACCEPTED",
      compileOutput: null,
      time: Math.floor(
        averageTime.reduce((sum, val) => sum + val, 0) / averageTime.length
      ),
      memory: Math.floor(
        averageMemory.reduce((sum, val) => sum + val, 0) / averageMemory.length
      ),
    })

    // Update Solved Stats if not already solved
    const alreadySolved = await Submission.findOne({
      userId: req.user._id,
      problemId,
      status: "ACCEPTED",
      _id: { $ne: submission._id }, // Exclude the one we just created
    })

    if (!alreadySolved) {
      let difficulty = problem.difficulty
        ? problem.difficulty.toLowerCase().trim()
        : "easy"
      if (!["easy", "medium", "hard"].includes(difficulty)) {
        difficulty = "easy" // Default fallback
      }

      console.log(`Updating stats for difficulty: ${difficulty}`)

      // Increment total and specific difficulty
      await UserProfile.findOneAndUpdate(
        { owner: req.user._id },
        {
          $inc: {
            "solvedStats.total": 1,
            [`solvedStats.${difficulty}`]: 1,
          },
        }
      )
    }
  }

  if (!allPasses) {
    submission = await Submission.create({
      problemId,
      userId: req.user._id,
      sourceCode: code,
      language: language,
      status: "WRONG ANSWER",
      compileOutput: null,
      time: "NONE",
      memory: "NONE",
    })
    return res
      .status(200)
      .json(new ApiResponse(200, submission, "WRONG ANSWER"))
  }

  return res.status(200).json(new ApiResponse(200, submission, "ACCEPTED"))
})

const getSubmisions = asyncHandler(async (req, res) => {
  const problemId = req.params.problemId
  const userId = req.user._id

  const submission = await Submission.find({ userId, problemId })

  return res
    .status(200)
    .json(new ApiResponse(200, submission, "submissions fetched succesfully"))
})

const getMySubmissions = asyncHandler(async (req, res) => {
  const userId = req.user._id
  const { limit } = req.query

  let query = Submission.find({ userId })
    .populate("problemId", "title difficulty")
    .sort({ createdAt: -1 })

  if (limit) {
    query = query.limit(parseInt(limit))
  }

  const submissions = await query

  return res
    .status(200)
    .json(
      new ApiResponse(200, submissions, "User submissions fetched successfully")
    )
})

export { createSubmission, getSubmisions, getMySubmissions }
