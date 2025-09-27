import axios from "axios"

const source_code = `#include <iostream>
using namespace std;

int add(int a, int b)
{
    return a + b;
}

int main()
{
    int a, b;
    cin >> a >> b;
    cout << add(a, b) << endl;
    return 0;
}`

console.log(JSON.stringify(source_code))

// const language_id = 54 // cpp

// const problem = {
//   id: "1",
//   title: "Two Sum",
//   description:
//     "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.\n\n\nExample 1:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nOutput: Because nums[0] + nums[1] == 9, we return [0, 1].\n\nExample 2:\nInput: nums = [3,2,4], target = 6\nOutput: [1,2]\n\nExample 3:\nInput: nums = [3,3], target = 6\nOutput: [0,1]\n\nConstraints:\n`2 <= nums.length <= 103`\n`-109 <= nums[i] <= 109`\n`-109 <= target <= 109`\nOnly one valid answer exists.",
//   is_premium: "0",
//   difficulty: "EASY",
//   refrenceSolution: "/articles/two-sum",
//   acceptance_rate: "46.7",
//   frequency: "100.0",
//   discuss_count: "999",
//   accepted: "4.1M",
//   submissions: "8.7M",
//   companies:
//     "Amazon,Google,Apple,Adobe,Microsoft,Bloomberg,Facebook,Oracle,Uber,Expedia,Twitter,Nagarro,SAP,Yahoo,Cisco,Qualcomm,tcs,Goldman Sachs,Yandex,ServiceNow",
//   relatedTopics: "Array,Hash Table",
//   likes: "20217",
//   dislikes: "712",
//   rating: "97",
//   asked_by_faang: "1",
//   similar_questions:
//     "[3Sum, /problems/3sum/, MEDIUM], [4Sum, /problems/4sum/, MEDIUM], [Two Sum II - Input array is sorted, /problems/two-sum-ii-input-array-is-sorted/, EASY], [Two Sum III - Data structure design, /problems/two-sum-iii-data-structure-design/, EASY], [Subarray Sum Equals K, /problems/subarray-sum-equals-k/, MEDIUM], [Two Sum IV - Input is a BST, /problems/two-sum-iv-input-is-a-bst/, EASY], [Two Sum Less Than K, /problems/two-sum-less-than-k/, EASY], [Max Number of K-Sum Pairs, /problems/max-number-of-k-sum-pairs/, MEDIUM], [Count Good Meals, /problems/count-good-meals/, MEDIUM]",
//   testCases: [
//     {
//       input: "1 2",
//       expectedOutput: "3",
//       hidden: false,
//     },
//     {
//       input: "10 20",
//       expectedOutput: "30",
//       hidden: false,
//     },
//     {
//       input: "-10 20",
//       expectedOutput: "10",
//       hidden: false,
//     },
//   ],
// }

// const data = problem.testCases.map((element) => ({
//   source_code,
//   language_id,
//   stdin: element.input,
// }))
// const expectedOutput = problem.testCases.map(
//   (element) => element.expectedOutput
// )

// console.log("This is the submissions that will go to judge0: ", data)
// console.log("This is the expected output: ", expectedOutput)

// // sending the code to judge0

// // we wil be doing the batch submissions
// const judge0_URL = "https://api.jaydipsatani.com/submissions/batch"

// const response = await axios.post(`${judge0_URL}?base64_encoded=false`, {
//   submissions: data,
// })

// console.log(
//   "This is the resposne that i got from judge0: (which is tokens) ",
//   response.data
// )

// const tokens = response.data.map((element) => element.token)

// console.log("These are the tokens that will be polled to judge0: ", tokens)

// // logic to poll judge0
// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// let pollResults = []
// while (true) {
//   const pollResponse = await axios.get(`${judge0_URL}/`, {
//     params: { tokens: tokens.join(","), base64_encoded: false },
//   })

//   const results = pollResponse.data.submissions

//   const isAllDone = results.every((result) => {
//     return result.status.id !== 1 && result.status.id !== 2
//   })

//   if (isAllDone) {
//     console.log(pollResponse.data)
//     pollResults = results
//     console.log("bhenchod resulta a chuke ha me krr rha hu loop break !")
//     break
//   }

//   // to call after every 1 sec
//   await sleep(1000)
// }

// if (pollResults.length === 0) {
//   console.log("Unable to det get the results")
//   process.exit(1)
// }

// let allTestPass = true
// pollResults.map((element, index) => {
//   if (Number(element.stdout) !== Number(expectedOutput[index])) {
//     // console.log("yaha chud ha tumahari maa bhenchod: ")
//     // console.log("This is the stdout that came: ", element.stdout)
//     // console.log("This is the atdout expected: ", expectedOutput[index])
//     console.log("maa chud gyii bhen chud gyii")
//     allTestPass = false
//   }
// })

// if (allTestPass) console.log("sbb changa sii !! \n saare test passs huye !!!")
// else {
//   console.log("\n\nas earlier said maa chud gyii bhen chud gyii tumahari !!")
// }
