import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Check, 
  ChevronRight, 
  BookOpen, 
  GraduationCap,
  Plus
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Subject {
  id: number;
  name: string;
}

const OnboardingPage = () => {
  const [step, setStep] = useState<number>(1);
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
  const [newSubject, setNewSubject] = useState<string>("");
  const progress = step === 1 ? 33 : step === 2 ? 66 : 100;

  const subjects = [
    { id: 1, name: "Mathematics" },
    { id: 2, name: "Science" },
    { id: 3, name: "History" },
    { id: 4, name: "English" },
    { id: 5, name: "Computer Science" },
  ];

  const toggleSubject = (subject: Subject) => {
    if (selectedSubjects.find((s) => s.id === subject.id)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s.id !== subject.id));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const addSubject = () => {
    if (newSubject.trim() !== "") {
      const newId = Math.max(...subjects.map((s) => s.id), 0) + 1;
      subjects.push({ id: newId, name: newSubject });
      setSelectedSubjects([...selectedSubjects, { id: newId, name: newSubject }]);
      setNewSubject("");
    }
  };

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
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
          <h1 className="text-2xl font-bold mt-4">
            Personalize your learning experience
          </h1>
          <p className="text-muted-foreground mt-1">
            Tell us what you want to learn!
          </p>
        </div>

        <Progress value={progress} className="mb-4" />

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1
                ? "Select Your Subjects"
                : step === 2
                ? "Choose Learning Style"
                : "Finalize Setup"}
            </CardTitle>
            <CardDescription>
              {step === 1
                ? "Pick the subjects you're interested in"
                : step === 2
                ? "Select how you prefer to learn"
                : "Confirm your preferences"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <div className="space-y-4">
                <div className="grid gap-2">
                  {subjects.map((subject) => (
                    <Button
                      key={subject.id}
                      variant={
                        selectedSubjects.find((s) => s.id === subject.id)
                          ? "default"
                          : "outline"
                      }
                      className="justify-start"
                      onClick={() => toggleSubject(subject)}
                    >
                      {subject.name}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Add a new subject"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                  />
                  <Button onClick={addSubject}><Plus className="h-4 w-4"/></Button>
                </div>
              </div>
            ) : step === 2 ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="learningStyle">Learning Style</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your learning style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visual">Visual</SelectItem>
                      <SelectItem value="auditory">Auditory</SelectItem>
                      <SelectItem value="kinesthetic">Kinesthetic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studyPace">Preferred Study Pace</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your study pace" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fast">Fast</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="slow">Slow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p>
                  <b>Selected Subjects:</b>
                </p>
                <ul>
                  {selectedSubjects.map((subject) => (
                    <li key={subject.id}>{subject.name}</li>
                  ))}
                </ul>
                <p>
                  <b>Learning Style:</b> Visual
                </p>
                <p>
                  <b>Study Pace:</b> Moderate
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {step === 1 ? (
              <Button onClick={nextStep}>
                Continue <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                {step === 3 ? (
                  <Button onClick={() => window.location.href = "/"}>
                    Finish <Check className="ml-1 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={nextStep}>
                    Continue <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingPage;
