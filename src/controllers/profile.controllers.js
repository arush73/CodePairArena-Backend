import { UserProfile } from "../models/userProfile.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getMyProfile = asyncHandler(async (req, res) => {
  let profile = await UserProfile.findOne({ owner: req.user._id }).populate(
    "owner",
    "username email avatar"
  )

  if (!profile) {
    profile = await UserProfile.create({
      owner: req.user._id,
    })
    // Re-fetch to populate owner details
    profile = await UserProfile.findById(profile._id).populate(
      "owner",
      "username email avatar"
    )
  }

  // Merge profile data with user data
  const userData = {
    ...profile.toObject(),
    username: profile.owner?.username,
    email: profile.owner?.email,
    avatar: profile.owner?.avatar,
    owner: undefined, // Remove the nested owner object to keep it flat
  }

  return res
    .status(200)
    .json(new ApiResponse(200, userData, "User profile fetched successfully"))
})

const updateMyProfile = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    bio,
    location,
    website,
    socialLinks,
    skills,
    education,
    workExperience,
  } = req.body

  // Construct update object to avoid unsetting fields with undefined
  const updateData = {}
  if (firstName !== undefined) updateData.firstName = firstName
  if (lastName !== undefined) updateData.lastName = lastName
  if (bio !== undefined) updateData.bio = bio
  if (location !== undefined) updateData.location = location
  if (website !== undefined) updateData.website = website
  if (socialLinks !== undefined) updateData.socialLinks = socialLinks
  if (skills !== undefined) updateData.skills = skills
  if (education !== undefined) updateData.education = education
  if (workExperience !== undefined) updateData.workExperience = workExperience

  const profile = await UserProfile.findOneAndUpdate(
    { owner: req.user._id },
    { $set: updateData },
    { new: true, upsert: true, runValidators: true }
  ).populate("owner", "username email avatar")

  const userData = {
    ...profile.toObject(),
    username: profile.owner?.username,
    email: profile.owner?.email,
    avatar: profile.owner?.avatar,
    owner: undefined,
  }

  return res
    .status(200)
    .json(new ApiResponse(200, userData, "User profile updated successfully"))
})

export { getMyProfile, updateMyProfile }
