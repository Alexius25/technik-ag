import { betterAuth } from "better-auth"
import { admin } from "better-auth/plugins"
import { apiKey } from "@better-auth/api-key"
import { db } from "@/lib/db"

export const auth = betterAuth({
  database: db,
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      firstName: { type: "string", required: true },
      lastName: { type: "string", required: true },
      className: { type: "string", required: true },
    },
  },
  plugins: [apiKey(), admin()],
})
