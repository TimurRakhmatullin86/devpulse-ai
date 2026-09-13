"use client";

import { Header } from "@/components/layout/header";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <>
      <Header title="Settings" />
      <div className="p-6 space-y-6 max-w-2xl">
        <div className="bg-card border border-border rounded-lg p-5 space-y-4">
          <h3 className="text-sm font-semibold">GitHub App Installation</h3>
          <p className="text-sm text-muted-foreground">
            Install the DevPulse AI GitHub App on your organization to start collecting
            PR data via webhooks.
          </p>
          <div className="flex items-center gap-3">
            <a
              href={`https://github.com/apps/devpulse-ai/installations/new`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-md text-sm font-medium hover:opacity-90"
            >
              Install GitHub App
            </a>
            <span className="text-xs text-muted-foreground">
              Requires org admin permissions
            </span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5 space-y-4">
          <h3 className="text-sm font-semibold">AI Detection Settings</h3>
          <p className="text-sm text-muted-foreground">
            Configure how DevPulse AI identifies AI-assisted pull requests.
          </p>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded border-border" />
              <span className="text-sm">Co-Authored-By headers (copilot, claude, cursor)</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded border-border" />
              <span className="text-sm">Commit message patterns (auto-generated, [ai])</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded border-border" />
              <span className="text-sm">PR body markers</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded border-border" />
              <span className="text-sm">AI config files (.cursor/, CLAUDE.md, .copilot)</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="rounded border-border" />
              <span className="text-sm">Heuristic: large PRs authored quickly (experimental)</span>
            </label>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5 space-y-4">
          <h3 className="text-sm font-semibold">Connected Account</h3>
          {session?.user ? (
            <div className="flex items-center gap-3">
              {session.user.image && (
                <img src={session.user.image} alt="" className="w-8 h-8 rounded-full" />
              )}
              <div>
                <div className="text-sm font-medium">{session.user.name}</div>
                <div className="text-xs text-muted-foreground">{session.user.email}</div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Not signed in</p>
          )}
        </div>

        <div className="bg-card border border-border rounded-lg p-5 space-y-4">
          <h3 className="text-sm font-semibold">Weekly Email Digest</h3>
          <p className="text-sm text-muted-foreground">
            Receive a weekly summary of AI usage and productivity metrics.
          </p>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="rounded border-border" />
            <span className="text-sm">Enable weekly digest</span>
          </label>
          <label className="block">
            <span className="text-xs text-muted-foreground">Recipients (comma-separated)</span>
            <input
              type="text"
              placeholder="cto@company.com, eng-lead@company.com"
              className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
            />
          </label>
        </div>

        <div className="bg-card border border-border rounded-lg p-5 space-y-4">
          <h3 className="text-sm font-semibold">Webhook Endpoint</h3>
          <p className="text-sm text-muted-foreground">
            Configure your GitHub App to send webhook events to:
          </p>
          <code className="block bg-muted px-3 py-2 rounded text-xs font-mono">
            POST https://your-domain.com/api/webhooks/github
          </code>
          <p className="text-xs text-muted-foreground">
            Events needed: <code>pull_request</code>, <code>pull_request_review</code>
          </p>
        </div>
      </div>
    </>
  );
}
