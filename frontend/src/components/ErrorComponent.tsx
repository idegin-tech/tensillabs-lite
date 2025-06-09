import { Button } from '@heroui/button';
import { ReactNode } from 'react';

interface ErrorComponentProps {
  onRetry: () => void;
  heading: string;
  paragraph: string;
  icon: ReactNode;
}

export default function ErrorComponent({
  onRetry,
  heading,
  paragraph,
  icon,
}: ErrorComponentProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-content1 to-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-danger-100 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {heading}
        </h3>
        <p className="text-default-500 mb-6">
          {paragraph}
        </p>
        <Button color="primary" onClick={onRetry}>
          Retry
        </Button>
      </div>
    </div>
  );
}
