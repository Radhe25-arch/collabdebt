export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-12">
        <h1 className="font-display text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
        <p className="text-slate-500 font-mono text-sm max-w-xl">
          Last updated: March 30, 2026
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 lg:p-12 prose prose-slate max-w-none text-slate-600 space-y-8">
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">1. Information We Collect</h2>
          <p className="text-sm leading-relaxed mb-4">
            At SkillForge, we collect information you provide directly to us when you create an account, update your profile, participate in the interactive code editor, or communicate with us.
          </p>
          <ul className="list-disc pl-5 text-sm space-y-2">
            <li><strong>Account Data:</strong> Name, email address, password, and profile picture.</li>
            <li><strong>Learning Data:</strong> Course progress, code submissions, quiz answers, and XP earned.</li>
            <li><strong>Usage Data:</strong> How you interact with our platform, including time spent on lessons and navigation paths.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">2. How We Use Your Information</h2>
          <p className="text-sm leading-relaxed mb-4">
            We use the information we collect to provide, maintain, and improve our services. Specifically, we use it to:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-2">
            <li>Provide personalized course recommendations and AI Mentorship.</li>
            <li>Process and evaluate your code submissions securely.</li>
            <li>Maintain the global leaderboard and matchmaking for 1v1 arenas.</li>
            <li>Send you technical notices, updates, and security alerts.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">3. Data Sharing and Security</h2>
          <p className="text-sm leading-relaxed mb-4">
            We do not sell your personal data. We may share anonymized code submission data with third-party code execution environments (like Judge0) strictly for the purpose of compiling and running your code securely.
          </p>
          <p className="text-sm leading-relaxed">
            We implement industry-standard security measures to protect your account, but please remember that no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">4. Your Rights</h2>
          <p className="text-sm leading-relaxed mb-4">
            Depending on your location, you may have the right to access, correct, or delete your personal data. You can usually do this within your Account Settings or by contacting us at <a href="mailto:privacy@skillforge.io" className="text-blue-600 hover:underline">privacy@skillforge.io</a>.
          </p>
        </section>

        <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">SkillForge Global Operations Ltd.</p>
          <a href="/support" className="text-xs text-blue-600 hover:underline font-semibold">Contact Support</a>
        </div>
      </div>
    </div>
  );
}
