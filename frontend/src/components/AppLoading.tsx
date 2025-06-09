import { Spinner } from '@heroui/react';
import { TbStack3 } from 'react-icons/tb';

export default function AppLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-content1 to-background flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-success/5 rounded-full blur-2xl animate-pulse" />

      <div className="text-center relative z-10">
        <div className="mb-8 space-y-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-primary via-secondary to-success rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/20 animate-pulse">
              <TbStack3 className="w-12 h-12 text-primary-foreground" />
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-success/20 rounded-full blur-xl opacity-50 animate-ping" />
          </div>

          <div className="flex justify-center">
            <Spinner
              classNames={{
                circle1: 'border-b-primary/30',
                circle2: 'border-b-primary',
              }}
              color="primary"
              size="lg"
            />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-success bg-clip-text text-transparent">
            Loading
          </h2>
          <p className="text-default-500 text-lg max-w-md mx-auto leading-relaxed">
            Preparing your experience with the latest features and updates...
          </p>
        </div>

        <div className="mt-12 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-2 h-2 bg-success rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>
    </div>
  );
}
