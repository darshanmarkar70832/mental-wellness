import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl md:text-3xl font-bold">Terms and Conditions</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none text-sm md:text-base">
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="text-xl md:text-2xl mt-6">1. Acceptance of Terms</h2>
            <p>By accessing and using MindfulAI's services, you agree to be bound by these Terms and Conditions.</p>

            <h2 className="text-xl md:text-2xl mt-6">2. Service Description</h2>
            <p>MindfulAI provides AI-powered mental wellness services through:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>AI therapy conversations</li>
              <li>Mental health resources</li>
              <li>Wellness tracking tools</li>
            </ul>

            <h2 className="text-xl md:text-2xl mt-6">3. User Responsibilities</h2>
            <p>Users must:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate information</li>
              <li>Maintain account security</li>
              <li>Use services appropriately</li>
              <li>Not misuse or abuse the platform</li>
            </ul>

            <h2 className="text-xl md:text-2xl mt-6">4. Payment Terms</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All payments are processed securely through Cashfree</li>
              <li>Prices are in Indian Rupees (INR)</li>
              <li>Packages are non-refundable unless required by law</li>
            </ul>

            <h2 className="text-xl md:text-2xl mt-6">5. Limitations</h2>
            <p>Our AI therapy service:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Is not a replacement for professional medical help</li>
              <li>Should not be used in emergencies</li>
              <li>May have technical limitations</li>
            </ul>

            <h2 className="text-xl md:text-2xl mt-6">6. Privacy</h2>
            <p>We protect your privacy as outlined in our Privacy Policy. By using our services, you agree to our data practices.</p>

            <h2 className="text-xl md:text-2xl mt-6">7. Modifications</h2>
            <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.</p>

            <h2 className="text-xl md:text-2xl mt-6">8. Contact</h2>
            <p>For questions about these terms, contact us at:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email: support@ai-mental-wellness.com</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 