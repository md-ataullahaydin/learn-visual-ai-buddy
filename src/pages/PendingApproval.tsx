
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Clock, RefreshCw } from "lucide-react";

const PendingApproval = () => {
  const { profile, signOut } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);

  // Function to refresh the user's profile to check for approval
  const refreshStatus = async () => {
    setRefreshing(true);
    
    // Simulate a refresh delay
    setTimeout(() => {
      window.location.reload();
      setRefreshing(false);
    }, 1000);
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
        </div>

        <div className="bg-card rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6 flex justify-center">
            <Clock className="h-16 w-16 text-amber-500" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Account Pending Approval</h1>
          
          <p className="text-muted-foreground mb-6">
            Thank you for registering! Your account is currently pending admin approval. 
            You'll gain access to the platform once your account has been approved.
          </p>
          
          {profile && (
            <div className="bg-muted p-4 rounded-md mb-6 text-left">
              <h3 className="font-medium mb-2">Account Details</h3>
              <p><span className="font-medium">Name:</span> {profile.full_name}</p>
              <p><span className="font-medium">Email:</span> {profile.email}</p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span className="text-amber-500 font-medium">Pending Approval</span>
              </p>
            </div>
          )}
          
          <div className="flex flex-col gap-3">
            <Button 
              variant="outline"
              onClick={refreshStatus}
              disabled={refreshing}
              className="w-full"
            >
              {refreshing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Checking status...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Check approval status
                </>
              )}
            </Button>
            
            <Button variant="ghost" onClick={() => signOut()} className="w-full">
              Log out
            </Button>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            If you have any questions, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;
