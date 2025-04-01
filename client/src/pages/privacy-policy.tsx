import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl md:text-3xl font-bold">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none text-sm md:text-base">
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2>1. Information We Collect</h2>
            <p>We collect information that you provide directly to us, including:</p>
            <ul>
              <li>Name and contact information</li>
              <li>Account credentials</li>
              <li>Payment information (processed securely through Cashfree)</li>
              <li>Communication history with our AI therapy service</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and maintain our mental wellness services</li>
              <li>Process your payments</li>
              <li>Send you important service updates</li>
              <li>Improve our AI therapy services</li>
              <li>Protect against fraudulent or illegal activity</li>
            </ul>

            <h2>3. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information, including:</p>
            <ul>
              <li>Encryption of sensitive data</li>
              <li>Secure payment processing through Cashfree</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
            </ul>

            <h2>4. Data Sharing</h2>
            <p>We do not sell your personal information. We may share your information only:</p>
            <ul>
              <li>With payment processors to complete transactions</li>
              <li>When required by law</li>
              <li>To protect our rights or prevent fraud</li>
            </ul>

            <h2>5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>

            <h2>6. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <ul>
              <li>Email: support@ai-mental-wellness.com</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 