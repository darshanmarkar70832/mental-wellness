import { useState, useEffect } from "react";
import { useLocation, useRoute, useRouter } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "../lib/queryClient";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PaymentCallbackPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/payment/callback");
  const { toast } = useToast();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Processing your payment...");

  // Extract query parameters
  const queryParams = new URLSearchParams(window.location.search);
  const userId = queryParams.get("userId");
  const packageId = queryParams.get("packageId");
  const orderId = queryParams.get("orderId");
  const paymentId = queryParams.get("paymentId");
  const orderStatus = queryParams.get("orderStatus");

  // Process the payment using the callback API
  const processMutation = useMutation({
    mutationFn: async () => {
      const data = {
        userId,
        packageId,
        orderId,
        paymentId,
        status: orderStatus || "SUCCESS" // Default for development, real value from Cashfree
      };
      
      const res = await apiRequest("POST", "/api/payments/callback", data);
      return await res.json();
    },
    onSuccess: () => {
      setStatus("success");
      setMessage("Payment successful! Your minutes have been added to your account.");
      queryClient.invalidateQueries({ queryKey: ["/api/user/minutes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      
      toast({
        title: "Payment Successful",
        description: "Your payment was processed successfully.",
        variant: "default",
      });
      
      // Redirect after a few seconds
      setTimeout(() => {
        setLocation("/dashboard");
      }, 3000);
    },
    onError: (error: Error) => {
      setStatus("error");
      setMessage("Payment processing failed. Please contact support if minutes were deducted from your account.");
      
      toast({
        title: "Payment Failed",
        description: error.message || "There was an issue processing your payment.",
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    // Process the payment when the component mounts
    if (userId && packageId) {
      processMutation.mutate();
    } else {
      setStatus("error");
      setMessage("Missing payment information. Please try again or contact support.");
    }
  }, [userId, packageId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Card className="w-[450px] bg-background/10 backdrop-blur-lg border-border/50">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-foreground">
            {status === "loading" && "Processing Payment"}
            {status === "success" && "Payment Successful"}
            {status === "error" && "Payment Failed"}
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Order ID: {orderId || "N/A"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          {status === "loading" && <Loader2 className="h-20 w-20 text-primary animate-spin" />}
          {status === "success" && <CheckCircle className="h-20 w-20 text-green-500" />}
          {status === "error" && <XCircle className="h-20 w-20 text-red-500" />}
          
          <p className="mt-4 text-center text-foreground">{message}</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            variant="default" 
            className="w-full"
            onClick={() => setLocation("/dashboard")}
          >
            {status === "success" ? "Go to Dashboard" : "Return to Dashboard"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}