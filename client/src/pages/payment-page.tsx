import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, ArrowLeft, CreditCard, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Package, Payment } from "@shared/schema";

export default function PaymentPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [paymentStep, setPaymentStep] = useState<"select" | "payment" | "success">("select");
  const [paymentData, setPaymentData] = useState<any>(null);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  
  // Fetch available packages
  const { data: packages, isLoading: loadingPackages } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
  });
  
  // Fetch user's payment history
  const { data: payments, isLoading: loadingPayments } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
  });
  
  // Initiate payment mutation
  const initiatePaymentMutation = useMutation({
    mutationFn: async (packageId: number) => {
      const res = await apiRequest("POST", "/api/payments/initiate", { packageId });
      return res.json();
    },
    onSuccess: (data) => {
      setPaymentData(data);
      setPaymentStep("payment");
    },
    onError: (error: Error) => {
      toast({
        title: "Payment initiation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Process payment mutation
  const processPaymentMutation = useMutation({
    mutationFn: async () => {
      // Redirect to Cashfree payment page
      window.location.href = paymentData.paymentLink;
    },
    onError: (error: Error) => {
      toast({
        title: "Payment initiation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleSelectPackage = (packageId: number) => {
    setSelectedPackage(packageId);
  };
  
  const handleInitiatePayment = () => {
    if (selectedPackage) {
      initiatePaymentMutation.mutate(selectedPackage);
    }
  };
  
  const handleCompletePayment = () => {
    processPaymentMutation.mutate();
  };
  
  const handleContinue = () => {
    setLocation("/dashboard");
  };
  
  if (!user) {
    return null; // Protected route will handle redirect
  }
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top navigation */}
      <header className="bg-card border-b border-border fixed top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setLocation("/dashboard")}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <Brain className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-lg md:text-xl font-bold">MindfulAI Payment</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 pt-20 md:pt-24 pb-12 max-w-4xl">
        <h2 className="text-xl md:text-2xl font-bold mb-6">
          {paymentStep === "select" && "Select a Package"}
          {paymentStep === "payment" && "Complete Payment"}
          {paymentStep === "success" && "Payment Successful"}
        </h2>
        
        {paymentStep === "select" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
              {loadingPackages ? (
                <div className="col-span-full flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                packages?.map((pkg) => (
                  <GlassCard 
                    key={pkg.id}
                    className={`p-4 md:p-6 relative ${
                      selectedPackage === pkg.id 
                        ? "border-primary" 
                        : "border-border hover:border-primary/50"
                    } transition-all duration-300 cursor-pointer`}
                    onClick={() => handleSelectPackage(pkg.id)}
                  >
                    {pkg.isPopular && (
                      <div className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-br-md rounded-tl-md">
                        POPULAR
                      </div>
                    )}
                    
                    <div className="text-center">
                      <h3 className="text-lg md:text-xl font-bold">{pkg.name}</h3>
                      
                      <div className="mt-3 md:mt-4">
                        <span className="text-2xl md:text-3xl font-bold">₹{pkg.price}</span>
                        <span className="text-sm md:text-base text-muted-foreground">/package</span>
                      </div>
                      
                      <p className="text-sm md:text-base text-muted-foreground mt-2">{pkg.minutes} minutes of AI therapy</p>
                    </div>
                    
                    {selectedPackage === pkg.id && (
                      <div className="absolute top-2 left-2">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                    )}
                  </GlassCard>
                ))
              )}
            </div>
            
            <div className="flex justify-end mt-6">
              <Button 
                onClick={handleInitiatePayment}
                disabled={!selectedPackage || initiatePaymentMutation.isPending}
                className="w-full sm:w-auto flex items-center gap-2"
              >
                {initiatePaymentMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CreditCard className="h-4 w-4" />
                )}
                Proceed to Payment
              </Button>
            </div>
          </>
        )}
        
        {paymentStep === "payment" && paymentData && (
          <GlassCard className="p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-bold mb-4">Payment Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Package</p>
                <p className="font-medium">{paymentData.packageDetails.name}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Amount</p>
                <p className="font-medium">₹{paymentData.orderAmount}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                <p className="font-medium break-all">{paymentData.orderId}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Minutes</p>
                <p className="font-medium">{paymentData.packageDetails.minutes} minutes</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">Select Payment Method</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="border-primary">
                    <CardContent className="p-4 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-primary" />
                      <span className="text-sm">Credit/Debit Card</span>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 flex items-center">
                      <i className="fas fa-university text-lg mr-2"></i>
                      <span className="text-sm">Net Banking</span>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 flex items-center">
                      <i className="fas fa-wallet text-lg mr-2"></i>
                      <span className="text-sm">UPI</span>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleCompletePayment}
                  disabled={processPaymentMutation.isPending}
                  className="w-full sm:w-auto flex items-center gap-2"
                >
                  {processPaymentMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CreditCard className="h-4 w-4" />
                  )}
                  Pay ₹{paymentData.orderAmount}
                </Button>
              </div>
            </div>
          </GlassCard>
        )}
        
        {paymentStep === "success" && (
          <GlassCard className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
            <p className="text-muted-foreground mb-6">
              Your minutes have been added to your account. You can now start using MindfulAI.
            </p>
            
            <Button onClick={handleContinue}>Continue to Dashboard</Button>
          </GlassCard>
        )}
        
        {/* Recent Payments */}
        {paymentStep === "select" && (
          <div className="mt-12">
            <h3 className="text-lg md:text-xl font-bold mb-4">Payment History</h3>
            
            {loadingPayments ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : payments && payments.length > 0 ? (
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <table className="w-full">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-left p-3 text-sm font-medium">Date</th>
                        <th className="text-left p-3 text-sm font-medium">Amount</th>
                        <th className="text-left p-3 text-sm font-medium">Minutes</th>
                        <th className="text-left p-3 text-sm font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id} className="border-b border-border">
                          <td className="p-3 text-sm">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-3 text-sm">₹{payment.amount}</td>
                          <td className="p-3 text-sm">{payment.minutes} min</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              payment.status === "SUCCESS" 
                                ? "bg-green-500/20 text-green-500" 
                                : "bg-amber-500/20 text-amber-500"
                            }`}>
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground py-8 text-center text-sm">No payment history found.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
