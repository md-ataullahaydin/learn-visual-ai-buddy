
import { supabase } from './supabase';
import { toast } from '@/components/ui/use-toast';

// Check if device should be remembered
export const isDeviceRemembered = (): boolean => {
  return localStorage.getItem('remembered_device') === 'true';
};

// Set device as remembered
export const rememberDevice = (): void => {
  localStorage.setItem('remembered_device', 'true');
};

// Generate a 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via email (using Supabase Edge Functions)
export const sendOTPEmail = async (email: string, otp: string): Promise<boolean> => {
  try {
    const { error } = await supabase.functions.invoke('send-otp-email', {
      body: { email, otp },
    });

    if (error) {
      console.error('Error sending OTP:', error);
      toast({
        title: 'Error',
        description: 'Failed to send verification code.',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending OTP:', error);
    toast({
      title: 'Error',
      description: 'Failed to send verification code.',
      variant: 'destructive',
    });
    return false;
  }
};

// Store OTP in session storage (temporary)
export const storeOTP = (email: string, otp: string): void => {
  // This is just for demo purposes. In production, this should be handled server-side
  sessionStorage.setItem(`otp_${email}`, otp);
  // Set expiry (5 minutes)
  sessionStorage.setItem(`otp_${email}_expiry`, (Date.now() + 5 * 60 * 1000).toString());
};

// Verify OTP
export const verifyOTP = (email: string, inputOTP: string): boolean => {
  const storedOTP = sessionStorage.getItem(`otp_${email}`);
  const expiryTime = sessionStorage.getItem(`otp_${email}_expiry`);
  
  if (!storedOTP || !expiryTime) {
    return false;
  }

  // Check if OTP has expired
  if (Date.now() > parseInt(expiryTime)) {
    // Clear expired OTP
    sessionStorage.removeItem(`otp_${email}`);
    sessionStorage.removeItem(`otp_${email}_expiry`);
    return false;
  }

  return storedOTP === inputOTP;
};

// Clear OTP after successful verification
export const clearOTP = (email: string): void => {
  sessionStorage.removeItem(`otp_${email}`);
  sessionStorage.removeItem(`otp_${email}_expiry`);
};

// Sign up with email
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  userData: Record<string, any>
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          ...userData,
          approved: true, // Always set approved to true
        },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Now try to sign in immediately (bypassing the email confirmation step)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.log("Auto sign-in failed after signup:", signInError);
      // Continue with success since the account was created
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Sign in with email
export const signInWithEmail = async (
  email: string, 
  password: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // First attempt to sign in normally
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // If successful, return success
    if (!error) {
      return { success: true };
    }
    
    // If we get "Email not confirmed" error, try to update the user
    if (error.message.includes("Email not confirmed")) {
      console.log("Email not confirmed, attempting to update user");
      
      // Try to update the user email (this triggers a new confirmation email)
      const { error: updateError } = await supabase.auth.updateUser({
        email: email,
      });
      
      if (updateError) {
        console.error("Failed to update user:", updateError);
        return { success: false, error: "Email not confirmed. Please check your inbox for a verification email." };
      }
      
      // Try to force confirm email by using admin APIs (this will fail for regular users)
      // This is just an attempt, most likely will be skipped
      try {
        await supabase.auth.admin.updateUserById(data?.user?.id || '', {
          email_confirm: true
        });
      } catch (adminError) {
        // Ignore errors here, it's expected to fail for non-admin users
        console.log("Admin API failed as expected:", adminError);
      }
      
      // Try signing in again
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInError) {
        console.error("Second sign-in attempt failed:", signInError);
        return { 
          success: false, 
          error: "Account created but not confirmed. Please check your email for a verification link or try again later." 
        };
      }
      
      return { success: true };
    }
    
    // For any other error, return it
    return { success: false, error: error.message };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<void> => {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
};

// Sign in with Apple
export const signInWithApple = async (): Promise<void> => {
  await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
};

// Sign out
export const signOut = async (): Promise<void> => {
  await supabase.auth.signOut();
};

// Get current user
export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};

// Check if user is admin
export const isAdmin = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user?.email === 'md.ataullahaydin@gmail.com';
};
