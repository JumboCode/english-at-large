import clerkClient from "@/clerk";


export const postInviteController = async (name: string, email: string, role: string) => {
    try {
      if (is_empty(name)||is_empty(email)||is_empty(role)) {
        throw new Error("Missing required user properties");
      }
  
      clerkClient.invitations.createInvitation({
        emailAddress: email,
        redirectUrl: "http://localhost:3000/invite", 
        publicMetadata: {
            name: name,
            role: role
        }, 
        ignoreExisting: true
        // Link that user will click on
      });

      return true;
    } catch (error) {
      console.error("Error in postInviteController:", error);
      throw error; // Let the calling function handle the error and response
    }
  };

function is_empty(str: string) {
    return str === "";
}
  