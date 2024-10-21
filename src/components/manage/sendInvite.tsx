import React from 'react'
// import { Clerk } from "@clerk/clerk-sdk-node";
//import { Clerk } from '@clerk/nextjs';
import { Clerk } from "@clerk/clerk-sdk-node";





function SendInvite() {
    const clerkClient = new Clerk();
n


  const sendEmail = () => {
    console.log("submitted the form!");
  }

  return (
    <div>
    <form onSubmit={sendEmail}> 
      <p>Full Name: </p>
      <input type="text" name="fullname" className="text-black"/>
      <p>Email: </p>
      <input type="text" name="email" className="text-black"/>
      </ form>
      <p>Invite as </p>
      
      <input type="radio" id="tutor" name="usertype" value="Tutor" className="text-white"/>
      <label htmlFor="tutor">Tutor</ label>
      <br></br>
      <input type="radio" id="admin" name="usertype" value="Admin"/>
      <label htmlFor="admin">Admin</ label>
      <br></br>
      <button>Cancel</button>
      <br></br>
      <button>Send Invite</button>
      <input type='submit'/>
</div>
  )
}

// const response = await clerkClient.invitations.createInvitation({
//     emailAddress: 'invite@example.com',
//     redirectUrl: 'https://www.example.com/my-sign-up',
//     publicMetadata: {
//       example: 'metadata',
//       example_nested: {
//         nested: 'metadata',
//       },
//     },
//   })
  
  //console.log(response)
  /*
  _Invitation {
    id: 'inv_123',
    emailAddress: 'invite@example.com',
    publicMetadata: { example: 'metadata', example_nested: [Object] },
    createdAt: 1705531674576,
    updatedAt: 1705531674576,
    status: 'pending',
    revoked: undefined
  }
  */

export default SendInvite