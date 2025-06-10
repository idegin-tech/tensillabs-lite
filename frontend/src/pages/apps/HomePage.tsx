/* eslint-disable prettier/prettier */
import { useState, useEffect, useMemo } from 'react';
import { Input } from '@heroui/input';
import { Card, CardBody } from '@heroui/card';
import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { TbSearch, TbPlus, TbBuilding } from 'react-icons/tb';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

import AppLogo from '../../components/AppLogo';
import ErrorComponent from '../../components/ErrorComponent';
import CreateWorkspaceModal from '../../components/CreateWorkspaceModal';
import { WorkspaceSkeletonGrid } from './WorkspaceCardSkeleton';
import { useWorkspaces } from '../../hooks/useWorkspaces';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useWorkspaces({
    search: debouncedSearch,
    limit: 12,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allWorkspaces = useMemo(() => {
    return data?.pages.flatMap((page) => page.payload.docs) || [];
  }, [data]);

  const totalCount = data?.pages[0]?.payload.totalDocs || 0;

  const getWorkspaceInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getWorkspaceColor = (workspaceId: string) => {
    const colors = [
      '#3B82F6',
      '#10B981',
      '#8B5CF6',
      '#F59E0B',
      '#EF4444',
      '#06B6D4',
      '#84CC16',
      '#F97316',
    ];
    const index = workspaceId.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-content1 to-background">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/3 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-success/3 rounded-full blur-2xl animate-pulse" />

        <div className="relative z-10 container mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <AppLogo size={140} />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Welcome to Your Workspaces
            </h1>
            <p className="text-default-500 text-lg max-w-2xl mx-auto mb-8">
              Manage your teams, projects, and collaborate seamlessly across all
              your workspaces
            </p>
            <div className="max-w-2xl mx-auto">
              <Input
                disabled
                classNames={{
                  base: 'max-w-full',
                  mainWrapper: 'h-full',
                  input: 'text-large',
                  inputWrapper:
                    'h-16 font-normal text-default-500 bg-background/60 backdrop-blur-sm border-2 border-divider hover:border-primary/50 focus-within:!border-primary data-[hover=true]:border-primary/50 group-data-[focus=true]:border-primary',
                }}
                placeholder="Search workspaces..."
                size="lg"
                startContent={
                  <TbSearch className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                type="search"
                variant="bordered"
              />
            </div>
          </div>
          <WorkspaceSkeletonGrid />
        </div>
      </div>
    );
  }
  if (isError) {
    return (
      <ErrorComponent
        onRetry={refetch}
        heading="Failed to load workspaces"
        paragraph={error?.message || 'Something went wrong. Please try again.'}
        icon={<TbBuilding className="text-3xl text-danger" />}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-content1 to-background">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/3 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-success/3 rounded-full blur-2xl animate-pulse" />

      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <AppLogo size={140} />
          </div>

          <h1 className="text-4xl font-bold mb-4">
            Welcome to Your Workspaces
          </h1>

          <p className="text-default-500 text-lg max-w-2xl mx-auto mb-8">
            Manage your teams, projects, and collaborate seamlessly across all
            your workspaces
          </p>

          <div className="max-w-2xl mx-auto">
            <Input
              classNames={{
                base: 'max-w-full',
                mainWrapper: 'h-full',
                input: 'text-large',
                inputWrapper:
                  'h-16 font-normal text-default-500 bg-background/60 backdrop-blur-sm border-2 border-divider hover:border-primary/50 focus-within:!border-primary data-[hover=true]:border-primary/50 group-data-[focus=true]:border-primary',
              }}
              placeholder="Search workspaces..."
              size="lg"
              startContent={
                <TbSearch className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              type="search"
              value={searchQuery}
              variant="bordered"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-foreground">
            Your Workspaces ({totalCount})
          </h2>
          <Button
            color="primary"
            endContent={<TbPlus className="text-xl" />}
            onPress={() => setIsCreateModalOpen(true)}
          >
            Create Workspace
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {allWorkspaces.map((membershipData) => {
            const workspace = membershipData.workspace;
            const member = membershipData;
            const color = getWorkspaceColor(workspace._id);
            const initials = getWorkspaceInitials(workspace.name);            return (
              <Link to={`/workspaces/${workspace._id}/apps/tasks`}>
                <Card
                  key={`${workspace._id}-${member._id}`}
                  isPressable
                  className='w-full border border-divider hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 cursor-pointer group bg-background/80 backdrop-blur-sm'
                >
                  <CardBody className="p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start gap-4">
                        <div className="relative flex-shrink-0">
                          {workspace.logoURL ? (
                            <Avatar
                              className="ring-2 ring-divider group-hover:ring-primary/30 transition-all w-16 h-16"
                              src={workspace.logoURL}
                            />
                          ) : (
                            <div
                              className="w-16 h-16 rounded-xl flex items-center justify-center ring-2 ring-divider group-hover:ring-primary/30 transition-all shadow-sm text-white font-bold text-lg"
                              style={{ backgroundColor: color }}
                            >
                              {initials}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-tight line-clamp-1">
                            {workspace.name}
                          </h3>
                          <p className="text-default-600 text-sm leading-relaxed line-clamp-2 mb-3">
                            {workspace.description || 'No description provided'}
                          </p>
                        </div>
                      </div>

                    </div>
                  </CardBody>
                </Card>
              </Link>
            );
          })}
        </div>

        {isFetchingNextPage && (
          <div className="mt-8">
            <WorkspaceSkeletonGrid />
          </div>
        )}

        <div ref={ref} className="h-4" />

        {allWorkspaces.length === 0 && debouncedSearch && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-default-100 flex items-center justify-center">
              <TbSearch className="text-3xl text-default-400" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No workspaces found
            </h3>
            <p className="text-default-500">
              Try adjusting your search terms or create a new workspace
            </p>
          </div>
        )}

        {allWorkspaces.length === 0 && !debouncedSearch && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
              <TbBuilding className="text-3xl text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No workspaces yet
            </h3>
            <p className="text-default-500 mb-6">
              Create your first workspace to start collaborating with your team
            </p>            <Button
              className="bg-gradient-to-r from-primary to-secondary text-white font-semibold"
              endContent={<TbPlus className="text-xl" />}
              size="lg"
              onPress={() => setIsCreateModalOpen(true)}
            >
              Create Your First Workspace
            </Button>
          </div>)}

        <CreateWorkspaceModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </div>
  );
}
