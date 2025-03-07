import React from "react";
import BookCatalog from "@/components/common/tables/BookCatalog";
import UserHistory from "@/components/common/tables/UserHistory";

export default function TablesPage() {
  return (
    <div>
      <BookCatalog />
      <UserHistory />
    </div>
  );
}
