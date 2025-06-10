/* eslint-disable prettier/prettier */
import { useState } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Card, CardBody } from '@heroui/card';
import { Link } from '@heroui/link';
import { TbMail, TbLock, TbEye, TbEyeOff } from 'react-icons/tb';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { APP_CONFIG } from '../../config/app.config';
import { useLogin } from '../../hooks/useAuth';

import AuthLayout from './AuthLayout';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const loginMutation = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return (
    <AuthLayout
      subtitle={`Sign in to continue to ${APP_CONFIG.name}`}
      title="Welcome Back"
    >
      <Card className="border border-divider shadow-md backdrop-blur-sm bg-background/80">
        <CardBody className="py-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Input
                  {...field}
                  classNames={{
                    input: 'text-foreground',
                    label: 'text-default-600',
                    inputWrapper:
                      'border-divider hover:border-primary focus-within:!border-primary',
                  }}
                  color="primary"
                  errorMessage={errors.email?.message}
                  isInvalid={!!errors.email}
                  isRequired
                  label="Email Address"
                  placeholder="Enter your email address"
                  size="lg"
                  startContent={<TbMail className="w-4 h-4 text-default-400" />}
                  type="email"
                  variant="bordered"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <Input
                  {...field}
                  classNames={{
                    input: 'text-foreground',
                    label: 'text-default-600',
                    inputWrapper:
                      'border-divider hover:border-primary focus-within:!border-primary',
                  }}
                  color="primary"
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                      {isPasswordVisible ? (
                        <TbEyeOff className="w-4 h-4 text-default-400 pointer-events-none" />
                      ) : (
                        <TbEye className="w-4 h-4 text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  errorMessage={errors.password?.message}
                  isInvalid={!!errors.password}
                  isRequired
                  label="Password"
                  placeholder="Enter your password"
                  size="lg"
                  startContent={<TbLock className="w-4 h-4 text-default-400" />}
                  type={isPasswordVisible ? 'text' : 'password'}
                  variant="bordered"
                />
              )}
            />

            <div className="flex items-center justify-between">
              <Link
                className="text-sm text-primary hover:text-primary-600"
                color="primary"
                href="#"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              className="w-full font-semibold text-lg h-12"
              color="primary"
              isLoading={isSubmitting || loginMutation.isPending}
              size="lg"
              type="submit"
            >
              {isSubmitting || loginMutation.isPending ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="text-center pt-4">
              <p className="text-default-500">
                {`Don't have an account?`}{' '}
                <Link
                  className="text-primary hover:text-primary-600 font-semibold"
                  color="primary"
                  href="/register"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </CardBody>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-xs text-default-400 leading-relaxed">
          By signing in, you agree to our{' '}
          <Link className="text-primary" color="primary" href="#" size="sm">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link className="text-primary" color="primary" href="#" size="sm">
            Privacy Policy
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
