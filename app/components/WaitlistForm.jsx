"use client";

import { useId, useState } from "react";

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Posts to /waitlist (proxied to the core API, see vercel.json). Unlike the old /signup-backed
 * "Join the beta" link, this only records an email — no credential comes back, so success is
 * just a confirmation message, not a key to show the user.
 */
export default function WaitlistForm({ id, variant, size }) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");

  const classes = ["waitlist", variant === "dark" && "waitlist--dark", size === "lg" && "waitlist--lg"]
    .filter(Boolean)
    .join(" ");

  if (status === "success") {
    return (
      <p className={classes + " waitlist--done"} id={id}>
        You're on the list. We'll reach out when it opens.
      </p>
    );
  }

  const submit = async (event) => {
    event.preventDefault();
    const value = email.trim();

    if (!EMAIL_SHAPE.test(value)) {
      setStatus("error");
      setError("Enter a valid email address.");
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch("/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      if (!response.ok) throw new Error("waitlist request failed");
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Could not join the waitlist. Try again.");
    }
  };

  return (
    <form className={classes} id={id} noValidate onSubmit={submit}>
      <label className="waitlist__label" htmlFor={inputId}>Email</label>
      <div className="waitlist__field">
        <input
          id={inputId}
          className="waitlist__input"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          disabled={status === "loading"}
          aria-invalid={status === "error"}
          aria-describedby={status === "error" ? errorId : undefined}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status === "error") setStatus("idle");
          }}
        />
        <button className="btn waitlist__btn" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Joining..." : "Join the waitlist"}
        </button>
      </div>
      {status === "error" ? (
        <p className="waitlist__error" id={errorId}>{error}</p>
      ) : null}
    </form>
  );
}
