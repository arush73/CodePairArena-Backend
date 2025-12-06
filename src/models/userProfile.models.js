import mongoose from "mongoose"

const userProfileSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: {
      type: String,
      trim: true,
      default: "",
    },
    lastName: {
      type: String,
      trim: true,
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      maxLength: 250,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    website: {
      type: String,
      trim: true,
      default: "",
    },
    socialLinks: {
      github: { type: String, trim: true, default: "" },
      linkedin: { type: String, trim: true, default: "" },
      twitter: { type: String, trim: true, default: "" },
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    education: [
      {
        institution: { type: String, required: true },
        degree: { type: String },
        fieldOfStudy: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        description: { type: String },
      },
    ],
    workExperience: [
      {
        company: { type: String, required: true },
        position: { type: String, required: true },
        startDate: { type: Date },
        endDate: { type: Date },
        current: { type: Boolean, default: false },
        description: { type: String },
      },
    ],
    solvedStats: {
      easy: { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      hard: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
      streak: { type: Number, default: 0 },
      lastActiveDate: { type: Date },
      ranking: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
)

export const UserProfile = mongoose.model("UserProfile", userProfileSchema)
