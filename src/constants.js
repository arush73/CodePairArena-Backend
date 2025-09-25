export const DB_NAME = "real_leetclone"

export const UserRolesEnum = {
  ADMIN: "ADMIN",
  USER: "USER",
}

export const AvailableUserRoles = Object.values(UserRolesEnum)

export const USER_TEMPORARY_TOKEN_EXPIRY = 20 * 60 * 1000

export const UserLoginType = {
  GOOGLE: "GOOGLE",
  GITHUB: "GITHUB",
  EMAIL_PASSWORD: "EMAIL_PASSWORD",
}

export const AvailableSocialLogins = Object.values(UserLoginType)

export const problemDifficulty = {
  EASY: "EASY",
  MEDIUM: "MEDUIM",
  HARD: "HARD",
}

export const AvailableProblemDifficulty = Object.values(problemDifficulty)
