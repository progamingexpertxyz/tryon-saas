"use client";

import { useEffect } from "react";

/**
 * Hides ONLY Clerk's "Development mode" badge.
 * ("Secured by Clerk" is handled by CSS — hiding the clerk.com link.)
 *
 * Matches the badge by exact leaf text "development mode" and walks up only
 * while the ancestor contains nothing but that text. The moment an ancestor
 * contains anything else (e.g. the "Sign up" switch), it stops — so form
 * content is never affected.
 */
export default function ClerkBrandingHider() {
  useEffect(() => {
    const hide = () => {
      document.querySelectorAll<HTMLElement>("body *").forEach((node) => {
        if (node.children.length > 0) return; // leaf nodes only
        const text = node.textContent?.trim().toLowerCase() ?? "";
        if (text !== "development mode") return;

        // climb while the element's whole text is still just the badge
        let el: HTMLElement | null = node;
        while (el && el !== document.body) {
          const up: HTMLElement | null = el.parentElement;
          const parentText = (up?.textContent ?? "").trim().toLowerCase();
          if (!up || parentText !== "development mode") {
            el.style.display = "none";
            return;
          }
          el = up;
        }
      });
    };

    hide();
    const observer = new MutationObserver(hide);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
