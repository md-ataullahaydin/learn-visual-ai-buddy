
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Apple, CheckCircle, Eye, EyeOff, Mail, Lock, User, Smartphone, Calendar, MapPin, School, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { 
  signUpWithEmail, 
  signInWithGoogle, 
  signInWithApple,
  generateOTP, 
  sendOTPEmail, 
  storeOTP, 
  verifyOTP, 
  clearOTP, 
  rememberDevice
} from '@/lib/auth';
import { FaGoogle } from 'react-icons/fa';
import Layout from '@/components/Layout';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

// Profile data schema
const profileSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
  rememberDevice: z.boolean().default(false),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Educational data schema
const educationSchema = z.object({
  country: z.string().min(1, { message: 'Country is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  school: z.string().min(1, { message: 'School name is required' }),
  grade: z.string().min(1, { message: 'Grade/Class is required' }),
  subjects: z.array(z.string()).min(1, { message: 'Please select at least one subject' }),
});

// Learning preferences schema
const preferencesSchema = z.object({
  learningStyle: z.string().min(1, { message: 'Learning style is required' }),
  studyHoursPerWeek: z.string().min(1, { message: 'Study hours is required' }),
  goals: z.string().min(5, { message: 'Please share your learning goals' }),
  difficulties: z.string().optional(),
});

// OTP validation schema
const otpSchema = z.object({
  otp: z.string().length(6, { message: 'OTP must be 6 digits' }),
});

// Step indicator component
const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  return (
    <div className="flex justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`rounded-full w-10 h-10 flex items-center justify-center border-2 ${
            currentStep === step
              ? 'border-primary bg-primary text-primary-foreground'
              : currentStep > step
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-muted-foreground text-muted-foreground'
          }`}>
            {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
          </div>
          {step < 3 && (
            <div className={`w-10 h-0.5 ${currentStep > step ? 'bg-primary' : 'bg-muted-foreground'}`} />
          )}
        </div>
      ))}
    </div>
  );
};

const COUNTRIES = ['United States', 'Canada', 'India', 'United Kingdom', 'Australia', 'Germany', 'France', 'Japan', 'China', 'Brazil'];
const SUBJECTS = ['Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography', 'Computer Science', 'Economics', 'Psychology'];
const LEARNING_STYLES = ['Visual', 'Auditory', 'Reading/Writing', 'Kinesthetic', 'Mixed'];
const STUDY_HOURS = ['1-5 hours', '6-10 hours', '11-15 hours', '16-20 hours', '20+ hours'];
const GRADES = ['1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade', 'College/University'];

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>({});
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  // Profile form
  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      rememberDevice: false,
    },
  });

  // Education form
  const educationForm = useForm<z.infer<typeof educationSchema>>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      country: '',
      state: '',
      school: '',
      grade: '',
      subjects: [],
    },
  });

  // Preferences form
  const preferencesForm = useForm<z.infer<typeof preferencesSchema>>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      learningStyle: '',
      studyHoursPerWeek: '',
      goals: '',
      difficulties: '',
    },
  });

  // OTP form
  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const handleProfileSubmit = (data: z.infer<typeof profileSchema>) => {
    setUserData((prev: any) => ({ ...prev, ...data }));
    setStep(2);
  };

  const handleEducationSubmit = (data: z.infer<typeof educationSchema>) => {
    setUserData((prev: any) => ({ ...prev, ...data }));
    setStep(3);
  };

  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
      educationForm.setValue('subjects', selectedSubjects.filter(s => s !== subject));
    } else {
      const newSubjects = [...selectedSubjects, subject];
      setSelectedSubjects(newSubjects);
      educationForm.setValue('subjects', newSubjects);
    }
  };

  const handlePreferencesSubmit = async (data: z.infer<typeof preferencesSchema>) => {
    setIsLoading(true);
    
    try {
      const combinedData = {
        ...userData,
        ...data,
        fullName: userData.fullName,
      };
      
      // Remove confirmPassword and rememberDevice from data to be sent to Supabase
      const { confirmPassword, rememberDevice, ...signupData } = combinedData;
      
      const { success, error } = await signUpWithEmail(
        userData.email,
        userData.password,
        signupData
      );
      
      if (!success) {
        toast({
          title: 'Error',
          description: error || 'Failed to sign up',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
      
      // Send OTP for verification
      const otp = generateOTP();
      storeOTP(userData.email, otp);
      const sent = await sendOTPEmail(userData.email, otp);
      
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
    if (verifyOTP(userData.email, values.otp)) {
      clearOTP(userData.email);
      
      if (userData.rememberDevice) {
        rememberDevice();
      }
      
      toast({
        title: 'Success',
        description: 'Your account has been created and is awaiting approval',
      });
      
      // Redirect to awaiting approval page
      navigate('/awaiting-approval');
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
    storeOTP(userData.email, otp);
    const sent = await sendOTPEmail(userData.email, otp);
    
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
          className="w-full max-w-2xl rounded-lg border bg-card p-8 shadow-xl"
        >
          {!isVerifying ? (
            <>
              <div className="mb-4 text-center">
                <h1 className="text-3xl font-bold">Create your account</h1>
                <p className="text-muted-foreground mt-2">
                  {step === 1 && 'Fill in your personal information'}
                  {step === 2 && 'Tell us about your education'}
                  {step === 3 && 'Share your learning preferences'}
                </p>
              </div>
              
              <StepIndicator currentStep={step} />
              
              {step === 1 && (
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
                    <FormField
                      control={profileForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              <Input 
                                placeholder="Enter your full name" 
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
                      control={profileForm.control}
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
                      control={profileForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              <Input 
                                type={showPassword ? 'text' : 'password'} 
                                placeholder="Create a password" 
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
                      control={profileForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              <Input 
                                type={showConfirmPassword ? 'text' : 'password'} 
                                placeholder="Confirm your password" 
                                className="pl-10 pr-10" 
                                {...field} 
                              />
                              <button 
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-2.5 text-muted-foreground"
                              >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
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
                    
                    <div className="pt-2">
                      <Button type="submit" className="w-full">Continue</Button>
                    </div>
                    
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
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
                      Already have an account?{' '}
                      <Button variant="link" className="p-0" onClick={() => navigate('/login')}>
                        Sign in
                      </Button>
                    </p>
                  </form>
                </Form>
              )}
              
              {step === 2 && (
                <Form {...educationForm}>
                  <form onSubmit={educationForm.handleSubmit(handleEducationSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={educationForm.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {COUNTRIES.map((country) => (
                                  <SelectItem key={country} value={country}>
                                    {country}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={educationForm.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State/Province</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input 
                                  placeholder="Enter your state/province" 
                                  className="pl-10" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={educationForm.control}
                        name="school"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>School/Institution</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <School className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input 
                                  placeholder="Enter your school/institution" 
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
                        control={educationForm.control}
                        name="grade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Grade/Class</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your grade/class" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {GRADES.map((grade) => (
                                  <SelectItem key={grade} value={grade}>
                                    {grade}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={educationForm.control}
                      name="subjects"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subjects of Interest</FormLabel>
                          <FormMessage />
                          <div className="flex flex-wrap gap-2 pt-2">
                            {SUBJECTS.map((subject) => (
                              <Button
                                key={subject}
                                type="button"
                                variant={selectedSubjects.includes(subject) ? "default" : "outline"}
                                onClick={() => toggleSubject(subject)}
                                className="mb-2"
                              >
                                {selectedSubjects.includes(subject) && (
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                )}
                                {subject}
                              </Button>
                            ))}
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-between pt-4">
                      <Button type="button" variant="outline" onClick={() => setStep(1)}>
                        Back
                      </Button>
                      <Button type="submit">Continue</Button>
                    </div>
                  </form>
                </Form>
              )}
              
              {step === 3 && (
                <Form {...preferencesForm}>
                  <form onSubmit={preferencesForm.handleSubmit(handlePreferencesSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={preferencesForm.control}
                        name="learningStyle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Learning Style</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your learning style" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {LEARNING_STYLES.map((style) => (
                                  <SelectItem key={style} value={style}>
                                    {style}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={preferencesForm.control}
                        name="studyHoursPerWeek"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Study Hours Per Week</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your weekly study hours" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {STUDY_HOURS.map((hours) => (
                                  <SelectItem key={hours} value={hours}>
                                    {hours}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={preferencesForm.control}
                      name="goals"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Learning Goals</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="What are your main learning goals?"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={preferencesForm.control}
                      name="difficulties"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Learning Difficulties (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Any specific difficulties you face while learning?"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-between pt-4">
                      <Button type="button" variant="outline" onClick={() => setStep(2)}>
                        Back
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </>
          ) : (
            <>
              <div className="mb-6 text-center">
                <Smartphone className="mx-auto h-12 w-12 text-primary" />
                <h2 className="mt-4 text-xl font-semibold">Verify your email</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  We've sent a verification code to<br />
                  <span className="font-medium">{userData.email}</span>
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
                  
                  <Button type="submit" className="w-full">Verify & Create Account</Button>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Didn't receive the code?{' '}
                      <Button variant="link" className="p-0" onClick={resendOTP}>
                        Resend
                      </Button>
                    </p>
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

export default Signup;
