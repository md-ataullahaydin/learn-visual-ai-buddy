
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  Book, 
  BookOpen,
  ChevronsUpDown,
  Circle,
  Clock, 
  FileText, 
  Image,
  Info,
  LineChart,
  Lightbulb, 
  MessageSquare, 
  Plus, 
  RefreshCw,
  Settings 
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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

// Sample subject data
const subjectsData = [
  {
    id: "1",
    name: "Mathematics",
    icon: "📊",
    description: "Algebra, Geometry, Calculus and Statistics",
    category: "STEM",
    progress: 65,
    lastStudied: "2 days ago",
    chapters: [
      {
        id: "1-1",
        name: "Algebra Basics",
        progress: 100,
        topics: [
          { id: "1-1-1", name: "Variables and Constants", completed: true },
          { id: "1-1-2", name: "Expressions and Equations", completed: true },
          { id: "1-1-3", name: "Solving Linear Equations", completed: true },
        ],
      },
      {
        id: "1-2",
        name: "Geometry Fundamentals",
        progress: 75,
        topics: [
          { id: "1-2-1", name: "Points, Lines, and Planes", completed: true },
          { id: "1-2-2", name: "Angles and Triangles", completed: true },
          { id: "1-2-3", name: "Circles and Polygons", completed: false },
          { id: "1-2-4", name: "Areas and Volumes", completed: false },
        ],
      },
      {
        id: "1-3",
        name: "Introduction to Calculus",
        progress: 50,
        topics: [
          { id: "1-3-1", name: "Limits and Continuity", completed: true },
          { id: "1-3-2", name: "Derivatives", completed: true },
          { id: "1-3-3", name: "Applications of Derivatives", completed: false },
          { id: "1-3-4", name: "Integration", completed: false },
        ],
      },
      {
        id: "1-4",
        name: "Statistics and Probability",
        progress: 25,
        topics: [
          { id: "1-4-1", name: "Data Collection and Analysis", completed: true },
          { id: "1-4-2", name: "Measures of Central Tendency", completed: false },
          { id: "1-4-3", name: "Probability Concepts", completed: false },
          { id: "1-4-4", name: "Distributions", completed: false },
        ],
      }
    ],
    flashcards: 120,
    quizzes: 15,
    visualContent: 25
  },
  {
    id: "2",
    name: "Physics",
    icon: "🔭",
    description: "Mechanics, Thermodynamics, and Electromagnetism",
    category: "STEM",
    progress: 40,
    lastStudied: "Yesterday",
    chapters: [
      {
        id: "2-1",
        name: "Mechanics",
        progress: 80,
        topics: [
          { id: "2-1-1", name: "Motion in One Dimension", completed: true },
          { id: "2-1-2", name: "Newton's Laws of Motion", completed: true },
          { id: "2-1-3", name: "Work, Energy, and Power", completed: true },
          { id: "2-1-4", name: "Circular Motion and Gravitation", completed: false },
        ],
      },
      {
        id: "2-2",
        name: "Thermodynamics",
        progress: 40,
        topics: [
          { id: "2-2-1", name: "Temperature and Heat", completed: true },
          { id: "2-2-2", name: "Laws of Thermodynamics", completed: false },
          { id: "2-2-3", name: "Heat Engines and Refrigerators", completed: false },
        ],
      },
      {
        id: "2-3",
        name: "Electromagnetism",
        progress: 0,
        topics: [
          { id: "2-3-1", name: "Electric Charges and Fields", completed: false },
          { id: "2-3-2", name: "Electric Potential and Capacitance", completed: false },
          { id: "2-3-3", name: "Magnetic Fields and Forces", completed: false },
          { id: "2-3-4", name: "Electromagnetic Induction", completed: false },
        ],
      }
    ],
    flashcards: 85,
    quizzes: 10,
    visualContent: 18
  }
];

const SubjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const subject = subjectsData.find(s => s.id === id);
  const [activeTab, setActiveTab] = useState("chapters");
  
  // If subject not found, show error message
  if (!subject) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Subject Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The subject you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/subjects">
            <Button>Go Back to Subjects</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Subject Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{subject.icon}</div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{subject.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>{subject.category}</span>
              <span>•</span>
              <span>Last studied: {subject.lastStudied}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 self-stretch md:self-auto">
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                <span>Refresh Content</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                <span>Refresh Chapter Summaries</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Image className="mr-2 h-4 w-4" />
                <span>Generate New Visuals</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Book className="mr-2 h-4 w-4" />
                <span>Update Flashcards</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button>
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Continue Learning</span>
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Completion</span>
                <span className="text-sm font-medium">{subject.progress}%</span>
              </div>
              <Progress value={subject.progress} className="h-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-4 border rounded-lg p-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Book className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{subject.flashcards}</div>
                  <div className="text-sm text-muted-foreground">Flashcards Created</div>
                </div>
              </div>
              <div className="flex items-center gap-4 border rounded-lg p-4">
                <div className="rounded-full bg-edu-warning/10 p-3">
                  <FileText className="h-5 w-5 text-edu-warning" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{subject.quizzes}</div>
                  <div className="text-sm text-muted-foreground">Quizzes Available</div>
                </div>
              </div>
              <div className="flex items-center gap-4 border rounded-lg p-4">
                <div className="rounded-full bg-edu-accent/10 p-3">
                  <Image className="h-5 w-5 text-edu-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{subject.visualContent}</div>
                  <div className="text-sm text-muted-foreground">Visual Aids</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Subject Content */}
      <Tabs defaultValue="chapters" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="chapters">Chapters</TabsTrigger>
          <TabsTrigger value="visuals">Visual Content</TabsTrigger>
          <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
        </TabsList>
        
        {/* Chapters Tab */}
        <TabsContent value="chapters" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Chapters</h2>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Chapter
            </Button>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {subject.chapters.map((chapter) => (
              <AccordionItem key={chapter.id} value={chapter.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border">
                      {chapter.progress === 100 ? (
                        <Circle className="h-2 w-2 fill-primary text-primary" />
                      ) : chapter.progress > 0 ? (
                        <Circle className="h-2 w-2 fill-none text-primary" />
                      ) : (
                        <Circle className="h-2 w-2 fill-none text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{chapter.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {chapter.progress}% complete
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-10">
                  <div className="space-y-1 py-2">
                    {chapter.topics.map((topic) => (
                      <Link 
                        to={`/subjects/${subject.id}/chapter/${chapter.id}/topic/${topic.id}`} 
                        key={topic.id}
                        className="flex items-center rounded-md px-3 py-2 text-sm hover:bg-muted"
                      >
                        <div 
                          className={`mr-2 h-4 w-4 rounded-full border ${
                            topic.completed ? "bg-primary" : "bg-background"
                          }`}
                        />
                        <span>{topic.name}</span>
                      </Link>
                    ))}
                    <div className="flex justify-center mt-4">
                      <Button className="gap-1" size="sm">
                        <MessageSquare className="h-4 w-4" />
                        Ask AI About This Chapter
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
        
        {/* Visuals Tab */}
        <TabsContent value="visuals" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Visual Content</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Generate New Visual
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Example Visual Content Cards */}
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base">Quadratic Functions Graph</CardTitle>
              </CardHeader>
              <div className="p-4 pt-0">
                <div className="aspect-square rounded-md bg-muted flex items-center justify-center">
                  <LineChart className="h-16 w-16 text-muted-foreground" />
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm text-muted-foreground">
                    Generated 3 days ago
                  </span>
                  <Button variant="ghost" size="sm">
                    <Image className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </Card>
            
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base">Geometry: Angles Concept Map</CardTitle>
              </CardHeader>
              <div className="p-4 pt-0">
                <div className="aspect-square rounded-md bg-muted flex items-center justify-center">
                  <LineChart className="h-16 w-16 text-muted-foreground" />
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm text-muted-foreground">
                    Generated 1 week ago
                  </span>
                  <Button variant="ghost" size="sm">
                    <Image className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </Card>
            
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base">Derivative Rules Chart</CardTitle>
              </CardHeader>
              <div className="p-4 pt-0">
                <div className="aspect-square rounded-md bg-muted flex items-center justify-center">
                  <LineChart className="h-16 w-16 text-muted-foreground" />
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm text-muted-foreground">
                    Generated 2 weeks ago
                  </span>
                  <Button variant="ghost" size="sm">
                    <Image className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </Card>
            
            {/* Generate Visual Card */}
            <Card className="border-dashed border-2 hover:border-primary/50">
              <CardContent className="flex flex-col items-center justify-center h-full py-8">
                <div className="rounded-full bg-primary/10 p-2 mb-2">
                  <Image className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">Generate New Visual</h3>
                <p className="text-sm text-center text-muted-foreground mb-4">
                  Create custom charts, diagrams, or illustrations
                </p>
                <Button variant="outline">Generate Visual</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Flashcards Tab */}
        <TabsContent value="flashcards" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Flashcards</h2>
            <div className="flex gap-2">
              <Button variant="outline">
                <Book className="mr-2 h-4 w-4" />
                Study Flashcards
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Flashcards
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Flashcard Sets */}
            <Card>
              <CardHeader>
                <CardTitle>Algebra Basics</CardTitle>
                <CardDescription>40 cards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mastery Level</span>
                  <span className="font-medium">85%</span>
                </div>
                <Progress value={85} className="h-2 mt-2" />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost" size="sm">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Update
                </Button>
                <Button variant="outline" size="sm">
                  Study Now
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Geometry Terms</CardTitle>
                <CardDescription>25 cards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mastery Level</span>
                  <span className="font-medium">60%</span>
                </div>
                <Progress value={60} className="h-2 mt-2" />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost" size="sm">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Update
                </Button>
                <Button variant="outline" size="sm">
                  Study Now
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Calculus Formulas</CardTitle>
                <CardDescription>35 cards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mastery Level</span>
                  <span className="font-medium">40%</span>
                </div>
                <Progress value={40} className="h-2 mt-2" />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost" size="sm">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Update
                </Button>
                <Button variant="outline" size="sm">
                  Study Now
                </Button>
              </CardFooter>
            </Card>
            
            {/* Create Flashcards Card */}
            <Card className="border-dashed border-2 hover:border-primary/50">
              <CardContent className="flex flex-col items-center justify-center h-full py-8">
                <div className="rounded-full bg-primary/10 p-2 mb-2">
                  <Book className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">Create New Flashcards</h3>
                <p className="text-sm text-center text-muted-foreground mb-4">
                  Generate or manually create flashcards
                </p>
                <Button variant="outline">Create Flashcards</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Quizzes Tab */}
        <TabsContent value="quizzes" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Quizzes & Assessments</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Quiz
            </Button>
          </div>
          
          <div className="space-y-4">
            {/* Available Quizzes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle>Algebra Basics Quiz</CardTitle>
                    <div className="flex items-center gap-1 text-xs bg-secondary text-secondary-foreground rounded-full px-2 py-1">
                      <Clock className="h-3 w-3" />
                      <span>15 mins</span>
                    </div>
                  </div>
                  <CardDescription>10 multiple choice questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Difficulty:</span>
                    <div className="flex">
                      <Circle className="h-2 w-2 fill-primary text-primary" />
                      <Circle className="h-2 w-2 fill-primary text-primary" />
                      <Circle className="h-2 w-2 fill-primary text-primary" />
                      <Circle className="h-2 w-2 fill-none text-muted-foreground" />
                      <Circle className="h-2 w-2 fill-none text-muted-foreground" />
                    </div>
                    <span className="text-muted-foreground">(Medium)</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="ghost" size="sm">
                    <Info className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                  <Button variant="secondary" size="sm">
                    Take Quiz
                  </Button>
                </CardFooter>
                <Separator />
                <div className="px-6 py-3 text-xs text-muted-foreground flex justify-between">
                  <span>Best score: 85%</span>
                  <span>Attempts: 2</span>
                </div>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle>Geometry Assessment</CardTitle>
                    <div className="flex items-center gap-1 text-xs bg-secondary text-secondary-foreground rounded-full px-2 py-1">
                      <Clock className="h-3 w-3" />
                      <span>30 mins</span>
                    </div>
                  </div>
                  <CardDescription>15 questions (mixed format)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Difficulty:</span>
                    <div className="flex">
                      <Circle className="h-2 w-2 fill-primary text-primary" />
                      <Circle className="h-2 w-2 fill-primary text-primary" />
                      <Circle className="h-2 w-2 fill-primary text-primary" />
                      <Circle className="h-2 w-2 fill-primary text-primary" />
                      <Circle className="h-2 w-2 fill-none text-muted-foreground" />
                    </div>
                    <span className="text-muted-foreground">(Hard)</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="ghost" size="sm">
                    <Info className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                  <Button variant="secondary" size="sm">
                    Take Quiz
                  </Button>
                </CardFooter>
                <Separator />
                <div className="px-6 py-3 text-xs text-muted-foreground flex justify-between">
                  <span>Best score: 70%</span>
                  <span>Attempts: 1</span>
                </div>
              </Card>
            </div>
            
            {/* Mock Tests */}
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Mock Tests</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle>Comprehensive Math Exam</CardTitle>
                      <div className="flex items-center gap-1 text-xs bg-secondary text-secondary-foreground rounded-full px-2 py-1">
                        <Clock className="h-3 w-3" />
                        <span>90 mins</span>
                      </div>
                    </div>
                    <CardDescription>Covers all major topics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-center gap-2">
                        <Circle className="h-1.5 w-1.5 fill-current" />
                        <span>35 multiple choice questions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Circle className="h-1.5 w-1.5 fill-current" />
                        <span>5 short answer questions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Circle className="h-1.5 w-1.5 fill-current" />
                        <span>2 extended response questions</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      <Lightbulb className="mr-2 h-4 w-4" />
                      Start Mock Test
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="border-dashed border-2 hover:border-primary/50">
                  <CardContent className="flex flex-col items-center justify-center h-full py-8">
                    <div className="rounded-full bg-primary/10 p-2 mb-2">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium mb-1">Generate Custom Mock Test</h3>
                    <p className="text-sm text-center text-muted-foreground mb-4">
                      Create a customized test based on your needs
                    </p>
                    <Button variant="outline">Generate Test</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubjectDetail;
