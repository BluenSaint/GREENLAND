import { supabase } from '../lib/supabase';

export interface EducationContent {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  readTime: string;
  content: {
    introduction: string;
    sections: Array<{
      title: string;
      content: string;
    }>;
    keyTakeaways: string[];
  };
}

export const educationService = {
  async getEducationContent(): Promise<EducationContent[]> {
    // For now, return static content since we don't have education content in the database
    // In production, you would store this in a separate table
    return [
      {
        id: "credit-basics",
        title: "Understanding Credit Basics",
        category: "Credit Fundamentals",
        difficulty: "Beginner",
        readTime: "5 min",
        content: {
          introduction: "Your credit score is one of the most important financial numbers in your life. It affects your ability to get loans, credit cards, and even rent an apartment.",
          sections: [
            {
              title: "What is a Credit Score?",
              content: "A credit score is a three-digit number that represents your creditworthiness. Scores typically range from 300 to 850, with higher scores indicating better credit."
            },
            {
              title: "Credit Score Ranges",
              content: "• Excellent: 750-850\n• Good: 700-749\n• Fair: 650-699\n• Poor: 600-649\n• Bad: Below 600"
            },
            {
              title: "Who Creates Credit Scores?",
              content: "The most common credit scores are FICO scores and VantageScore. These are calculated using information from your credit reports from the three major credit bureaus: Equifax, Experian, and TransUnion."
            }
          ],
          keyTakeaways: [
            "Credit scores range from 300-850",
            "Higher scores mean better credit terms",
            "Multiple scoring models exist",
            "Scores are based on credit report data"
          ]
        }
      },
      {
        id: "credit-factors",
        title: "Factors That Affect Your Credit Score",
        category: "Credit Fundamentals",
        difficulty: "Beginner",
        readTime: "7 min",
        content: {
          introduction: "Understanding what factors influence your credit score is crucial for improving and maintaining good credit.",
          sections: [
            {
              title: "Payment History (35%)",
              content: "This is the most important factor. It includes:\n• On-time payments vs. late payments\n• How late payments were\n• How recently late payments occurred\n• Accounts in collections or charged off"
            },
            {
              title: "Credit Utilization (30%)",
              content: "This measures how much credit you're using:\n• Keep utilization below 30%\n• Lower utilization is better\n• Both individual and overall utilization matter"
            },
            {
              title: "Length of Credit History (15%)",
              content: "This includes:\n• Age of your oldest account\n• Average age of all accounts\n• How long since you've used accounts"
            }
          ],
          keyTakeaways: [
            "Payment history is most important (35%)",
            "Keep credit utilization low",
            "Maintain older accounts",
            "Don't apply for too much new credit"
          ]
        }
      }
    ];
  }
};