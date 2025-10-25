const data = {
  id: 1,
  title: "Add Two Numbers",
  statement: "Given two numbers a and b, add them up and return the output.",
  difficulty: "EASY",
  tags: ["math", "operators", "addition"],
  example: [
    {
      input: "3 7",
      output: "10",
      explanation: "Adding 3 and 7 gives 10.",
    },
    {
      input: "-5 12",
      output: "7",
      explanation: "Adding -5 and 12 gives 7.",
    },
  ],
  constraints: ["-10^9 ≤ a, b ≤ 10^9"],
  companies: [],
  hints: [],
  editorial: "",
  testCases: [
    {
      input: "100 200",
      expectedOutput: "300",
      hidden: false,
    },
    {
      input: "-500 -600",
      expectedOutput: "-1100",
      hidden: false,
    },
    {
      input: "0 0",
      expectedOutput: "0",
      hidden: false,
    },
  ],
  codeSnippet: [
    {
      language: "JAVASCRIPT",
      code: "const fs = require('fs');\n\nfunction addTwoNumbers(a, b) {\n    // Write your code here\n}\n\n// Reading input from stdin (using fs to read all input)\nconst input = fs.readFileSync(0, 'utf-8').trim();\nconst [a, b] = input.split(' ').map(Number);\n\nconsole.log(addTwoNumbers(a, b));",
    },
    {
      language: "PYTHON",
      code: "def add_two_numbers(a, b):\n    # Write your code here\n    # Return the sum of a and b\n    return a + b\n\nimport sys\ninput_line = sys.stdin.read()\na, b = map(int, input_line.split())\nprint(add_two_numbers(a, b))",
    },
    {
      language: "JAVA",
      code: "import java.util.Scanner;\n\npublic class Main {\n    public static int addTwoNumbers(int a, int b) {\n        // Write your code here\n        // Return the sum of a and b\n        return a + b;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(addTwoNumbers(a, b));\n    }\n}",
    },
  ],
  refrenceSolutions: [
    {
      language: "JAVASCRIPT",
      solution:
        "const fs = require('fs');\n\n// Reading input from stdin (using fs to read all input)\nconst input = fs.readFileSync(0, 'utf-8').trim();\nconst [a, b] = input.split(' ').map(Number);\n\nconsole.log(a + b);",
    },
    {
      language: "PYTHON",
      solution:
        "import sys\ninput_line = sys.stdin.read()\na, b = map(int, input_line.split())\nprint(a + b)",
    },
    {
      language: "JAVA",
      solution:
        "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(a + b);\n    }\n}",
    },
  ],
  relatedTopics: "",
}

import { LanguageCode } from "./constants.js"

const getLanguageIdByName = (name) => {
  for (const [id, lang] of Object.entries(LanguageCode)) {
    if (lang.toUpperCase() === name.toUpperCase()) {
      return Number(id)
    }
  }
  return null
}

let batchSubmissionForJudge0 = []
for (const soln of data.refrenceSolutions) {
  for (const test of data.testCases) {
    batchSubmissionForJudge0.push({
      source_code: soln.solution,
      language_id: getLanguageIdByName(soln.language),
      stdin: test.input,
    })
  }
}

console.log("These are the batch submissions: ", batchSubmissionForJudge0)

import axios from "axios"

const response = await axios.post(
    "http://localhost:2358/submissions/batch",
    {
        submissions: batchSubmissionForJudge0,
    },
    {
        params: {
            base64_encoded: false,
            wait: false,
        },
    }
)

const tokens = response.data.map((element) => element.token)
console.log("These are the tokens coming after batch submission: ", tokens)

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

let pollingResults
let index = 1

while (true) {
  try {
    const response = await axios.get(
      "http://localhost:2358/submissions/batch",
      {
        params: {
          base64_encoded: false,
          tokens: tokens.join(","),
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

    await sleep(3000)
    index++
  } catch (error) {
    console.log("This is the fucking error: ", error)
    console.log("This is the fucking error ka message: ", error.message)
    console.log("This is the fucking error ka response: ", error.response)
    throw new ApiError(500, "maa chud gyii req ki ")
  }
}

console.log("These are the polling results: ", pollingResults)
