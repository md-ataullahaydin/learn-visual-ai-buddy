
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="h-20 w-20 bg-gradient-to-br from-edu-primary to-edu-accent rounded-full mx-auto flex items-center justify-center text-white font-bold text-2xl">
            SA
          </div>
          
          <h1 className="text-5xl font-bold tracking-tight">
            Welcome to StudyAI
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your AI-powered study companion for smarter learning and better results.
            Join our platform to enhance your learning experience.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            {!user ? (
              <>
                <Link to="/login">
                  <Button variant="outline" size="lg">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="lg">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : profile?.is_approved ? (
              <Link to="/dashboard">
                <Button size="lg">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/pending-approval">
                <Button size="lg">
                  Check Approval Status
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-card rounded-lg shadow p-6 text-center">
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="currentColor" />
                <path d="M11 2H13C13.5523 2 14 2.44772 14 3V4.5C14 5.05228 13.5523 5.5 13 5.5H11C10.4477 5.5 10 5.05228 10 4.5V3C10 2.44772 10.4477 2 11 2Z" fill="currentColor" />
                <path d="M11 18.5H13C13.5523 18.5 14 18.9477 14 19.5V21C14 21.5523 13.5523 22 13 22H11C10.4477 22 10 21.5523 10 21V19.5C10 18.9477 10.4477 18.5 11 18.5Z" fill="currentColor" />
                <path d="M19.5 10H21C21.5523 10 22 10.4477 22 11V13C22 13.5523 21.5523 14 21 14H19.5C18.9477 14 18.5 13.5523 18.5 13V11C18.5 10.4477 18.9477 10 19.5 10Z" fill="currentColor" />
                <path d="M3 10H4.5C5.05228 10 5.5 10.4477 5.5 11V13C5.5 13.5523 5.05228 14 4.5 14H3C2.44772 14 2 13.5523 2 13V11C2 10.4477 2.44772 10 3 10Z" fill="currentColor" />
                <path d="M16.9497 5.93934L18.0104 7C18.4009 7.39052 18.4009 8.02369 18.0104 8.41421L16.9497 9.47487C16.5592 9.8654 15.926 9.8654 15.5355 9.47487L14.4749 8.41421C14.0844 8.02369 14.0844 7.39052 14.4749 7L15.5355 5.93934C15.926 5.54882 16.5592 5.54882 16.9497 5.93934Z" fill="currentColor" />
                <path d="M8.46447 14.4749L9.52513 15.5355C9.91565 15.926 9.91565 16.5592 9.52513 16.9497L8.46447 18.0104C8.07394 18.4009 7.44078 18.4009 7.05025 18.0104L5.98959 16.9497C5.59907 16.5592 5.59907 15.926 5.98959 15.5355L7.05025 14.4749C7.44078 14.0844 8.07394 14.0844 8.46447 14.4749Z" fill="currentColor" />
                <path d="M16.9497 14.4749L18.0104 15.5355C18.4009 15.926 18.4009 16.5592 18.0104 16.9497L16.9497 18.0104C16.5592 18.4009 15.926 18.4009 15.5355 18.0104L14.4749 16.9497C14.0844 16.5592 14.0844 15.926 14.4749 15.5355L15.5355 14.4749C15.926 14.0844 16.5592 14.0844 16.9497 14.4749Z" fill="currentColor" />
                <path d="M8.46447 5.93934L9.52513 7C9.91565 7.39052 9.91565 8.02369 9.52513 8.41421L8.46447 9.47487C8.07394 9.8654 7.44078 9.8654 7.05025 9.47487L5.98959 8.41421C5.59907 8.02369 5.59907 7.39052 5.98959 7L7.05025 5.93934C7.44078 5.54882 8.07394 5.54882 8.46447 5.93934Z" fill="currentColor" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Learning</h3>
            <p className="text-muted-foreground">
              Use advanced AI to create personalized study materials tailored to your learning style.
            </p>
          </div>
          
          <div className="bg-card rounded-lg shadow p-6 text-center">
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L4 8L12 12L20 8L12 4Z" fill="currentColor" />
                <path d="M4 12L12 16L20 12" fill="currentColor" />
                <path d="M4 16L12 20L20 16" fill="currentColor" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Structured Curriculum</h3>
            <p className="text-muted-foreground">
              Access comprehensive study materials organized by subject and difficulty level.
            </p>
          </div>
          
          <div className="bg-card rounded-lg shadow p-6 text-center">
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
            <p className="text-muted-foreground">
              Monitor your learning journey with detailed analytics and achievement tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
