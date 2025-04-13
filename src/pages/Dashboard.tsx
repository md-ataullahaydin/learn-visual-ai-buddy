
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, GraduationCap, Settings, LogOut, ChevronRight, Activity, Award, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { signOut, getCurrentUser, isAdmin } from '@/lib/auth';
import { toast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';

interface UserData {
  id: string;
  email: string;
  user_metadata: {
    fullName: string;
    country: string;
    grade: string;
    subjects: string[];
    learningStyle: string;
    goals: string;
    // Add other relevant properties here
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getCurrentUser();
        if (!userData) {
          navigate('/login');
          return;
        }
        
        setUser(userData as unknown as UserData);
        
        // Check if user is admin
        const adminStatus = await isAdmin();
        setUserIsAdmin(adminStatus);
        
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch user data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold">Welcome, {user?.user_metadata?.fullName || 'Student'}</h1>
              <p className="text-muted-foreground mt-1">Here's an overview of your learning journey</p>
            </motion.div>
            
            <div className="flex mt-4 md:mt-0 space-x-2">
              {userIsAdmin && (
                <Button 
                  onClick={() => navigate('/admin')} 
                  variant="outline"
                  className="group"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Admin Panel
                </Button>
              )}
              
              <Button onClick={handleSignOut} variant="ghost">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Personalized Learning Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-full">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-t-lg">
                  <CardTitle>Personalized Learning</CardTitle>
                  <CardDescription className="text-purple-100">
                    Tailored to your learning style
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">YOUR LEARNING STYLE</h3>
                      <p className="font-semibold">{user?.user_metadata?.learningStyle || 'Not specified'}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">YOUR GOALS</h3>
                      <p>{user?.user_metadata?.goals || 'No goals specified'}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full group" onClick={() => navigate('/learning-path')}>
                    View Learning Path
                    <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            
            {/* Subjects Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-primary" />
                    Your Subjects
                  </CardTitle>
                  <CardDescription>
                    Subjects you're currently studying
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user?.user_metadata?.subjects ? (
                      user.user_metadata.subjects.map((subject: string) => (
                        <div 
                          key={subject} 
                          className="rounded-full bg-secondary px-3 py-1 text-sm font-medium"
                        >
                          {subject}
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No subjects selected</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/subjects')}>
                    Explore All Subjects
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            
            {/* Progress Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-primary" />
                    Your Progress
                  </CardTitle>
                  <CardDescription>
                    Track your learning journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Mathematics</span>
                      <span className="font-medium">60%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[60%] rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Science</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[45%] rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>English</span>
                      <span className="font-medium">75%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[75%] rounded-full"></div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/progress')}>
                    View Detailed Progress
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            
            {/* Upcoming Schedule Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    Upcoming Schedule
                  </CardTitle>
                  <CardDescription>
                    Your learning sessions for the week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded mr-3">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Mathematics</h3>
                        <p className="text-sm text-muted-foreground">Today, 4:00 PM</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded mr-3">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Science Quiz</h3>
                        <p className="text-sm text-muted-foreground">Tomorrow, 2:30 PM</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded mr-3">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">English Essay</h3>
                        <p className="text-sm text-muted-foreground">Friday, 1:00 PM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/schedule')}>
                    View Full Schedule
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            
            {/* Achievements Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-primary" />
                    Achievements
                  </CardTitle>
                  <CardDescription>
                    Badges and milestones earned
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-muted rounded-lg p-3 flex flex-col items-center">
                      <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center mb-2">
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-xs">Quick Learner</span>
                    </div>
                    
                    <div className="bg-muted rounded-lg p-3 flex flex-col items-center">
                      <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center mb-2">
                        <GraduationCap className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-xs">Top Student</span>
                    </div>
                    
                    <div className="bg-muted rounded-lg p-3 flex flex-col items-center">
                      <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center mb-2">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-xs">Bookworm</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/achievements')}>
                    View All Achievements
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    Your Profile
                  </CardTitle>
                  <CardDescription>
                    Personal and educational information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Country</span>
                    <span className="font-medium">{user?.user_metadata?.country || 'Not specified'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Grade/Class</span>
                    <span className="font-medium">{user?.user_metadata?.grade || 'Not specified'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">{user?.email}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/profile')}>
                    Edit Profile
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
