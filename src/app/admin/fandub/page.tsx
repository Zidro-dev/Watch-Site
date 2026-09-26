export const dynamic = 'force-dynamic';

import FandubTableServer from "./FandubTableServer";

export default function FandubModerationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Fandub Moderation</h1>
        <p className="text-sm text-muted-foreground">Review and approve audio tracks submitted by creators.</p>
      </div>
      <FandubTableServer />
    </div>
  );
}
