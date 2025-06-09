/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import { Card, CardBody, Input, Button, Divider } from '@heroui/react';
import { TbMail, TbShield, TbArrowLeft } from 'react-icons/tb';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useVerifyEmail, useResendOtp } from '../../hooks/useAuth';

import AuthLayout from './AuthLayout';

const verifyEmailSchema = z.object({
  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d+$/, 'OTP must contain only numbers'),
});

type VerifyEmailForm = z.infer<typeof verifyEmailSchema>;

interface EmailVerificationPageProps {
  email: string;
  onBack: () => void;
}

export default function EmailVerificationPage({
  email,
  onBack,
}: EmailVerificationPageProps) {
  const [countdown, setCountdown] = useState<number | null>(null);
  const verifyEmailMutation = useVerifyEmail();
  const resendOtpMutation = useResendOtp();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<VerifyEmailForm>({
    resolver: zodResolver(verifyEmailSchema),
    mode: 'onChange',
  });

  const otpValue = watch('otp');

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }

    return () => clearTimeout(timer);
  }, [countdown]);

  const onSubmit = async (data: VerifyEmailForm) => {
    verifyEmailMutation.mutate({
      email,
      otp: data.otp,
    });
  };

  const handleResendOtp = () => {
    resendOtpMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setCountdown(60);
        },
      },
    );
  };

  return (
    <AuthLayout
      subtitle="Check your email for the verification code"
      title="Verify Your Email"
    >
      <Card className="border border-divider shadow-md backdrop-blur-sm bg-background/80">
        <CardBody className="py-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <TbMail className="w-8 h-8 text-primary" />
            </div>
            <p className="text-default-600">
              {`We've sent a 6-digit verification code to:`}
            </p>
            <p className="font-semibold text-foreground mt-1">{email}</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              control={control}
              name="otp"
              render={({ field }) => (
                <Input
                  {...field}
                  isRequired
                  classNames={{
                    input:
                      'text-foreground text-center text-2xl tracking-widest',
                    label: 'text-default-600',
                    inputWrapper:
                      'border-divider hover:border-primary focus-within:!border-primary',
                  }}
                  color="primary"
                  errorMessage={errors.otp?.message}
                  isInvalid={!!errors.otp}
                  label="Verification Code"
                  maxLength={6}
                  placeholder="000000"
                  size="lg"
                  startContent={
                    <TbShield className="w-4 h-4 text-default-400" />
                  }
                  type="text"
                  variant="bordered"
                />
              )}
            />

            <Button
              className="w-full font-semibold text-lg h-12"
              color="primary"
              isDisabled={!isValid || !otpValue || otpValue.length !== 6}
              isLoading={verifyEmailMutation.isPending}
              size="lg"
              type="submit"
            >
              Verify Email
            </Button>

            <div className="relative">
              <Divider className="bg-divider" />
            </div>

            <div className="text-center space-y-4">
              <p className="text-sm text-default-500">
                {`Didn't receive the code? Check your spam folder or`}
              </p>
              <Button
                color="primary"
                isDisabled={countdown !== null && countdown > 0}
                isLoading={resendOtpMutation.isPending}
                size="sm"
                variant="light"
                onPress={handleResendOtp}
              >
                {countdown !== null && countdown > 0
                  ? `Resend in ${countdown}s`
                  : 'Resend Code'}
              </Button>
            </div>

            <Button
              className="w-full font-medium"
              startContent={<TbArrowLeft className="w-4 h-4" />}
              variant="light"
              onPress={onBack}
            >
              Back to Registration
            </Button>
          </form>
        </CardBody>
      </Card>
    </AuthLayout>
  );
}
