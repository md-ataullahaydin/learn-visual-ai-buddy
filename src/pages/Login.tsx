
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Apple, CheckCircle, Eye, EyeOff, Mail, Lock, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { 
  signInWithEmail, 
  signInWithGoogle, 
  signInWithApple,
  generateOTP, 
  sendOTPEmail, 
  storeOTP, 
  verifyOTP, 
  clearOTP, 
  rememberDevice, 
  isDeviceRemembered
} from '@/lib/auth';
import { FaGoogle } from 'react-icons/fa';
import Layout from '@/components/Layout';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

// Form validation schema
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  rememberDevice: z.boolean().default(false),
});

// OTP validation schema
const otpSchema = z.object({
  otp: z.string().length(6, { message: 'OTP must be 6 digits' }),
});

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  // Set up form
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberDevice: false,
    },
  });

  // Set up OTP form
  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    
    try {
      const { success, error } = await signInWithEmail(values.email, values.password);
      
      if (!success) {
        toast({
          title: 'Error',
          description: error || 'Failed to sign in',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
      
      const remembered = isDeviceRemembered();
      setEmail(values.email);
      
      // If user chose to remember device or device is already remembered, skip OTP
      if (remembered || values.rememberDevice) {
        if (values.rememberDevice && !remembered) {
          rememberDevice();
        }
        
        toast({
          title: 'Success',
          description: 'Logged in successfully',
        });
        
        navigate('/dashboard');
      } else {
        // Send OTP for verification
        const otp = generateOTP();
        storeOTP(values.email, otp);
        const sent = await sendOTPEmail(values.email, otp);
        
        if (sent) {
          setIsVerifying(true);
          toast({
            title: 'Verification Required',
            description: 'Please verify your email with the code we just sent',
          });
        } else {
          toast({
            title: 'Error',
            description: 'Failed to send verification code',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (values: z.infer<typeof otpSchema>) => {
    if (verifyOTP(email, values.otp)) {
      clearOTP(email);
      
      if (form.getValues('rememberDevice')) {
        rememberDevice();
      }
      
      toast({
        title: 'Success',
        description: 'Verification successful',
      });
      
      navigate('/dashboard');
    } else {
      toast({
        title: 'Error',
        description: 'Invalid or expired verification code',
        variant: 'destructive',
      });
    }
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  const handleAppleSignIn = async () => {
    await signInWithApple();
  };

  const resendOTP = async () => {
    const otp = generateOTP();
    storeOTP(email, otp);
    const sent = await sendOTPEmail(email, otp);
    
    if (sent) {
      toast({
        title: 'Success',
        description: 'Verification code resent',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to resend verification code',
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout>
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md rounded-lg border bg-card p-8 shadow-xl"
        >
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
          </div>
          
          {!isVerifying ? (
            <>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <Input 
                              placeholder="Enter your email" 
                              className="pl-10" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <Input 
                              type={showPassword ? 'text' : 'password'} 
                              placeholder="Enter your password" 
                              className="pl-10 pr-10" 
                              {...field} 
                            />
                            <button 
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-2.5 text-muted-foreground"
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="rememberDevice"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="leading-none">
                          <FormLabel>Remember this device</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </Form>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={handleGoogleSignIn} className="w-full">
                  <FaGoogle className="mr-2 h-4 w-4" />
                  Google
                </Button>
                <Button variant="outline" onClick={handleAppleSignIn} className="w-full">
                  <Apple className="mr-2 h-4 w-4" />
                  Apple
                </Button>
              </div>
              
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Button variant="link" className="p-0" onClick={() => navigate('/signup')}>
                  Sign up
                </Button>
              </p>
            </>
          ) : (
            <>
              <div className="mb-6 text-center">
                <Smartphone className="mx-auto h-12 w-12 text-primary" />
                <h2 className="mt-4 text-xl font-semibold">Verify your email</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  We've sent a verification code to<br />
                  <span className="font-medium">{email}</span>
                </p>
              </div>
              
              <Form {...otpForm}>
                <form onSubmit={otpForm.handleSubmit(handleVerifyOTP)} className="space-y-6">
                  <FormField
                    control={otpForm.control}
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
                  
                  <Button type="submit" className="w-full">Verify & Sign In</Button>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Didn't receive the code?{' '}
                      <Button variant="link" className="p-0" onClick={resendOTP}>
                        Resend
                      </Button>
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <Button 
                      variant="ghost" 
                      className="text-sm" 
                      onClick={() => setIsVerifying(false)}
                    >
                      Back to login
                    </Button>
                  </div>
                </form>
              </Form>
            </>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Login;
