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
import { useRegister } from '../../hooks/useAuth';

import AuthLayout from './AuthLayout';
import EmailVerificationPage from './EmailVerificationPage';

const registerSchema = z
  .object({
    email: z
      .string()
      .email('Please enter a valid email address')
      .min(1, 'Email is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function SignupPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const registerMutation = useRegister();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: RegisterForm) => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    registerMutation.mutate(
      { ...data, timezone },
      {
        onSuccess: () => {
          setUserEmail(data.email);
          setShowEmailVerification(true);
        },
      }
    );
  };

  const handleBackToSignup = () => {
    setShowEmailVerification(false);
    setUserEmail('');
  };

  if (showEmailVerification) {
    return (
      <EmailVerificationPage email={userEmail} onBack={handleBackToSignup} />
    );
  }

  return (
    <AuthLayout
      subtitle={`Join ${APP_CONFIG.name} and start your journey`}
      title="Create Account"
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
                  placeholder="Create a strong password"
                  size="lg"
                  startContent={<TbLock className="w-4 h-4 text-default-400" />}
                  type={isPasswordVisible ? 'text' : 'password'}
                  variant="bordered"
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
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
                      onClick={() =>
                        setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                      }
                    >
                      {isConfirmPasswordVisible ? (
                        <TbEyeOff className="w-4 h-4 text-default-400 pointer-events-none" />
                      ) : (
                        <TbEye className="w-4 h-4 text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  errorMessage={errors.confirmPassword?.message}
                  isInvalid={!!errors.confirmPassword}
                  isRequired
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  size="lg"
                  startContent={<TbLock className="w-4 h-4 text-default-400" />}
                  type={isConfirmPasswordVisible ? 'text' : 'password'}
                  variant="bordered"
                />
              )}
            />

            <Button
              className="w-full font-semibold text-lg h-12"
              color="primary"
              isLoading={isSubmitting || registerMutation.isPending}
              size="lg"
              type="submit"
            >
              {isSubmitting || registerMutation.isPending
                ? 'Creating account...'
                : 'Create Account'}
            </Button>

            <div className="text-center pt-4">
              <p className="text-default-500">
                Already have an account?{' '}
                <Link
                  className="text-primary hover:text-primary-600 font-semibold"
                  color="primary"
                  href="/"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </CardBody>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-xs text-default-400 leading-relaxed">
          By creating an account, you agree to our{' '}
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