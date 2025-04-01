import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl md:text-3xl font-bold">Refund Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none text-sm md:text-base">
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="text-xl md:text-2xl mt-6">1. Overview</h2>
            <p>This refund policy outlines the terms and conditions for refunds on MindfulAI's services.</p>

            <h2 className="text-xl md:text-2xl mt-6">2. Refund Eligibility</h2>
            <p>Refunds may be issued in the following cases:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Technical issues preventing service access</li>
              <li>Duplicate charges</li>
              <li>Service unavailability</li>
              <li>Legal requirements</li>
            </ul>

            <h2 className="text-xl md:text-2xl mt-6">3. Non-Refundable Items</h2>
            <p>The following are generally non-refundable:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Used minutes or completed sessions</li>
              <li>Partially used packages</li>
              <li>Expired minutes</li>
            </ul>

            <h2 className="text-xl md:text-2xl mt-6">4. Refund Process</h2>
            <p>To request a refund:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Contact our support team</li>
              <li>Provide order details and reason</li>
              <li>Allow 5-7 business days for processing</li>
            </ul>

            <h2 className="text-xl md:text-2xl mt-6">5. Payment Method</h2>
            <p>Refunds will be processed to the original payment method used for the purchase.</p>

            <h2 className="text-xl md:text-2xl mt-6">6. Contact Us</h2>
            <p>For refund requests or questions, please contact us at:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email: support@ai-mental-wellness.com</li>
              <li>Response time: Within 24-48 hours</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 