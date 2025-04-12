
import React from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Book, 
  CheckCircle, 
  ChevronRight, 
  LineChart, 
  Lightbulb, 
  MessageSquare,
  PlayCircle, 
  PlusCircle,
  TrendingUp
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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Sample data for charts
const studyActivityData = [
  { day: "Mon", hours: 1.5 },
  { day: "Tue", hours: 2.8 },
  { day: "Wed", hours: 1.2 },
  { day: "Thu", hours: 3.0 },
  { day: "Fri", hours: 2.2 },
  { day: "Sat", hours: 0.8 },
  { day: "Sun", hours: 0.5 },
];

// Sample subjects data
const subjects = [
  {
    id: 1,
    name: "Mathematics",
    icon: "📊",
    progress: 65,
    chapters: 12,
    completedChapters: 8,
  },
  {
    id: 2,
    name: "Physics",
    icon: "🔭",
    progress: 40,
    chapters: 14,
    completedChapters: 6,
  },
  {
    id: 3,
    name: "Biology",
    icon: "🧬",
    progress: 75,
    chapters: 10,
    completedChapters: 7,
  },
];

// Sample recent activity data
const recentActivities = [
  {
    id: 1,
    type: "quiz",
    title: "Completed Algebra Quiz",
    subject: "Mathematics",
    time: "2 hours ago",
    score: "85%",
  },
  {
    id: 2,
    type: "flashcard",
    title: "Created 10 new Flashcards",
    subject: "Biology",
    time: "Yesterday",
  },
  {
    id: 3,
    type: "content",
    title: "Generated Circulatory System Diagram",
    subject: "Biology",
    time: "2 days ago",
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your learning overview.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Subject
          </Button>
          <Button className="flex items-center gap-2">
            <PlayCircle className="h-4 w-4" />
            Resume Learning
          </Button>
        </div>
      </div>

      {/* Study Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Weekly Study Activity</CardTitle>
              <CardDescription>
                Your study time distribution over the past week
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1">
              <span className="hidden sm:inline">View Details</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={studyActivityData}
                  margin={{
                    top: 20,
                    right: 15,
                    left: -10,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 12 }} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }} 
                    tickLine={false}
                    axisLine={false}
                    label={{ 
                      value: 'Hours', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fontSize: 12 }
                    }}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="hours"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Learning Streaks</CardTitle>
            <CardDescription>
              You're on a 7-day learning streak!
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center justify-center">
              <div className="relative h-40 w-40">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold">7</div>
                    <div className="text-sm text-muted-foreground">days</div>
                  </div>
                </div>
                <svg
                  className="h-full w-full -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    className="stroke-muted fill-none"
                    cx="50"
                    cy="50"
                    r="40"
                    strokeWidth="10"
                  />
                  <circle
                    className="stroke-primary fill-none"
                    cx="50"
                    cy="50"
                    r="40"
                    strokeWidth="10"
                    strokeDasharray="251.2"
                    strokeDashoffset="50.24" // 20% of 251.2
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 mt-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-full rounded-sm bg-edu-primary flex items-center justify-center text-white text-xs font-medium"
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View streak history
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* My Subjects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">My Subjects</h2>
          <Link to="/subjects">
            <Button variant="ghost" size="sm" className="gap-1">
              View all 
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <Card key={subject.id} className="education-card">
              <Link to={`/subjects/${subject.id}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">{subject.icon}</div>
                      <CardTitle>{subject.name}</CardTitle>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{subject.progress}%</span>
                    </div>
                    <Progress value={subject.progress} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-2">
                      {subject.completedChapters} of {subject.chapters} chapters completed
                    </p>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
          <Card className="education-card bg-secondary border-dashed border-2 hover:border-primary/50">
            <CardContent className="flex flex-col items-center justify-center h-full py-8">
              <div className="rounded-full bg-primary/10 p-2 mb-2">
                <PlusCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">Add New Subject</h3>
              <p className="text-sm text-center text-muted-foreground mb-4">
                Customize your learning experience
              </p>
              <Button variant="outline">Add Subject</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest learning activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {recentActivities.map((activity) => (
                <div 
                  key={activity.id}
                  className="flex items-start space-x-3 border-b pb-4 last:border-0"
                >
                  <div className={`
                    rounded-full p-2 mt-0.5
                    ${activity.type === 'quiz' 
                      ? 'bg-edu-primary/10 text-edu-primary' 
                      : activity.type === 'flashcard' 
                        ? 'bg-edu-warning/10 text-edu-warning' 
                        : 'bg-edu-accent/10 text-edu-accent'}`
                  }>
                    {activity.type === 'quiz' 
                      ? <CheckCircle className="h-4 w-4" /> 
                      : activity.type === 'flashcard' 
                        ? <Book className="h-4 w-4" /> 
                        : <Lightbulb className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium leading-none">{activity.title}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{activity.subject}</span>
                        <span>•</span>
                        <span>{activity.time}</span>
                      </div>
                      {activity.score && (
                        <span className="text-sm font-medium text-edu-success">{activity.score}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View all activity
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Frequently used tools and features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="secondary" className="w-full justify-start text-left">
              <MessageSquare className="mr-2 h-4 w-4" />
              Ask AI Assistant
            </Button>
            <Button variant="secondary" className="w-full justify-start text-left">
              <Book className="mr-2 h-4 w-4" />
              Create Flashcards
            </Button>
            <Button variant="secondary" className="w-full justify-start text-left">
              <LineChart className="mr-2 h-4 w-4" />
              Generate Visual Content
            </Button>
            <Button variant="secondary" className="w-full justify-start text-left">
              <TrendingUp className="mr-2 h-4 w-4" />
              Track Progress
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="bg-secondary rounded-lg p-4 w-full mb-2">
              <div className="flex items-start space-x-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Lightbulb className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium leading-none">Learning Tip</p>
                  <p className="text-sm text-muted-foreground">
                    Try spacing out your study sessions for better retention.
                  </p>
                </div>
              </div>
            </div>
            <Button variant="link" className="w-full" size="sm">
              Show another tip
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
