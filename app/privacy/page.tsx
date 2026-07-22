import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Codepet privacy policy.",
};

export default function PrivacyPage() {
  return (
    <article className="w-full max-w-2xl mx-auto px-6 py-8 self-start">
      <h1 className="text-2xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Last updated: February 2025</p>

      <p className="mb-4">
        Codepet (&ldquo;us&rdquo;, &ldquo;we&rdquo;, or &ldquo;our&rdquo;)
        operates websites, mobile applications, web applications, and other
        software products and services (collectively, the
        &ldquo;Services&rdquo;).
      </p>
      <p className="mb-4">
        This Privacy Policy explains how we collect, use, disclose, and
        safeguard your information when you use any of our Services. By
        accessing or using our Services, you agree to the practices described in
        this policy.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        Information We Collect
      </h2>
      <p className="mb-2">
        We may collect the following types of information depending on which
        Services you use:
      </p>

      <h3 className="text-lg font-semibold mt-4 mb-2">
        Personal Information
      </h3>
      <p className="mb-2">
        Information that can be used to identify you, including but not limited
        to:
      </p>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>Name</li>
        <li>Email address</li>
        <li>Profile information you provide within our Services</li>
        <li>Student numbers or institutional identifiers</li>
        <li>Payment and billing information</li>
      </ul>

      <h3 className="text-lg font-semibold mt-4 mb-2">
        Automatically Collected Information
      </h3>
      <p className="mb-2">
        When you use our Services, we may automatically collect:
      </p>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>Device information (type, operating system, browser)</li>
        <li>Usage data (features accessed, interactions, session duration)</li>
        <li>Log data (IP address, access times, pages viewed)</li>
        <li>Cookies and similar tracking technologies</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        How We Use Your Information
      </h2>
      <p className="mb-2">
        We may use the information we collect for the following purposes:
      </p>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>To provide, operate, and maintain our Services</li>
        <li>To process transactions and manage your account</li>
        <li>To improve and personalize your experience</li>
        <li>To communicate with you, including customer support</li>
        <li>To send updates, notifications, or promotional materials (with your consent where required)</li>
        <li>To monitor usage and analyze trends</li>
        <li>To detect, prevent, and address technical issues or abuse</li>
        <li>To comply with legal obligations</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        Payment Processing
      </h2>
      <p className="mb-4">
        When you make a purchase through our Services, your payment information
        is processed directly by our third-party payment provider and is not
        stored on our servers. We may retain transaction records such as purchase
        date, amount, and subscription status for account management and
        record-keeping purposes.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        Third-Party Service Providers
      </h2>
      <p className="mb-4">
        We may use third-party service providers to help us operate and improve
        our Services. These providers may have access to your information only
        to perform tasks on our behalf and are obligated not to use it for other
        purposes. These services may include, but are not limited to, hosting,
        analytics, payment processing, authentication, and crash reporting.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Data Retention</h2>
      <p className="mb-4">
        We retain your personal information only for as long as necessary to
        fulfil the purposes for which it was collected, to provide our Services,
        or as required by law. When your data is no longer needed, we will
        securely delete or anonymize it.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Data Security</h2>
      <p className="mb-4">
        We take reasonable measures to protect your personal information from
        unauthorized access, alteration, disclosure, or destruction. However, no
        method of transmission over the Internet or electronic storage is
        completely secure, and we cannot guarantee absolute security.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Your Rights</h2>
      <p className="mb-2">
        Depending on your jurisdiction, you may have the right to:
      </p>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>Access the personal information we hold about you</li>
        <li>Request correction of inaccurate information</li>
        <li>Request deletion of your personal information</li>
        <li>Withdraw consent for data processing where applicable</li>
      </ul>
      <p className="mb-4">
        To exercise any of these rights, please contact us using the
        information below.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        Disclosure of Information
      </h2>
      <p className="mb-2">
        We may disclose your information in good faith belief that such action
        is necessary to:
      </p>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>Comply with a legal obligation</li>
        <li>Protect and defend the rights or property of Codepet</li>
        <li>Prevent or investigate possible wrongdoing related to our Services</li>
        <li>Protect the personal safety of users or the public</li>
        <li>Protect against legal liability</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        Changes to This Privacy Policy
      </h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. Changes are
        effective when posted on this page. We encourage you to review this
        policy periodically.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us
        at{" "}
        <a
          href="mailto:dev.codepet@gmail.com"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          dev.codepet@gmail.com
        </a>
        .
      </p>
    </article>
  );
}
