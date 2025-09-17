
import React, { useEffect, useState } from "react";

export function Toast({ message, show, duration = 3000, type = "success" }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  if (!visible) return null;

  const bgColor = type === "success" ? "bg-[#8366FC]" : "bg-red-600";

  return (
    <div className={`fixed top-20 right-5 px-4 py-2 rounded shadow-lg text-white ${bgColor} transition-all duration-300`}>
      {message}
    </div>
  );
}
