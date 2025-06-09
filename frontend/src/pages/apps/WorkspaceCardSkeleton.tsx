import { Card, CardBody } from '@heroui/card';
import { Skeleton } from '@heroui/skeleton';

export default function WorkspaceCardSkeleton() {
  return (
    <Card className="border border-divider shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer bg-background/80 backdrop-blur-sm">
      <CardBody className="p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="w-16 h-16 rounded-xl flex-shrink-0" />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <Skeleton className="h-6 w-3/4 rounded-lg mb-2" />
                <Skeleton className="h-4 w-full rounded-lg" />
              </div>
              <Skeleton className="w-12 h-6 rounded-full ml-3" />
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
              </div>
              <Skeleton className="h-4 w-16 rounded" />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export function WorkspaceSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <WorkspaceCardSkeleton key={index} />
      ))}
    </div>
  );
}
