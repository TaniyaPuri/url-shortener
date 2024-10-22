// validators.js
import { z } from "zod";

// Define the Zod schema to validate the decoded token's structure
export const TokenSchema = z.object({
  id: z.string(), // The user ID should be a string, adjust based on your JWT structure
  role: z.string(), // Assuming the token has a role field
  // Add any other fields your token should contain
});

// Function to validate the decoded JWT token using Zod
export function validateToken(decodedToken) {
  try {
    // Validate the token structure using Zod
    return TokenSchema.parse(decodedToken);
  } catch (err) {
    // Return error details if the validation fails
    throw new Error(`Invalid token structure: ${err.message}`);
  }
}
