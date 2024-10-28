import React from "react";

const NavBar = () => {
  return (
    <div className="bg-gray-600 flex flex-row justify-between p-4">
      <a href="/">
        <p>English At Large</p>
      </a>
      <div className="flex flex-row: gap-5">
        <a href="dashboard/requests">
          <p>Requests</p>
        </a>
        <a href="dashboard/profile">
          <p>My Profile</p>
        </a>
        <a href="/books">
          <p>Book Details</p>
        </a>
        <a href="/">Logout</a>
      </div>
    </div>
  );
};

export default NavBar;
