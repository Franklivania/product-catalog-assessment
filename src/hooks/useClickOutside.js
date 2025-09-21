"use client";
import { useEffect, useRef } from "react";

export const useClickOutside = (callback, enabled) => {
  const ref = useRef();

  useEffect(() => {
    const handleClick = (event) => {
      // Don't close modal if clicking on form elements or submit buttons
      if (ref.current && !ref.current.contains(event.target)) {
        // Check if the clicked element is a submit button or form element
        const isFormElement =
          event.target.closest("form") ||
          event.target.type === "submit" ||
          event.target.getAttribute("type") === "submit";

        if (!isFormElement && enabled) {
          callback();
        }
      }
    };

    if (enabled) {
      document.addEventListener("mousedown", handleClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [callback, enabled]);

  return ref;
};
