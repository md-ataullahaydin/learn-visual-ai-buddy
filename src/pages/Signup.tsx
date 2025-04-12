
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  country: z.string().min(1, "Please select your country"),
  state: z.string().optional(),
  school: z.string().optional(),
  grade: z.string().min(1, "Please select your grade/class"),
  preferredSubjects: z.array(z.string()).min(1, "Please select at least one subject"),
  learningStyle: z.enum(["visual", "auditory", "kinesthetic", "reading"]),
  rememberDevice: z.boolean().default(false),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

const countries = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "au", label: "Australia" },
  { value: "in", label: "India" },
];

const usStates = [
  { value: "al", label: "Alabama" },
  { value: "ak", label: "Alaska" },
  { value: "az", label: "Arizona" },
  { value: "ca", label: "California" },
  { value: "co", label: "Colorado" },
  { value: "ct", label: "Connecticut" },
  { value: "ny", label: "New York" },
  { value: "tx", label: "Texas" },
];

const subjects = [
  { value: "math", label: "Mathematics" },
  { value: "science", label: "Science" },
  { value: "history", label: "History" },
  { value: "english", label: "English" },
  { value: "cs", label: "Computer Science" },
  { value: "physics", label: "Physics" },
  { value: "chemistry", label: "Chemistry" },
  { value: "biology", label: "Biology" },
  { value: "geography", label: "Geography" },
];

const grades = [
  { value: "k", label: "Kindergarten" },
  { value: "1", label: "1st Grade" },
  { value: "2", label: "2nd Grade" },
  { value: "3", label: "3rd Grade" },
  { value: "4", label: "4th Grade" },
  { value: "5", label: "5th Grade" },
  { value: "6", label: "6th Grade" },
  { value: "7", label: "7th Grade" },
  { value: "8", label: "8th Grade" },
  { value: "9", label: "9th Grade" },
  { value: "10", label: "10th Grade" },
  { value: "11", label: "11th Grade" },
  { value: "12", label: "12th Grade" },
  { value: "college", label: "College/University" },
];

const SignupPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showStateField, setShowStateField] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      country: "",
      state: "",
      school: "",
      grade: "",
      preferredSubjects: [],
      learningStyle: "visual",
      rememberDevice: false,
    },
  });

  const handleCountryChange = (value: string) => {
    form.setValue("country", value);
    setShowStateField(value === "us");
    if (value !== "us") {
      form.setValue("state", "");
    }
  };

  const handleSubjectToggle = (value: string) => {
    const currentSubjects = form.getValues("preferredSubjects");
    if (currentSubjects.includes(value)) {
      form.setValue(
        "preferredSubjects",
        currentSubjects.filter((subject) => subject !== value)
      );
    } else {
      form.setValue("preferredSubjects", [...currentSubjects, value]);
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      // Validate first step fields
      const result = z.object({
        fullName: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
        confirmPassword: z.string().min(6),
      }).safeParse({
        fullName: form.getValues("fullName"),
        email: form.getValues("email"),
        password: form.getValues("password"),
        confirmPassword: form.getValues("confirmPassword"),
      });
      
      if (!result.success) {
        // Form validation failed, trigger errors
        form.trigger(["fullName", "email", "password", "confirmPassword"]);
        return;
      }
      
      // Passwords must match
      if (form.getValues("password") !== form.getValues("confirmPassword")) {
        form.setError("confirmPassword", {
          type: "manual",
          message: "Passwords do not match",
        });
        return;
      }
    }
    
    if (currentStep === 2) {
      // Validate second step fields
      const result = z.object({
        country: z.string().min(1),
        grade: z.string().min(1),
      }).safeParse({
        country: form.getValues("country"),
        grade: form.getValues("grade"),
      });
      
      if (!result.success) {
        // Form validation failed, trigger errors
        form.trigger(["country", "grade"]);
        return;
      }
      
      // If country is US, validate state
      if (form.getValues("country") === "us") {
        const stateResult = z.string().min(1).safeParse(form.getValues("state"));
        if (!stateResult.success) {
          form.setError("state", {
            type: "manual",
            message: "Please select your state",
          });
          return;
        }
      }
    }
    
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const onSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true);
    try {
      // First, register the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            country: data.country,
            state: data.state || null,
            school: data.school || null,
            grade: data.grade,
            preferred_subjects: data.preferredSubjects,
            learning_style: data.learningStyle,
          },
        },
      });

      if (authError) {
        throw authError;
      }

      // In a real implementation, this would send the OTP to the user's email
      toast({
        title: "Verification code sent",
        description: "Please check your email for the verification code",
      });
      
      // Navigate to OTP verification page
      navigate("/verify-otp", { 
        state: { 
          email: data.email,
          rememberDevice: data.rememberDevice,
          fullName: data.fullName
        } 
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-2xl font-bold mt-4">Create an account</h1>
          <p className="text-muted-foreground mt-1">
            Sign up to start your personalized learning journey
          </p>
        </div>

        <div className="mb-4">
          <div className="flex items-center">
            <div className={`h-2 flex-1 rounded-full ${currentStep >= 1 ? 'bg-primary' : 'bg-gray-200'}`}></div>
            <div className={`h-2 flex-1 rounded-full mx-1 ${currentStep >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
            <div className={`h-2 flex-1 rounded-full ${currentStep >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Account</span>
            <span>Education</span>
            <span>Preferences</span>
          </div>
        </div>

        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle>
                  {currentStep === 1 
                    ? "Create your account" 
                    : currentStep === 2 
                    ? "Educational background" 
                    : "Learning preferences"}
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 
                    ? "Enter your details to create a new account" 
                    : currentStep === 2 
                    ? "Tell us about your academic background" 
                    : "Almost done! Set your learning preferences"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your email" {...field} />
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
                            <Input 
                              type="password" 
                              placeholder="Create a password" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Confirm your password" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select 
                            onValueChange={handleCountryChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country.value} value={country.value}>
                                  {country.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {showStateField && (
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your state" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {usStates.map((state) => (
                                  <SelectItem key={state.value} value={state.value}>
                                    {state.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <FormField
                      control={form.control}
                      name="school"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your school name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
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
                                <SelectValue placeholder="Select your grade" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {grades.map((grade) => (
                                <SelectItem key={grade.value} value={grade.value}>
                                  {grade.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="preferredSubjects"
                      render={() => (
                        <FormItem>
                          <FormLabel>Preferred Subjects</FormLabel>
                          <FormMessage />
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {subjects.map((subject) => (
                              <div key={subject.value} className="flex items-center space-x-2">
                                <Checkbox 
                                  checked={form.getValues("preferredSubjects").includes(subject.value)}
                                  onCheckedChange={() => handleSubjectToggle(subject.value)}
                                />
                                <label className="text-sm">{subject.label}</label>
                              </div>
                            ))}
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="learningStyle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Learning Style</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="visual" id="visual" />
                                <label htmlFor="visual">Visual (learn by seeing)</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="auditory" id="auditory" />
                                <label htmlFor="auditory">Auditory (learn by hearing)</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="kinesthetic" id="kinesthetic" />
                                <label htmlFor="kinesthetic">Kinesthetic (learn by doing)</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="reading" id="reading" />
                                <label htmlFor="reading">Reading/Writing</label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="rememberDevice"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Remember this device (bypass verification next time)
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                {currentStep > 1 && (
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                  >
                    Back
                  </Button>
                )}
                
                {currentStep < 3 ? (
                  <Button 
                    type="button"
                    onClick={nextStep}
                    className={currentStep === 1 && "w-full"}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create account"
                    )}
                  </Button>
                )}
              </CardFooter>
            </form>
          </Form>
        </Card>
        
        <div className="text-sm text-center mt-4 text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
