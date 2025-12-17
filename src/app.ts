import "dotenv/config";
import express from "express";
import { clerkClient, requireAuth, getAuth } from "@clerk/express";

const app = express();
const PORT = 3000;

// Public health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Use requireAuth() to protect this route
// If user isn't authenticated, requireAuth() will redirect back to the homepage
app.get("/protected", requireAuth(), async (req, res) => {
  // Use `getAuth()` to get the user's `userId`
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthenticated" });
  }

  // Use Clerk's JavaScript Backend SDK to get the user's User object
  const user = await clerkClient.users.getUser(userId);

  return res.json({ user });
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
