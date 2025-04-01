import { useRef, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, TrendingUp, Clock, MessageSquare } from "lucide-react";
import type { Payment, Conversation } from "@shared/schema";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface UsageStatsProps {
  isLoading: boolean;
  payments: Payment[];
  conversations: Conversation[];
}

export default function UsageStats({ isLoading, payments, conversations }: UsageStatsProps) {
  // Calculate total spent
  const totalSpent = payments.reduce((sum, payment) => sum + payment.amount, 0);
  
  // Calculate total minutes purchased
  const totalMinutesPurchased = payments.reduce((sum, payment) => sum + payment.minutes, 0);
  
  // Calculate total minutes used
  const totalMinutesUsed = conversations.reduce((sum, conv) => {
    return sum + (conv.durationMinutes || 0);
  }, 0);
  
  // Generate data for recent spending chart
  const getSpendingData = () => {
    // Create an object to store spending by date
    const spendingByDate: Record<string, number> = {};
    
    // Get the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();
    
    // Initialize spendingByDate with zeros
    last7Days.forEach(date => {
      spendingByDate[date] = 0;
    });
    
    // Add actual spending data
    payments.forEach(payment => {
      const date = new Date(payment.createdAt).toISOString().split('T')[0];
      if (spendingByDate[date] !== undefined) {
        spendingByDate[date] += payment.amount;
      }
    });
    
    // Convert to array for chart
    return Object.entries(spendingByDate).map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount
    }));
  };
  
  // Generate data for usage chart
  const getUsageData = () => {
    return [
      { name: "Used", value: totalMinutesUsed, color: "#6D28D9" },
      { name: "Remaining", value: totalMinutesPurchased - totalMinutesUsed, color: "#10B981" }
    ];
  };
  
  const spendingData = getSpendingData();
  const usageData = getUsageData();
  
  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (payments.length === 0 && conversations.length === 0) {
    return (
      <GlassCard className="p-6 text-center">
        <h3 className="text-xl font-bold mb-4">No Usage Data Yet</h3>
        <p className="text-muted-foreground mb-6">
          Your usage statistics will appear here once you start using MindfulAI.
        </p>
      </GlassCard>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center mb-2">
            <TrendingUp className="h-5 w-5 text-primary mr-2" />
            <h3 className="font-medium">Total Spent</h3>
          </div>
          <p className="text-3xl font-bold">₹{totalSpent}</p>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center mb-2">
            <Clock className="h-5 w-5 text-primary mr-2" />
            <h3 className="font-medium">Minutes Purchased</h3>
          </div>
          <p className="text-3xl font-bold">{totalMinutesPurchased.toFixed(1)}</p>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center mb-2">
            <MessageSquare className="h-5 w-5 text-primary mr-2" />
            <h3 className="font-medium">Conversations</h3>
          </div>
          <p className="text-3xl font-bold">{conversations.length}</p>
        </GlassCard>
      </div>
      
      {/* Charts */}
      <Tabs defaultValue="spending">
        <TabsList>
          <TabsTrigger value="spending">Spending</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="spending">
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold mb-4">Recent Spending</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e1e1e', 
                      border: '1px solid #333',
                      borderRadius: '4px'
                    }}
                  />
                  <Bar dataKey="amount" fill="#6D28D9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </TabsContent>
        
        <TabsContent value="usage">
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold mb-4">Minutes Usage</h3>
            <div className="h-72 flex flex-col md:flex-row items-center justify-between">
              <div className="w-full md:w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={usageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value.toFixed(1)} min`}
                    >
                      {usageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: '#1e1e1e', 
                        border: '1px solid #333',
                        borderRadius: '4px'
                      }}
                      formatter={(value: number) => [`${value.toFixed(1)} minutes`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="w-full md:w-1/2 mt-4 md:mt-0">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: usageData[0].color }}></div>
                      <span>Minutes Used</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ 
                          width: `${(totalMinutesUsed / (totalMinutesPurchased || 1)) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>{totalMinutesUsed.toFixed(1)} min</span>
                      <span>{((totalMinutesUsed / (totalMinutesPurchased || 1)) * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-2">
                      <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: usageData[1].color }}></div>
                      <span>Minutes Remaining</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-secondary rounded-full"
                        style={{ 
                          width: `${((totalMinutesPurchased - totalMinutesUsed) / (totalMinutesPurchased || 1)) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>{(totalMinutesPurchased - totalMinutesUsed).toFixed(1)} min</span>
                      <span>{((totalMinutesPurchased - totalMinutesUsed) / (totalMinutesPurchased || 1) * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
