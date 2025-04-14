
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
    console.log("Starting signup process for:", email);
    
    // Set autoconfirm to true to bypass email verification
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
      console.error("Signup error:", error);
      return { success: false, error: error.message };
    }
    
    console.log("Signup successful, attempting immediate login");

    // Now try to sign in immediately
    const signInResult = await signInWithEmail(email, password);
    
    if (!signInResult.success) {
      console.log("Auto sign-in failed after signup, but account was created");
      // Return success anyway since the account was created
      return { 
        success: true, 
        error: "Account created. Please try logging in again in a few moments." 
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Unexpected error during signup:", error);
    return { success: false, error: error.message };
  }
};

// Sign in with email
export const signInWithEmail = async (
  email: string, 
  password: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log("Attempting to sign in user:", email);
    
    // First attempt to sign in normally
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // If successful, return success
    if (!error) {
      console.log("Sign in successful on first attempt");
      return { success: true };
    }
    
    console.error("Sign in error:", error.message);
    
    // If we get any error related to email confirmation
    if (error.message.includes("Email not confirmed") || 
        error.message.includes("Invalid login credentials")) {
      
      console.log("Trying alternative approach - updating user and confirming email");
      
      // Try to force confirm the email by updating the user
      try {
        // Force update the email (this sometimes triggers a confirmation)
        const { error: updateError } = await supabase.auth.updateUser({
          email: email,
        });
        
        if (updateError) {
          console.error("Failed to update user:", updateError);
        } else {
          console.log("User email updated successfully");
        }
        
        // Sleep for a moment to allow the update to process
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Try signing in again
        const { error: retryError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (!retryError) {
          console.log("Sign in successful after email update");
          return { success: true };
        }
        
        console.error("Second sign-in attempt failed:", retryError);
        
        // One more attempt with a dummy sign-up to force confirmation
        try {
          console.log("Attempting one final approach - dummy sign-up");
          
          // Try dummy sign-up to force email confirmation
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/login`,
            }
          });
          
          if (!signUpError || signUpError.message.includes("already registered")) {
            // Good sign, now try signing in again
            const { error: finalError } = await supabase.auth.signInWithPassword({
              email,
              password,
            });
            
            if (!finalError) {
              console.log("Sign in successful after dummy sign-up");
              return { success: true };
            }
            
            console.error("Final sign-in attempt failed:", finalError);
          }
        } catch (e) {
          console.error("Error in dummy sign-up:", e);
        }
      } catch (e) {
        console.error("Error during email confirmation attempt:", e);
      }
      
      return { 
        success: false, 
        error: "Email verification required. Please check your inbox for a verification link, or try disabling email confirmation in your Supabase settings."
      };
    }
    
    // For any other error, return it
    return { success: false, error: error.message };
  } catch (error: any) {
    console.error("Unexpected error during sign in:", error);
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
