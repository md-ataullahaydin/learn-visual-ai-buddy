
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { toast } from '@/components/ui/use-toast';
import { signUpWithEmail, rememberDevice } from '@/lib/auth';
import Layout from '@/components/Layout';

// Import our components
import StepIndicator from '@/components/signup/StepIndicator';
import ProfileForm, { profileSchema } from '@/components/signup/ProfileForm';
import EducationForm, { educationSchema } from '@/components/signup/EducationForm';
import PreferencesForm, { preferencesSchema } from '@/components/signup/PreferencesForm';

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>({});

  const handleProfileSubmit = (data: z.infer<typeof profileSchema>) => {
    setUserData((prev: any) => ({ ...prev, ...data }));
    setStep(2);
  };

  const handleEducationSubmit = (data: z.infer<typeof educationSchema>) => {
    setUserData((prev: any) => ({ ...prev, ...data }));
    setStep(3);
  };

  const handlePreferencesSubmit = async (data: z.infer<typeof preferencesSchema>) => {
    setIsLoading(true);
    
    try {
      const combinedData = {
        ...userData,
        ...data,
        fullName: userData.fullName,
        approved: true // Set approved to true by default
      };
      
      // Remove confirmPassword and rememberDevice from data to be sent to Supabase
      const { confirmPassword, rememberDevice: rememberDeviceOption, ...signupData } = combinedData;
      
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
      
      // Remember device if selected
      if (userData.rememberDevice) {
        rememberDevice();
      }
      
      toast({
        title: 'Success',
        description: 'Your account has been created successfully. You can now log in.',
      });
      
      // Redirect to login page instead of awaiting approval
      navigate('/login');
      
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

  return (
    <Layout>
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl rounded-lg border bg-card p-8 shadow-xl"
        >
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
            <ProfileForm onSubmit={handleProfileSubmit} />
          )}
          
          {step === 2 && (
            <EducationForm 
              onSubmit={handleEducationSubmit}
              onBack={() => setStep(1)}
            />
          )}
          
          {step === 3 && (
            <PreferencesForm 
              onSubmit={handlePreferencesSubmit}
              onBack={() => setStep(2)}
              isLoading={isLoading}
            />
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Signup;
