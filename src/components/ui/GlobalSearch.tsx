"use client";

import { useState, useEffect } from "react";
import SearchModal from "./SearchModal";

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    document.addEventListener("open-search", handleOpen);
    return () => document.removeEventListener("open-search", handleOpen);
  }, []);

  return <SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />;
}
