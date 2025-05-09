// getting our initialized clerk client from clerk.ts that manages our clerk session, using our secret key
import clerkClient from "@/clerk";

export const postInviteController = async (
  name: string,
  email: string,
  role: string,
  id: string
) => {
  try {
    if (!name || !email || !role || !id) {
      throw new Error("Missing required user properties");
    }

    const invite = await clerkClient.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: "https://english-at-large-liard.vercel.app/signup",
      publicMetadata: {
        name: name, 
        role: role,
        id: id,
      },
      ignoreExisting: true,
    });

    return invite;
  } catch (error) {
    console.error("Error in postInviteController:", error);
    throw error; // Let the calling function handle the error and response
  }
};

export const getClerkUserController = async (userId: string) => {
  try {
    if (!userId) {
      throw new Error("Missing user ID");
    }

    return await clerkClient.users.getUser(userId as string);
  } catch (error) {
    console.error("Error in getClerkController:", error);
    throw error; // Let the calling function handle the error and response
  }
};
