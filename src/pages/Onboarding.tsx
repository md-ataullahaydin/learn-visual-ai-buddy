
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  Check, 
  FileText, 
  GraduationCap, 
  Lightbulb, 
  MapPin, 
  School, 
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample subjects data
const subjectsByGrade = {
  elementary: [
    { id: "ele-math", name: "Mathematics", icon: "📊" },
    { id: "ele-science", name: "Science", icon: "🔬" },
    { id: "ele-english", name: "English", icon: "📚" },
    { id: "ele-social", name: "Social Studies", icon: "🌎" },
    { id: "ele-art", name: "Art", icon: "🎨" },
    { id: "ele-music", name: "Music", icon: "🎵" },
  ],
  middle: [
    { id: "mid-math", name: "Mathematics", icon: "📊" },
    { id: "mid-science", name: "Science", icon: "🔬" },
    { id: "mid-english", name: "English", icon: "📚" },
    { id: "mid-history", name: "History", icon: "🏛️" },
    { id: "mid-geo", name: "Geography", icon: "🌎" },
    { id: "mid-arts", name: "Arts", icon: "🎨" },
    { id: "mid-pe", name: "Physical Education", icon: "🏃" },
  ],
  highschool: [
    { id: "hs-algebra", name: "Algebra", icon: "📊" },
    { id: "hs-geometry", name: "Geometry", icon: "📐" },
    { id: "hs-biology", name: "Biology", icon: "🧬" },
    { id: "hs-chemistry", name: "Chemistry", icon: "🧪" },
    { id: "hs-physics", name: "Physics", icon: "🔭" },
    { id: "hs-literature", name: "Literature", icon: "📚" },
    { id: "hs-history", name: "History", icon: "🏛️" },
    { id: "hs-econ", name: "Economics", icon: "📈" },
    { id: "hs-language", name: "Foreign Language", icon: "🗣️" },
  ],
  undergraduate: [
    { id: "ug-calc", name: "Calculus", icon: "📊" },
    { id: "ug-stats", name: "Statistics", icon: "📈" },
    { id: "ug-physics", name: "Physics", icon: "🔭" },
    { id: "ug-chem", name: "Chemistry", icon: "🧪" },
    { id: "ug-bio", name: "Biology", icon: "🧬" },
    { id: "ug-cs", name: "Computer Science", icon: "💻" },
    { id: "ug-eng", name: "Engineering", icon: "⚙️" },
    { id: "ug-psych", name: "Psychology", icon: "🧠" },
    { id: "ug-econ", name: "Economics", icon: "📈" },
    { id: "ug-lit", name: "Literature", icon: "📚" },
    { id: "ug-history", name: "History", icon: "🏛️" },
  ],
};

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    country: "",
    educationSystem: "",
    gradeLevel: "",
    interests: [],
    selectedSubjects: [] as string[],
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const totalSteps = 3;
  
  const handleSelectChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSubjectToggle = (subjectId: string) => {
    setFormData(prev => {
      const isSelected = prev.selectedSubjects.includes(subjectId);
      
      if (isSelected) {
        return {
          ...prev,
          selectedSubjects: prev.selectedSubjects.filter(id => id !== subjectId),
        };
      } else {
        return {
          ...prev,
          selectedSubjects: [...prev.selectedSubjects, subjectId],
        };
      }
    });
  };
  
  const nextStep = () => {
    if (step < totalSteps) {
      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      // Final step
      setIsLoading(true);
      // Simulate loading
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const getSubjectsForSelectedGrade = () => {
    if (!formData.gradeLevel) return [];
    
    return subjectsByGrade[formData.gradeLevel as keyof typeof subjectsByGrade] || [];
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary flex flex-col items-center justify-center py-8 px-4">
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-edu-primary to-edu-accent flex items-center justify-center text-white font-bold text-lg">
              VL
            </div>
            <span className="font-bold text-3xl">VisualLearn</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mt-4">Let's personalize your experience</h1>
          <p className="text-muted-foreground mt-1">
            Tell us about your educational journey so we can help you learn better
          </p>
        </div>
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Step {step} of {totalSteps}</span>
          </div>
          <Progress value={(step / totalSteps) * 100} className="w-2/3 h-2" />
        </div>
        
        {step === 1 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5" />
                Educational Background
              </CardTitle>
              <CardDescription>
                Tell us about your educational context so we can customize your learning experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select 
                  value={formData.country}
                  onValueChange={(value) => handleSelectChange("country", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="in">India</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  We'll use this to suggest learning materials based on your country's educational curriculum
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="educationSystem">Education System</Label>
                <Select 
                  value={formData.educationSystem}
                  onValueChange={(value) => handleSelectChange("educationSystem", value)}
                >
                  <SelectTrigger>
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
                <Label htmlFor="gradeLevel">Grade/Education Level</Label>
                <Select 
                  value={formData.gradeLevel}
                  onValueChange={(value) => handleSelectChange("gradeLevel", value)}
                >
                  <SelectTrigger>
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
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={nextStep}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}
        
        {step === 2 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Select Your Subjects
              </CardTitle>
              <CardDescription>
                Choose the subjects you want to study. We'll help you create a personalized learning path.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {getSubjectsForSelectedGrade().length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {getSubjectsForSelectedGrade().map((subject) => (
                    <div
                      key={subject.id}
                      className={`flex items-center space-x-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                        formData.selectedSubjects.includes(subject.id)
                          ? "border-primary bg-primary/5"
                          : "hover:bg-secondary"
                      }`}
                      onClick={() => handleSubjectToggle(subject.id)}
                    >
                      <div className="text-2xl">{subject.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium">{subject.name}</div>
                      </div>
                      <Checkbox
                        checked={formData.selectedSubjects.includes(subject.id)}
                        onCheckedChange={() => handleSubjectToggle(subject.id)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a grade level first</h3>
                  <p className="text-muted-foreground mb-4">
                    Please go back and select your grade level to see relevant subjects
                  </p>
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go Back
                  </Button>
                </div>
              )}
              
              {formData.gradeLevel && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Don't see a subject you need?</p>
                  <Button variant="outline" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Custom Subject
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button 
                onClick={nextStep}
                disabled={formData.selectedSubjects.length === 0}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}
        
        {step === 3 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Learning Preferences
              </CardTitle>
              <CardDescription>
                Tell us how you prefer to learn so we can tailor your experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>What types of content help you learn best?</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="visual" defaultChecked />
                    <label
                      htmlFor="visual"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Visual (diagrams, charts)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="textual" defaultChecked />
                    <label
                      htmlFor="textual"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Textual (reading, writing)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="interactive" />
                    <label
                      htmlFor="interactive"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Interactive (quizzes, games)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="audio" />
                    <label
                      htmlFor="audio"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Audio (spoken explanations)
                    </label>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Study habits</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="short-sessions" defaultChecked />
                    <label
                      htmlFor="short-sessions"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Short study sessions
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="long-sessions" />
                    <label
                      htmlFor="long-sessions"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Long, focused sessions
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="regular" defaultChecked />
                    <label
                      htmlFor="regular"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Regular, scheduled times
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="flexible" />
                    <label
                      htmlFor="flexible"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Flexible, on-demand learning
                    </label>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>How would you like to use our AI tools?</Label>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="summaries" defaultChecked />
                    <label
                      htmlFor="summaries"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Generate concise summaries of complex topics
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="visuals" defaultChecked />
                    <label
                      htmlFor="visuals"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Create visual aids to help understand concepts
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="practice" defaultChecked />
                    <label
                      htmlFor="practice"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Generate practice questions and quizzes
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="chatbot" />
                    <label
                      htmlFor="chatbot"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Interactive chatbot to answer specific questions
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={nextStep}>
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Setting up your account...
                  </>
                ) : (
                  <>
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
        
        {isLoading && (
          <div className="mt-8 text-center animate-fade-in">
            <h2 className="text-xl font-semibold mb-2">Setting up your personalized learning experience</h2>
            <div className="space-y-4 mt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full p-2 bg-primary/10">
                  <Search className="h-5 w-5 text-primary animate-pulse" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Analyzing curriculum standards</div>
                  <div className="text-sm text-muted-foreground">Finding the best resources for your educational system</div>
                </div>
                <div className="ml-auto">
                  <Check className="h-5 w-5 text-edu-success" />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="rounded-full p-2 bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary animate-pulse" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Preparing your selected subjects</div>
                  <div className="text-sm text-muted-foreground">Setting up chapters, lessons, and visual content</div>
                </div>
                <div className="ml-auto">
                  <Check className="h-5 w-5 text-edu-success" />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="rounded-full p-2 bg-primary/10">
                  <FileText className="h-5 w-5 text-primary animate-pulse" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Generating initial flashcards</div>
                  <div className="text-sm text-muted-foreground">Creating study materials for your subjects</div>
                </div>
                <div className="ml-auto">
                  <svg className="animate-spin h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
