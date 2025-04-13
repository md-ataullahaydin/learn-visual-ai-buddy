
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

const Index = () => {
  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="text-center max-w-2xl mx-auto p-6">
          <h1 className="text-4xl font-bold mb-4">Welcome to Your App</h1>
          <p className="text-xl text-muted-foreground mb-6">
            This application requires Supabase configuration to work properly.
          </p>
          
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-md mb-8">
            <h2 className="text-lg font-semibold text-amber-800 mb-2">
              Missing Supabase Configuration
            </h2>
            <p className="text-amber-700 mb-3">
              To get started, you need to set up your Supabase environment variables:
            </p>
            <ol className="list-decimal list-inside text-amber-700 space-y-2">
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
          
          <Button 
            size="lg"
            onClick={() => window.open("https://docs.lovable.dev/integrations/supabase/", "_blank")}
          >
            View Supabase Integration Docs
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
