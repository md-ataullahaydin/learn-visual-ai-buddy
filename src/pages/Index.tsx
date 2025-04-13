
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, Users, CheckCircle, LucideShieldCheck } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900" />
          
          <div className="container mx-auto px-4 py-20 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                  Personalized Learning for <span className="text-primary">Every Student</span>
                </h1>
                
                <p className="text-xl text-muted-foreground mb-8 max-w-lg">
                  An AI-powered learning platform tailored to your unique educational needs and goals.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/signup')}
                    className="group"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="relative rounded-lg overflow-hidden shadow-2xl border border-border">
                  <div className="aspect-[4/3] bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                    <div className="max-w-[80%] bg-white/90 dark:bg-gray-900/90 rounded-xl p-8 shadow-lg">
                      <h2 className="text-2xl font-bold mb-4">Your Learning Journey</h2>
                      <ul className="space-y-3">
                        {[
                          "Personalized learning path",
                          "Adaptive difficulty levels",
                          "Interactive lessons",
                          "AI-powered recommendations",
                          "Track your progress",
                        ].map((item, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="flex items-center"
                          >
                            <CheckCircle className="text-green-500 mr-2 h-5 w-5 flex-shrink-0" />
                            <span>{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-6 -right-6 bg-yellow-400 rounded-full p-4 shadow-lg">
                  <BookOpen className="h-8 w-8 text-yellow-800" />
                </div>
                
                <div className="absolute -bottom-6 -left-6 bg-green-400 rounded-full p-4 shadow-lg">
                  <Users className="h-8 w-8 text-green-800" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our Platform?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our platform offers everything you need to succeed in your educational journey.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "AI-Powered Personalization",
                  description: "Learning paths tailored to your unique needs, learning style, and goals.",
                  icon: <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg"><BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-300" /></div>,
                },
                {
                  title: "Secure Access",
                  description: "Enhanced security with OTP verification and remember device feature.",
                  icon: <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg"><LucideShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-300" /></div>,
                },
                {
                  title: "Comprehensive Learning",
                  description: "Access to subjects across multiple disciplines with structured content.",
                  icon: <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg"><BookOpen className="h-6 w-6 text-green-600 dark:text-green-300" /></div>,
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card p-6 rounded-lg shadow-md border"
                >
                  {feature.icon}
                  <h3 className="text-xl font-semibold mt-4 mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary/10 to-primary/20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Learning Experience?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of students who are already benefiting from our personalized learning platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/signup')}
                >
                  Create an Account
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Supabase Configuration Section - Show only when not configured */}
        {(!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) && (
          <section className="py-16 bg-amber-50 dark:bg-amber-950">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl font-bold text-amber-800 dark:text-amber-300 mb-4">
                  Missing Supabase Configuration
                </h2>
                <p className="text-amber-700 dark:text-amber-400 mb-6">
                  To use all features of this application, you need to set up your Supabase environment variables:
                </p>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md text-left">
                  <ol className="list-decimal list-inside text-amber-700 dark:text-amber-400 space-y-2">
                    <li>Create a Supabase project at <a href="https://supabase.com" className="underline" target="_blank" rel="noopener">supabase.com</a></li>
                    <li>Get your project URL and anon key from the API settings</li>
                    <li>Set the following environment variables:
                      <ul className="list-disc list-inside ml-6 mt-1">
                        <li>VITE_SUPABASE_URL</li>
                        <li>VITE_SUPABASE_ANON_KEY</li>
                      </ul>
                    </li>
                  </ol>
                </div>
                <div className="mt-6">
                  <Button 
                    onClick={() => window.open("https://docs.lovable.dev/integrations/supabase/", "_blank")}
                  >
                    View Supabase Integration Docs
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default Index;
