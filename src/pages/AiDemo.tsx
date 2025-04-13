
import React from 'react';
import Layout from "@/components/Layout";
import DualAIResponse from '@/components/DualAIResponse';
import { motion } from 'framer-motion';

const AiDemo = () => {
  // You can replace this with your actual primary AI response function
  const getPrimaryAIResponse = async (question: string): Promise<string> => {
    // This is a placeholder - replace with your actual primary AI implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`This is a response from the primary AI to your question: "${question}"`);
      }, 1000);
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-6 text-center">AI Learning Assistant</h1>
          <p className="text-center text-muted-foreground mb-8">
            Ask a question and get responses from two different AI assistants to compare their answers.
          </p>
          
          <DualAIResponse getPrimaryAIResponse={getPrimaryAIResponse} />
        </motion.div>
      </div>
    </Layout>
  );
};

export default AiDemo;
