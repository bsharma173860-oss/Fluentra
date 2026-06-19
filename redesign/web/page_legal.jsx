// ──────────────────────────────────────────────────────────────
// Fluentra — Legal pages (Terms of Service + Privacy Policy)
// Real, comprehensive policies tailored to what Fluentra actually
// does: Supabase accounts, AI processing of user writing/speech/
// tutor chats via Anthropic + OpenAI, Vercel hosting, Stripe billing.
// NOT legal advice — placeholders in [BRACKETS] must be filled in,
// and a lawyer review is advised before a paid launch.
// Routes: terms -> TermsPage, privacy -> PrivacyPage.
// ──────────────────────────────────────────────────────────────

const LEGAL = {
  terms: {
    title: 'Terms of Service',
    updated: 'Last updated: 19 June 2026',
    intro: 'These Terms of Service ("Terms") govern your access to and use of Fluentra, an AI-powered language-learning and exam-preparation application (the "Service"), operated by [LEGAL ENTITY NAME] ("Fluentra", "we", "us", or "our"). By creating an account or using the Service, you agree to be bound by these Terms. If you do not agree, do not use the Service.',
    sections: [
      { h: '1. Eligibility', body: [
        'You must be at least 13 years old to use the Service. If you are under the age of majority in your jurisdiction, you may only use the Service with the involvement and consent of a parent or legal guardian who agrees to be bound by these Terms. The Service is not directed to children under 13, and we do not knowingly collect personal information from them.',
      ]},
      { h: '2. Your Account', body: [
        'To access most features you must create an account using a valid email address or a supported third-party sign-in (such as Google). You agree to provide accurate information and to keep it up to date.',
        'You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. Notify us promptly of any unauthorized use. We are not liable for losses arising from your failure to safeguard your credentials.',
      ]},
      { h: '3. The Service', body: [
        'Fluentra provides interactive lessons, practice exercises, vocabulary tools, mock exams, automated feedback, and an AI conversation tutor across multiple languages. Features, content, and supported languages may change, expand, or be discontinued at any time.',
        'Some content, exercises, and exam formats are generated or evaluated by artificial intelligence and are provided for learning and practice purposes only.',
      ]},
      { h: '4. AI Content and No Guarantee of Results', body: [
        'Lessons, corrections, scores, model answers, and tutor responses may be produced by automated systems and can contain errors, inaccuracies, or omissions. They do not constitute professional, academic, or certification advice.',
        'Fluentra is a study aid and is not affiliated with, endorsed by, or an official provider of any examination body (including but not limited to IELTS, JLPT, DELE, DELF, HSK, TOPIK, or Goethe). Practice scores and bands are estimates and do not predict or guarantee any official exam result. You are responsible for verifying important information independently.',
      ]},
      { h: '5. Subscriptions, Billing, and Refunds', body: [
        'The Service may offer free and paid plans. Paid subscriptions are billed in advance on a recurring basis (for example monthly or annually) through our third-party payment processor. By subscribing, you authorize us and our processor to charge your payment method on each renewal until you cancel.',
        'You may cancel at any time; cancellation takes effect at the end of the current billing period and you retain access until then. Except where required by law, payments are non-refundable and partial periods are not refunded. Prices may change with notice for future billing periods.',
      ]},
      { h: '6. Acceptable Use', body: [
        'You agree not to: use the Service for any unlawful purpose; attempt to gain unauthorized access to the Service or its systems; reverse engineer, scrape, or copy the Service except as permitted by law; resell or commercially exploit the Service without authorization; upload malicious code; or submit content that is illegal, infringing, abusive, or harmful. We may suspend or terminate accounts that violate these rules.',
      ]},
      { h: '7. Your Content', body: [
        'You retain ownership of the text, audio, and other content you submit (such as writing samples, spoken responses, and tutor messages). You grant us a worldwide, non-exclusive licence to host, process, and transmit that content as necessary to operate and improve the Service, including sending it to our AI processors to generate feedback and responses, as described in our Privacy Policy.',
        'You represent that you have the rights necessary to submit your content and that it does not violate any law or third-party right.',
      ]},
      { h: '8. Intellectual Property', body: [
        'The Service, including its software, design, text, graphics, and the Fluentra name and logo, is owned by us or our licensors and is protected by intellectual-property laws. Except for the limited right to use the Service under these Terms, no rights are granted to you.',
      ]},
      { h: '9. Third-Party Services', body: [
        'The Service relies on third parties for hosting, data storage, payments, and AI processing. Your use of the Service may be subject to those providers’ terms. We are not responsible for third-party services and disclaim liability for their acts or omissions.',
      ]},
      { h: '10. Disclaimers', body: [
        'The Service is provided "as is" and "as available" without warranties of any kind, whether express or implied, including warranties of merchantability, fitness for a particular purpose, accuracy, and non-infringement. We do not warrant that the Service will be uninterrupted, error-free, or secure.',
      ]},
      { h: '11. Limitation of Liability', body: [
        'To the maximum extent permitted by law, Fluentra and its operators will not be liable for any indirect, incidental, special, consequential, or punitive damages, or for any loss of data, profits, or goodwill. Our total liability for any claim relating to the Service will not exceed the greater of the amount you paid us in the twelve months before the claim or CAD $100.',
      ]},
      { h: '12. Indemnification', body: [
        'You agree to indemnify and hold harmless Fluentra and its operators from any claims, damages, liabilities, and expenses arising out of your use of the Service, your content, or your violation of these Terms.',
      ]},
      { h: '13. Termination', body: [
        'You may stop using the Service and delete your account at any time. We may suspend or terminate your access if you violate these Terms or if we discontinue the Service. Provisions that by their nature should survive termination will survive.',
      ]},
      { h: '14. Changes to These Terms', body: [
        'We may update these Terms from time to time. If we make material changes, we will provide reasonable notice, such as by posting the updated Terms with a new effective date or notifying you in the app. Your continued use after the changes take effect constitutes acceptance.',
      ]},
      { h: '15. Governing Law', body: [
        'These Terms are governed by the laws of the Province of British Columbia and the applicable laws of Canada, without regard to conflict-of-law rules. The courts located in British Columbia will have exclusive jurisdiction over disputes, subject to any mandatory consumer-protection rights in your place of residence.',
      ]},
      { h: '16. Contact', body: [
        'Questions about these Terms can be sent to [CONTACT EMAIL].',
      ]},
    ],
  },

  privacy: {
    title: 'Privacy Policy',
    updated: 'Last updated: 19 June 2026',
    intro: 'This Privacy Policy explains how [LEGAL ENTITY NAME] ("Fluentra", "we", "us") collects, uses, and shares personal information when you use the Fluentra application (the "Service"). We are committed to handling your data responsibly and in accordance with applicable laws, including Canada’s PIPEDA and, where applicable, the EU/UK GDPR and the California CCPA/CPRA.',
    sections: [
      { h: '1. Information We Collect', body: [
        'Account information: your email address, password (stored in hashed form by our authentication provider), and any name or profile details you provide. If you sign in with a third party such as Google, we receive basic profile information from that provider.',
        'Learning data: your selected languages, target exams, levels, lesson and exam results, scores, streaks, vocabulary progress, and related study activity.',
        'Content you submit: writing samples, spoken audio recordings, and messages you send to the AI tutor, along with the feedback and responses generated for you.',
        'Usage and device data: basic technical information such as app interactions, approximate region, and log data needed to operate and secure the Service.',
        'Payment data: if you subscribe, our payment processor collects your billing details directly. We do not store your full card number on our servers.',
      ]},
      { h: '2. How We Use Your Information', body: [
        'We use your information to: provide and personalize the Service; generate lessons, exercises, corrections, scores, and tutor responses; track your progress; process payments and manage subscriptions; communicate with you about your account and important changes; maintain security and prevent abuse; and comply with legal obligations.',
      ]},
      { h: '3. AI Processing and Service Providers', body: [
        'To deliver core features, we share certain content with trusted processors who act on our behalf. In particular, the text you write and your tutor messages may be sent to Anthropic (for content generation, grading, and tutoring), and your spoken audio may be sent to OpenAI (for speech-to-text transcription and text-to-speech). These providers process the data to return results to you and are contractually limited in how they may use it.',
        'Other key sub-processors include Supabase (account authentication and database storage), Vercel (application hosting), and a payment processor such as Stripe (subscription billing). We do not sell your personal information.',
      ]},
      { h: '4. Legal Bases for Processing', body: [
        'Where the GDPR applies, we process personal data on the following bases: performance of our contract with you (to provide the Service); your consent (for example, optional cookies or communications); our legitimate interests (such as securing and improving the Service); and compliance with legal obligations.',
      ]},
      { h: '5. Data Retention', body: [
        'We retain your personal information for as long as your account is active and as needed to provide the Service. When you delete your account, we delete or anonymize your personal data within a reasonable period, except where we must retain certain records to comply with legal, accounting, or security obligations.',
      ]},
      { h: '6. International Transfers', body: [
        'Some of our providers, including our AI processors, may process data on servers located outside your country, including in the United States. Where required, we rely on appropriate safeguards (such as standard contractual clauses) for these transfers.',
      ]},
      { h: '7. Security', body: [
        'We use reasonable technical and organizational measures to protect your information, including encryption in transit and access controls. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.',
      ]},
      { h: '8. Your Rights', body: [
        'Depending on where you live, you may have the right to access, correct, delete, or export your personal information; to object to or restrict certain processing; and to withdraw consent. You can manage much of your data in Settings → Data & privacy, or contact us to exercise your rights. You also have the right to lodge a complaint with your local data-protection authority.',
      ]},
      { h: '9. Cookies and Local Storage', body: [
        'We use cookies and browser local storage for essential functions such as keeping you signed in and remembering your language preferences. You can control non-essential cookies through your browser settings or any in-app consent controls we provide.',
      ]},
      { h: '10. Children’s Privacy', body: [
        'The Service is not intended for children under 13, and we do not knowingly collect their personal information. If you believe a child has provided us personal information, contact us and we will delete it.',
      ]},
      { h: '11. Changes to This Policy', body: [
        'We may update this Privacy Policy from time to time. We will post the updated version with a new effective date and, for material changes, provide additional notice where required.',
      ]},
      { h: '12. Contact Us', body: [
        'For privacy questions or to exercise your rights, contact us at [CONTACT EMAIL]. [LEGAL ENTITY NAME], [BUSINESS ADDRESS].',
      ]},
    ],
  },
};

