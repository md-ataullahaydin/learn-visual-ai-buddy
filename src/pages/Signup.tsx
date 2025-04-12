
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Check, 
  ChevronRight, 
  Info, 
  Mail, 
  MapPin, 
  School 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SignupPage = () => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    gradeLevel: "",
    educationSystem: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-secondary p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-edu-primary to-edu-accent flex items-center justify-center text-white font-bold text-sm">
              VL
            </div>
            <span className="font-bold text-2xl">VisualLearn</span>
          </Link>
          <h1 className="text-2xl font-bold mt-4">Create your account</h1>
          <p className="text-muted-foreground mt-1">
            Join and enhance your learning experience
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {[1, 2].map((i) => (
            <div 
              key={i}
              className={`h-2 w-16 rounded-full ${
                i <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 ? "Account Information" : "Education Profile"}
            </CardTitle>
            <CardDescription>
              {step === 1 
                ? "Set up your VisualLearn account" 
                : "Tell us about your educational background"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="country">Country</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-80">
                            We use your location to suggest learning materials based on your
                            country's educational curriculum.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select 
                    onValueChange={(value) => handleSelectChange("country", value)}
                    value={formData.country}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                      <SelectItem value="in">India</SelectItem>
                      {/* Add more countries as needed */}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="educationSystem">Education System</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange("educationSystem", value)}
                    value={formData.educationSystem}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your education system" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public School</SelectItem>
                      <SelectItem value="private">Private School</SelectItem>
                      <SelectItem value="homeschool">Homeschool</SelectItem>
                      <SelectItem value="college">College/University</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gradeLevel">Grade/Year Level</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange("gradeLevel", value)}
                    value={formData.gradeLevel}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your grade level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elementary">Elementary School (K-5)</SelectItem>
                      <SelectItem value="middle">Middle School (6-8)</SelectItem>
                      <SelectItem value="highschool">High School (9-12)</SelectItem>
                      <SelectItem value="undergraduate">Undergraduate</SelectItem>
                      <SelectItem value="graduate">Graduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {step === 1 ? (
              <>
                <div className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary font-medium">
                    Log in
                  </Link>
                </div>
                <Button onClick={nextStep}>
                  Continue <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button onClick={() => window.location.href = "/onboarding"}>
                  Create Account <Check className="ml-1 h-4 w-4" />
                </Button>
              </>
            )}
          </CardFooter>
        </Card>

        <div className="mt-6 text-center space-y-4">
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Google
            </Button>
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-black">
                <path
                  d="M16.3638 9.79142C16.3523 8.16512 17.7091 7.35512 17.7732 7.31506C16.8148 5.92661 15.3048 5.73095 14.7689 5.71283C13.4218 5.57498 12.1208 6.50015 11.4343 6.50015C10.7298 6.50015 9.67641 5.72658 8.54641 5.75328C7.08321 5.77998 5.72205 6.62815 4.96205 7.95328C3.3973 10.6573 4.59123 14.6243 6.1066 16.9289C6.88263 18.0498 7.79709 19.3039 8.9766 19.2584C10.1297 19.2128 10.5647 18.5083 11.9509 18.5083C13.3371 18.5083 13.7358 19.2584 14.9343 19.2311C16.1601 19.2128 16.9544 18.1008 17.703 16.9698C18.5882 15.6719 18.9506 14.4007 18.9686 14.3369C18.932 14.3278 16.3777 13.3805 16.3638 9.79142Z"
                />
                <path
                  d="M14.6597 4.0518C15.2867 3.2855 15.7035 2.23277 15.5669 1.1665C14.6597 1.20794 13.5387 1.79154 12.8844 2.53427C12.3025 3.19337 11.7855 4.29427 11.9402 5.31884C12.9574 5.39884 14.0057 4.8158 14.6597 4.0518Z"
                />
              </svg>
              Apple
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            By signing up, you agree to our{" "}
            <Link to="/terms" className="text-primary underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
