import clerkClient from "@/clerk";


export const postInviteController = async (name: string, email: string, kind: string) => {
    try {
        console.log(name)
        console.log(email)
        console.log(kind)
        // Validate required fields
      if (is_empty(name)||is_empty(email)||is_empty(kind)) {
        throw new Error("Missing required user properties");
      }
  
      clerkClient.invitations.createInvitation({
        emailAddress: email,
        redirectUrl: "http://localhost:3000/invite", 
        publicMetadata: {
            name: name,
            accountType: kind
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
  