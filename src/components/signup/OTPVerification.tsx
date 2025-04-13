
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

export const otpSchema = z.object({
  otp: z.string().length(6, { message: 'OTP must be 6 digits' }),
});

interface OTPVerificationProps {
  email: string;
  onVerify: (values: z.infer<typeof otpSchema>) => void;
  onResendOTP: () => void;
}

const OTPVerification = ({ email, onVerify, onResendOTP }: OTPVerificationProps) => {
  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  return (
    <>
      <div className="mb-6 text-center">
        <Smartphone className="mx-auto h-12 w-12 text-primary" />
        <h2 className="mt-4 text-xl font-semibold">Verify your email</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We've sent a verification code to<br />
          <span className="font-medium">{email}</span>
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onVerify)} className="space-y-6">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem className="mx-auto max-w-[250px]">
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full">Verify & Create Account</Button>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?{' '}
              <Button variant="link" className="p-0" onClick={onResendOTP}>
                Resend
              </Button>
            </p>
          </div>
        </form>
      </Form>
    </>
  );
};

export default OTPVerification;
