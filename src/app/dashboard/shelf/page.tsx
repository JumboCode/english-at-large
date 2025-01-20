"use client";
import React, { useEffect, useState, use } from "react";
import { getOneUser } from "@/lib/api/users";
import { User } from "@prisma/client";

type Params = Promise<{ id: string }>;

const Shelf = (props: { params: Promise<Params> }) => {
    const params = use(props.params);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
          const user = await getOneUser((await params).id);
          setUser(user || null);
        };
        fetchUser();
      }, [params]);

    if (user == null) return null; 

    return (
    <div> <p> Hi, {user.name} </p></div>
    );
  };
  
  export default Shelf; 