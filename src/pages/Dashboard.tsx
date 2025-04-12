
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, Clock, Lightbulb } from "lucide-react";

const Dashboard = () => {
  const { profile } = useAuth();

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {profile?.full_name || 'Student'}</h1>
        <p className="text-muted-foreground">
          Track your progress and continue your learning journey
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Courses Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3/12</div>
            <p className="text-muted-foreground text-sm">Courses completed</p>
            <div className="h-2 bg-muted rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-primary" style={{ width: '25%' }}></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Study Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">14</div>
            <p className="text-muted-foreground text-sm">Sessions this week</p>
            <div className="flex items-center mt-4 text-sm text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span>5 more than last week</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Study Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8h 24m</div>
            <p className="text-muted-foreground text-sm">Total time this week</p>
            <div className="flex items-center mt-4 text-sm text-green-600">
              <Clock className="h-4 w-4 mr-1" />
              <span>45 minutes today</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-4">Continue Learning</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-white opacity-75" />
            </div>
            <CardHeader>
              <CardTitle>Mathematics {i}</CardTitle>
              <CardDescription>Advanced calculus and algebra</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm font-medium">{30 + i * 10}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${30 + i * 10}%` }}
                ></div>
              </div>
              <Button className="w-full mt-4">Continue</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4 mt-8">Learning Recommendations</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="flex">
            <div className="h-auto w-24 bg-gray-200 flex items-center justify-center">
              <Lightbulb className="h-8 w-8 text-gray-500" />
            </div>
            <div className="flex-1 p-4">
              <h3 className="font-medium">Physics Fundamentals</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Based on your learning patterns
              </p>
              <Button variant="outline" size="sm">Explore</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
