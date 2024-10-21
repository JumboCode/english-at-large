import { createClerkClient } from "@clerk/clerk-sdk-node";


const clerkClient = createClerkClient({
    // secretKey: process.env.CLERK_SECRET_KEY,
    secretKey: "sk_test_ViZEc9qgYeF0fiXsJaNOPEVkMifBx9pKljv3boRwWr",
});

export default clerkClient;