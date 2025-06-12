import { redirect } from 'next/navigation'

interface WorkspacePageProps {
  params: {
    member_id: string
  }
}

export default function WorkspacePage({ params }: WorkspacePageProps) {
  // Redirect to the default app (tasks) for now
  // This can be updated later to show a workspace dashboard
  redirect(`/workspaces/${params.member_id}/apps/tasks`)
}
