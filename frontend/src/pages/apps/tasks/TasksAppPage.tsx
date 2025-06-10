
import AppLayout from '@/components/layouts/app-layouts/AppLayout';
import AppLayoutBody from '@/components/layouts/app-layouts/AppLayoutBody';
import { useParams } from 'react-router-dom';

export default function TasksAppPage() {
  const { member_id } = useParams();

  return (
    <>
      <AppLayout>
        <AppLayoutBody>
          <div className="space-y-6">
            <div className="bg-content1 rounded-lg p-6 border border-divider">
              <h1 className="text-2xl font-bold text-foreground mb-2">Tasks Application</h1>
              <p className="text-foreground-600">
                Welcome to the Tasks app for workspace: {member_id}
              </p>
            </div>

            <div className="bg-content1 rounded-lg p-6 border border-divider">
              <h2 className="text-lg font-semibold mb-4">Getting Started</h2>
              <p className="text-foreground-600">
                This is the Tasks application page. Here you can manage tasks, create lists, and collaborate with your team.
              </p>
            </div>
          </div>
        </AppLayoutBody>
      </AppLayout>
    </>
  )
}
