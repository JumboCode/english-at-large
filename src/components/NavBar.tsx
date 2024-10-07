import React from "react";

const NavBar = () => {
  return (
    <div
      style={{
        backgroundColor: "grey",
        padding: 15,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", flexDirection: "row", gap: 20 }}>
        <a href="/">
          <p>English At Large</p>
        </a>
        <p>+ Add new</p>
      </div>
      <div style={{ display: "flex", flexDirection: "row", gap: 20 }}>
        <a href="/requests">
          <p>Requests</p>
        </a>
        <a href="/myprofile">
          <p>My Profile</p>
        </a>
      </div>
    </div>
  );
};

export default NavBar;
