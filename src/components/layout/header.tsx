"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export function Header({ title }: { title: string }) {
  const { data: session } = useSession();

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border">
      <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      <div className="flex items-center gap-3">
        {session?.user ? (
          <div className="flex items-center gap-2">
            {session.user.image && (
              <img
                src={session.user.image}
                alt=""
                className="w-7 h-7 rounded-full"
              />
            )}
            <span className="text-sm text-muted-foreground">{session.user.name}</span>
            <button
              onClick={() => signOut()}
              className="text-xs text-muted-foreground hover:text-foreground ml-2"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn("github")}
            className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90"
          >
            Sign in with GitHub
          </button>
        )}
      </div>
    </header>
  );
}