function LegalShell({ docKey }) {
  const doc = LEGAL[docKey];
  const back = () => {
    if (window.__back) window.__back();
    else if (window.__nav) window.__nav(window.__user ? 'settings' : 'auth_login');
  };
  return (
    <div style={{ minHeight: '100%', width: '100%', background: T.bg, overflowY: 'auto', fontFamily: T.sans }}>
      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 5, background: T.bg, borderBottom: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px',
      }}>
        <button onClick={back} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 600, color: T.ink2, background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <span style={{ fontSize: 17, lineHeight: 1 }}>‹</span> Back
        </button>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: T.serif, fontSize: 18, color: T.ink }}>Fluentra</span>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 80px' }}>
        <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(28px, 6vw, 36px)', color: T.ink, margin: '0 0 8px', letterSpacing: '-0.01em' }}>
          {doc.title}
        </h1>
        <div style={{ fontSize: 13, color: T.ink4, marginBottom: 28 }}>{doc.updated}</div>

        <p style={{ fontSize: 15.5, lineHeight: 1.7, color: T.ink2, marginBottom: 8 }}>{doc.intro}</p>

        {doc.sections.map((s, i) => (
          <div key={i} style={{ marginTop: 28 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: T.ink, margin: '0 0 10px' }}>{s.h}</h2>
            {s.body.map((para, j) => (
              <p key={j} style={{ fontSize: 15, lineHeight: 1.7, color: T.ink3, margin: '0 0 10px' }}>{para}</p>
            ))}
          </div>
        ))}

        <div style={{ marginTop: 40, paddingTop: 20, borderTop: `1px solid ${T.border}`, fontSize: 13, color: T.ink4 }}>
          Fluentra · {doc.title}
        </div>
      </div>
    </div>
  );
}

function TermsPage() { return <LegalShell docKey="terms" />; }
function PrivacyPage() { return <LegalShell docKey="privacy" />; }

Object.assign(window, { TermsPage, PrivacyPage });
