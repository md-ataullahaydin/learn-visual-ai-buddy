
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2 } from 'lucide-react';
import Layout from '@/components/Layout';

const AwaitingApproval = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md rounded-lg border bg-card p-8 text-center shadow-xl"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
            <Clock className="h-10 w-10 text-amber-600" />
          </div>
          
          <h1 className="mb-4 text-2xl font-bold">Account Pending Approval</h1>
          
          <p className="mb-6 text-muted-foreground">
            Thank you for registering! Your account is currently pending approval by our administrators.
            We'll notify you via email once your account has been approved.
          </p>
          
          <div className="mb-8 rounded-lg bg-muted p-4">
            <h2 className="mb-2 font-semibold">What happens next?</h2>
            <ul className="space-y-2 text-left text-sm">
              <li className="flex items-start">
                <CheckCircle2 className="mr-2 mt-0.5 h-4 w-4 text-green-500" />
                <span>Our admin team will review your information</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="mr-2 mt-0.5 h-4 w-4 text-green-500" />
                <span>You'll receive an email notification when approved</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="mr-2 mt-0.5 h-4 w-4 text-green-500" />
                <span>Once approved, you can sign in to access your personalized learning experience</span>
              </li>
            </ul>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/login')} 
            className="w-full"
          >
            Return to Login
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AwaitingApproval;
