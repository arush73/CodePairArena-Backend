import mongoose from "mongoose"

const submissionSchema = new mongoose.Schema({
     problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sourceCode: {
        type: String,
        required:true
    },
    language: {
      type: String,
      required: true,
    },
   
    compileOutput: {
      type: String,
    },
    status: {
      type: String,
      required: true,
    },
    time: {
      type: String,
    },
    memory: {
      type: String,
    },
  },
 { timestamps: true })

export const Submission = mongoose.model("Submission", submissionSchema )
