import axios from "axios"

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const submitBatch = async (data) => {
  const response = await axios.post(
    `${process.env.JUDGE0_URL}/submissions/batch?base64_encoded=false`,
    { submissions: data }
  )

  return response.data
}

const pollJudge0ForResults = async (tokens) => {
  while (true) {
    const response = await axios.get(
      `${process.env.JUDGE0_URL}/submissions/batch`,
      {
        params: tokens.join(","),
      }
    )

    const results = response.data.submissions

    const isAllDone = results.every((result) => {
      return result.status.id !== 1 && result.status.id !== 2
    })

    if (isAllDone) {
      return results
    }

    await sleep(1000)
  }
}

export { submitBatch, pollJudge0ForResults }
