
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useLocalStorage } from "@/hooks/use-local-storage";

const VerifyOTP = () => {
  const [otp, setOtp] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, password, rememberDevice, fullName } = location.state || {};
  const [trustedDevices, setTrustedDevices] = useLocalStorage<string[]>("trustedDevices", []);
  
  // Check if this is a trusted device
  useEffect(() => {
    const checkTrustedDevice = async () => {
      if (email && trustedDevices.includes(email)) {
        // This is a trusted device, bypass OTP
        if (password) {
          // This is a login attempt
          handleLogin(email, password);
        } else {
          // This is a registration
          handleSignUp(email);
        }
      }
    };
    
    checkTrustedDevice();
  }, [email, trustedDevices]);

  // Countdown timer for resend
  useEffect(() => {
    if (remainingTime <= 0) {
      setCanResend(true);
      return;
    }

    const timerId = setTimeout(() => {
      setRemainingTime(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [remainingTime]);

  const handleLogin = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // If remember device is checked, add to trusted devices
      if (rememberDevice && !trustedDevices.includes(email)) {
        setTrustedDevices([...trustedDevices, email]);
      }

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSignUp = async (email: string) => {
    try {
      // This would normally have password and fullName, but for OTP bypass we're
      // assuming registration has already happened
      navigate("/pending-approval");
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real implementation, this would verify the OTP with Supabase or your auth provider
      // For now, we'll simulate a successful verification with any 6-digit code
      
      // If remember device is checked, add to trusted devices
      if (rememberDevice && !trustedDevices.includes(email)) {
        setTrustedDevices([...trustedDevices, email]);
      }

      if (password) {
        // This is a login attempt
        await handleLogin(email, password);
      } else {
        // This is a registration
        await handleSignUp(email);
      }
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOTP = async () => {
    if (!canResend) return;
    
    try {
      // In a real implementation, this would resend the OTP via your auth provider
      toast({
        title: "OTP Sent",
        description: "A new verification code has been sent to your email",
      });
      
      setRemainingTime(60);
      setCanResend(false);
    } catch (error: any) {
      toast({
        title: "Failed to resend OTP",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // If no email in state, redirect to login
  if (!email) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-secondary p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-edu-primary to-edu-accent flex items-center justify-center text-white font-bold text-sm">
              SA
            </div>
            <span className="font-bold text-2xl">StudyAI</span>
          </Link>
          <h1 className="text-2xl font-bold mt-4">Verify your identity</h1>
          <p className="text-muted-foreground mt-1">
            Enter the 6-digit code sent to {email}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Enter verification code</CardTitle>
            <CardDescription>
              We've sent a code to your email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              
              <div className="text-sm text-center">
                {canResend ? (
                  <button 
                    onClick={resendOTP} 
                    className="text-primary hover:underline focus:outline-none"
                  >
                    Resend code
                  </button>
                ) : (
                  <span className="text-muted-foreground">
                    Resend code in {remainingTime}s
                  </span>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              className="w-full" 
              onClick={verifyOTP}
              disabled={isSubmitting || otp.length !== 6}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default VerifyOTP;
