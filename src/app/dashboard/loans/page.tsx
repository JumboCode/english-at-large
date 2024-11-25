"use client";
import React, { useEffect, useState } from "react";
// import SendInvite from "../../../components/manage/sendInvite";
import SearchBar from "@/components/SearchBar";
import CommonButton from "@/components/common/button/CommonButton";
import { User, BookRequest, BookStatus } from "@prisma/client";
// import { getAllUsers, getOneUser } from "@/lib/api/users";
import CommonDropdown from "@/components/common/forms/Dropdown";
// import PendingChip from "@/assets/icons/pending_chip";
// import { deleteUser } from "@/lib/api/users";
// import Link from "next/link";
import { dateToTimeString } from "@/lib/util/utilFunctions";
import { getRequests, updateRequest } from "@/lib/api/requests";

const Loans = () => {
  // const [users, setUsers] = useState<User[]>([]);
  // const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [requests, setRequests] = useState<BookRequest[]>([])
  const [oneRequest, setOneRequest] = useState<BookRequest>();
  const [selectedValue, setSelectedValue] = useState<string>("");
  

  // const updateReq = async (req: BookRequest) => {
  //   await updateRequest(req)
  // }

  const updateReq = async (req: BookRequest) => {
    await updateRequest(req)
    setOneRequest(req)
  }

  // const toggleSelectedValue = () => {
  //   setSelectedValue(!selectedValue);
  // }

  useEffect(() => {
    // const getUsers = async () => {
    //   const allUsers = await getAllUsers();
    //   setUsers(allUsers ?? []);
    // };

    // getUsers();
  
    const getReqs = async () => {
      const allRequests = await getRequests();
      setRequests(allRequests ?? [])
    }


    getReqs();

  }, [oneRequest]);

  useEffect(() => {
    // if (selectedValue == "Pickup") {
    //   updateReq({...request, status : BookStatus.Returned})
    // }
  }, [selectedValue])

  // const getUser = async (id: string) => {
  //   const user = await getOneUser(id);
  //   return user;
  // }
  
  return (
    <div className="bg-white">
      <h1 className="bg-white text-black px-16 pt-12 font-bold text-3xl font-[family-name:var(--font-rubik)]">
        Manage loans
      </h1>
      {/* <SearchBar
        // button={
        //   <CommonDropdown items={["Request Date", "Return Date", "Pick-up", "Borrowed"]}  />
        // }
        placeholderText="Search by name or email"
      /> */}
      <div className="px-16">
        <table className="table-auto bg-white w-full font-family-name:var(--font-geist-sans)]">
          <thead>
            <tr className="bg-gray-100">
              <th className="w-1/6 text-left text-text-default-secondary">
                Name
              </th>
              <th className="w-1/6  text-left text-text-default-secondary">
                Book Title
              </th>
              <th className="w-1/6  text-left text-text-default-secondary">
                Requested On
              </th>
              <th className="w-1/6  text-left text-text-default-secondary">
                Return By
              </th>
              <th className="w-1/6 text-left text-text-default-secondary">
                Status
              </th>
              <th className="w-1/6" />
            </tr>
          </thead>
          <tbody className="divide-y divide-solid">
            {requests.filter((request) => {return request.status !== BookStatus.Returned}).map((request, index) => (
              <tr key={index} className="bg-white h-16">
                <td className="flex flex-col">
                  <p className="text-black font-semibold">{request.userId}</p>
                  {/* <Link
                    href={"mailto:" + user.email}
                    className="text-text-default-secondary underline max-w-max"
                  > */}
                    {/* {getUser(request.userId)} */}
                  {/* </Link> */}
                </td>
                <td className=" text-black">
                  <div className="flex justify-between min-w-max max-w-[50%]">
                    {request.bookId}
                  </div>
                </td>
                {/* <td>{re ? <PendingChip /> : null}</td> */}
                    
                <td className="text-black">
                  {dateToTimeString(request.requestedOn)}
                </td>
                
                <td className="text-black">
                  {dateToTimeString(request.returnedBy)}
                </td>

                <td className="text-black">
                  {/* {setSelectedValue(request.status)} */}
                  {selectedValue == "Pickup" ? 
                    (<CommonDropdown items={["Borrowed"]} 
                      defaultValue="Pickup"
                      // hideSelectedOption={true}
                      selectedValue={selectedValue}
                      setSelectedValue={setSelectedValue}
                      /> 
            
                    )
                    : 
                    (<CommonDropdown items={["Pickup"]} 
                      defaultValue="Borrowed"
                      // hideSelectedOption={true} 
                      selectedValue={selectedValue}
                      setSelectedValue={setSelectedValue}
                      />
                    )}
                </td>
                    
                <td>
                  <div className="flex justify-start items-center">
                    <CommonButton
                      label="Mark as Returned"
                      onClick={() => {
                        updateReq({...request, status : BookStatus.Returned})
                      }}
                      altTextStyle="text-blue"
                      altStyle="bg-white"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Loans