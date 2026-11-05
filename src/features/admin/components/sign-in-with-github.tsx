"use client"

import { useState } from "react"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { GitHubIcon } from "@/components/icons"

export function SignInWithGitHub({ disabled }: { disabled?: boolean }) {
  const [pending, setPending] = useState(false)

  const signIn = async () => {
    setPending(true)

    const { error } = await authClient.signIn.social({
      provider: "github",
      callbackURL: "/admin",
      errorCallbackURL: "/admin/login",
    })

    // On success the browser navigates away; only reset on failure.
    if (error) {
      setPending(false)
    }
  }

  return (
    <Button
      className="w-full"
      size="lg"
      onClick={signIn}
      disabled={disabled || pending}
    >
      {pending ? <Spinner /> : <GitHubIcon />}
      Continue with GitHub
    </Button>
  )
}
