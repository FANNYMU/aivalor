import React from "react";

export default function ArabicText({ children }) {
  // Fungsi untuk membersihkan tag [arabic]
  const cleanArabicText = (text) => {
    return text
      .replace(/\[arabic\]/g, "")
      .replace(/\[\/arabic\]/g, "")
      .trim();
  };

  // Fungsi untuk memvalidasi apakah teks mengandung tag [arabic]
  const hasArabicTags = (text) => {
    return text.includes("[arabic]") && text.includes("[/arabic]");
  };

  // Jika children adalah string dan memiliki tag [arabic]
  if (typeof children === "string" && hasArabicTags(children)) {
    const cleanedText = cleanArabicText(children);
    return <div className="arabic-text">{cleanedText}</div>;
  }

  // Jika tidak memiliki tag [arabic], tampilkan apa adanya
  return <div className="arabic-text">{children}</div>;
}
