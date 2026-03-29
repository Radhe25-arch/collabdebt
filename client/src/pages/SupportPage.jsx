import Icons from '@/assets/icons';

export default function SupportPage() {
  const faqs = [
    {
      q: 'How do I start a course?',
      a: 'Navigate to the Catalog from the sidebar, browse the available courses, and click "Enroll Now" to begin your learning journey.'
    },
    {
      q: 'What happens if I fail a daily quiz?',
      a: 'Daily quizzes are designed to test your knowledge. You can retry the quiz if you fail to meet the 70% passing threshold. Your daily streak only increments on successful completion.'
    },
    {
      q: 'Can I challenge my friends right now?',
      a: 'The 1v1 Arena is currently in early access. You will soon be able to invite friends via a unique room link to race against them in real-time coding challenges.'
    },
    {
      q: 'How do I reset my password?',
      a: 'If you have forgotten your password, please contact support directly via email. Automated password resets are coming in a future update.'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Icons.MessageSquare size={32} />
        </div>
        <h1 className="font-display text-4xl font-bold text-slate-900 mb-4">How can we help?</h1>
        <p className="text-slate-500 font-mono text-sm max-w-xl mx-auto">
          Need help with SkillForge? Check our frequently asked questions or reach out to our team directly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Icons.Globe size={20} />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Community Discord</h3>
          <p className="text-sm text-slate-500 mb-4">Join 10,000+ developers in our community Discord to get help, share projects, and find study buddies.</p>
          <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1">
            Join Discord <Icons.ArrowRight size={14} />
          </a>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
            <Icons.Terminal size={20} />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Technical Support</h3>
          <p className="text-sm text-slate-500 mb-4">Found a bug with the code editor or having trouble with your account? Email our technical team.</p>
          <a href="mailto:support@skillforge.io" className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1">
            support@skillforge.io <Icons.ArrowRight size={14} />
          </a>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="font-display text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {faqs.map((faq, i) => (
            <div key={i} className="p-8 hover:bg-slate-50 transition-colors">
              <h3 className="font-semibold text-slate-900 mb-2 flex gap-3">
                <span className="text-blue-600">Q.</span> {faq.q}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed pl-7">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
