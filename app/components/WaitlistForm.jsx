"use client";

import { useId, useState } from "react";

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Posts to /signup (proxied to the core API, see vercel.json — /waitlist is rewritten too but
 * the API has never implemented that path, so every submission there 404'd). /signup accepts
 * { email } and returns a credential in its response; this form never reads or surfaces it —
 * a waitlist confirmation isn't a credential hand-off, so success is just a confirmation
 * message. `source` is optional attribution ("virtuals", …) appended to the body so campaign
 * traffic can be told apart later.
 */
export default function WaitlistForm({ id, variant, size, source }) {
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
      const response = await fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(source ? { email: value, source } : { email: value }),
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
      <label className="sr-only" htmlFor={inputId}>Email</label>
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
