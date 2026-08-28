// Lightweight, dependency-free i18n dictionary. No next-intl/react-i18next —
// just a flat key -> string map per locale, looked up through t() (see
// language-context.tsx). Deliberately scoped: this translates UI chrome
// (navigation, headings, buttons, help text, disclaimers) into Hindi, not
// the underlying data. Two things are intentionally left in English
// everywhere, including in Hindi mode:
//
//  1. Scheme data itself (name/ministry/summary/benefit/documents/steps —
//     data/schemes.ts). Machine-translating official scheme names and
//     government terminology risks distorting meaning; a real translation
//     would need to be sourced from each scheme's own official Hindi
//     materials, which is out of scope for this pass.
//  2. Assessment dropdown OPTION values (state names, category codes like
//     "OBC"/"SC"/"ST", sector names, business type, etc. — the *_OPTIONS
//     arrays in lib/matching/types.ts) and the matching engine's generated
//     criterion labels (lib/matching/engine.ts, frozen — no logic changes
//     this pass). These are shared, matched-against values; translating
//     only their on-screen label without touching the engine that
//     generates "Your sector (Technology) is supported"-style explanations
//     would leave the UI half-English anyway, so field LABELS are
//     translated but the option values themselves are not.
//
// Every other string a user reads — field labels, buttons, step titles,
// disclaimers, empty states — is fully translated.

export type Locale = 'en' | 'hi'

export const LOCALES: { code: Locale; label: string; nativeLabel: string; shortLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', shortLabel: 'EN' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', shortLabel: 'हि' },
]

export const DEFAULT_LOCALE: Locale = 'en'

type Dictionary = Record<string, string>

const en: Dictionary = {
  // Header / nav
  'nav.home': 'Home',
  'nav.assessment': 'Assessment',
  'nav.schemes': 'Schemes',
  'nav.recommendations': 'Recommendations',
  'nav.saved': 'Saved schemes',
  'nav.brandTagline': 'AI Scheme Matching',
  'nav.themeToggle': 'Toggle theme',
  'nav.languageToggle': 'Change language',
  'nav.savedSchemesLink': 'Saved schemes',
  'nav.unsavedGuard': 'You have unsaved assessment answers. Leave this page and lose your progress?',

  // Landing page
  'landing.eyebrow': 'SIH26092 · Prototype',
  'landing.heroTitle': "Find the government schemes you're actually eligible for",
  'landing.heroSubtitle':
    'Built for women, SC/ST, OBC, rural, low-income, and first-time entrepreneurs. Answer a short profile, and get ranked, explainable scheme recommendations backed by a transparent rule-based matching engine — not a chatbot guessing on your behalf.',
  'landing.ctaStart': 'Start assessment',
  'landing.ctaDemo': 'See a live demo profile',
  'landing.schemeCount': '{count} verified government schemes in the current dataset, each with an official source link.',
  'landing.browseAll': 'Browse the full list →',
  'landing.trust1Title': 'Rule-based, not a black box',
  'landing.trust1Desc': 'Every score traces back to a documented eligibility rule.',
  'landing.trust2Title': '{count} verified schemes',
  'landing.trust2Desc': 'Real Government of India programmes only — no invented data.',
  'landing.trust3Title': 'Official sources linked',
  'landing.trust3Desc': 'Every scheme links back to the government page that defines it.',
  'landing.howItWorks': 'How it works',
  'landing.step1Title': '1. Share your profile',
  'landing.step1Desc': 'Category, gender, state, sector, business stage, and a couple of quick eligibility questions.',
  'landing.step2Title': '2. Rule-based matching',
  'landing.step2Desc': 'A transparent, deterministic scoring engine checks your profile against every scheme — no guessing.',
  'landing.step3Title': '3. Explainable recommendations',
  'landing.step3Desc': 'See your top matches, why each one fits (or doesn’t), and the official next step to apply.',

  // Disclaimer / methodology / trust text (shared across pages)
  'disclaimer.title': 'AI-assisted recommendations, not an official decision.',
  'disclaimer.body':
    'This is a hackathon prototype (SIH26092). Always verify final eligibility, benefits, required documents, and application steps on the scheme’s official government source before applying.',
  'methodology.title': 'These are AI-assisted, rule-based matches',
  'methodology.body':
    'computed from seven factors you answered: category, gender, state, sector, business stage, first-time status, and income (if provided). Other details you entered, like business needs, turnover, or funding requirement, are saved for future guidance features but don’t affect this score yet.',
  'lowMatch.title': 'None of these are a strong match yet',
  'lowMatch.body':
    'Based on what you shared, the schemes below don’t line up strongly with your profile. That doesn’t mean nothing is available — double-check your category, state, sector, and business stage, since a small correction can change the result. The schemes listed below are still worth reading in the meantime.',
  'lowMatch.cta': 'Review your answers',

  // Common buttons / words
  'common.back': 'Back',
  'common.next': 'Next',
  'common.startOver': 'Start over',
  'common.startOverConfirm': 'Start over? This clears your saved answers and restarts the assessment from the beginning.',
  'common.viewDetails': 'View details',
  'common.officialSource': 'View official scheme',
  'common.officialPortal': 'Visit official scheme →',
  'common.save': 'Save',
  'common.saved': 'Saved',
  'common.saveScheme': 'Save scheme',
  'common.schemeSaved': 'Scheme saved',
  'common.remove': 'Remove',
  'common.loading': 'Loading your assessment…',
  'common.search': 'Search',
  'common.allCategories': 'All categories',
  'common.allSectors': 'All sectors',
  'common.noResults': 'No schemes match your search.',
  'common.clearFilters': 'Clear filters',

  // Assessment shell
  'assessment.stepOf': 'Step {current} of {total}',
  'assessment.stepLabel': 'Step {n}',
  'assessment.jumpToDemo': 'In a hurry? Jump to a demo profile ↓',
  'assessment.demoSectionTitle': 'Or jump straight to results with a demo profile',
  'assessment.loadThisProfile': 'Load this profile',
  'assessment.seeRecommendations': 'See my recommendations',
  'assessment.helperBasic': 'Select category, gender, and state to continue.',
  'assessment.helperBusiness': 'Select sector, business stage, and first-time status to continue.',

  // Assessment step titles/descriptions
  'assessment.step.basic.title': 'Basic profile',
  'assessment.step.basic.description': 'Category, gender, and state directly narrow down which schemes apply to you.',
  'assessment.step.business.title': 'Business information',
  'assessment.step.business.description': 'Sector, stage, and first-time status narrow schemes down to your kind of business.',
  'assessment.step.financial.title': 'Financial information',
  'assessment.step.financial.description': 'Income (optional) can match income-capped schemes; the rest helps us understand your needs.',
  'assessment.step.needs.title': 'Business needs',
  'assessment.step.needs.description': 'Select everything that applies — this helps us understand what kind of support you need.',

  // Assessment field labels
  'field.fullName': 'Full name (optional)',
  'field.fullNamePlaceholder': 'e.g. Priya Sharma',
  'field.age': 'Age (optional)',
  'field.gender': 'Gender',
  'field.selectGender': 'Select gender',
  'field.state': 'State',
  'field.selectState': 'Select your state',
  'field.district': 'District (optional)',
  'field.districtPlaceholder': 'e.g. Patna',
  'field.locationType': 'Rural / Urban (optional)',
  'field.category': 'Social / economic category',
  'field.selectCategory': 'Select category',
  'field.disabilityStatus': 'Disability status (optional)',
  'field.educationLevel': 'Education level (optional)',
  'field.selectEducationLevel': 'Select education level',
  'field.businessName': 'Business name (optional)',
  'field.businessNamePlaceholder': 'e.g. Sharma Handicrafts',
  'field.businessType': 'Business type (optional)',
  'field.selectBusinessType': 'Select business type',
  'field.sector': 'Industry / sector',
  'field.selectSector': 'Select your sector',
  'field.stage': 'Business stage',
  'field.selectStage': 'Select business stage',
  'field.yearsInOperation': 'Years in operation (optional)',
  'field.numberOfEmployees': 'Number of employees (optional)',
  'field.annualTurnoverLakh': 'Annual turnover, ₹ lakh (optional)',
  'field.businessLocation': 'Business location (optional)',
  'field.businessLocationPlaceholder': 'City / town',
  'field.registrationStatus': 'Registration status (optional)',
  'field.selectRegistrationStatus': 'Select registration status',
  'field.firstTime': 'First-time entrepreneur?',
  'field.selectOption': 'Select an option',
  'field.firstTimeYes': 'Yes, this is my first business',
  'field.firstTimeNo': 'No, I’ve run a business before',
  'field.income': 'Approximate annual income (optional)',
  'field.investmentRequiredLakh': 'Investment required, ₹ lakh (optional)',
  'field.fundingRequirementLakh': 'Funding required, ₹ lakh (optional)',
  'field.existingLoan': 'Do you have an existing loan? (optional)',
  'field.creditRequirement': 'Do you need credit support? (optional)',
  'field.subsidyRequirement': 'Do you need subsidy support? (optional)',
  'field.businessNeedsLabel': 'Select all that apply (optional)',
  'field.yes': 'Yes',
  'field.no': 'No',

  // Recommendations page
  'recommendations.title': 'Your top scheme matches',
  'recommendations.subtitle': 'Ranked by how closely your profile lines up with each scheme’s public eligibility rules.',
  'recommendations.incompleteTitle': 'Your top scheme matches',
  'recommendations.incompleteSubtitle': 'Answer a few more questions and we’ll rank the schemes you’re most likely eligible for.',
  'recommendations.incompleteAlert':
    'Your assessment isn’t finished yet — category, gender, state, sector, business stage, and first-time status all need an explicit answer before we can match schemes responsibly.',
  'recommendations.finishAssessment': 'Finish the assessment',
  'recommendations.orLoadDemo': 'Or load a demo profile',
  'recommendations.backToAssessment': 'Back to assessment',
  'recommendations.schemesShown': 'Schemes shown',
  'recommendations.strongestMatch': 'Strongest match',
  'recommendations.missingInfo': 'Missing information',
  'recommendations.noneShown': 'None for what’s shown',
  'recommendations.schemesShownDetail': '{shown} of {total} evaluated',
  'recommendations.needsMoreInfoOne': '1 scheme needs more info',
  'recommendations.needsMoreInfoMany': '{count} schemes need more info',

  // Scheme details page
  'schemeDetails.notFoundTitle': 'Scheme not found',
  'schemeDetails.notFoundBody': 'There’s no scheme with that id in this prototype’s dataset.',
  'schemeDetails.backToRecommendations': 'Back to recommendations',
  'schemeDetails.backToSchemes': 'Back to schemes',
  'schemeDetails.noOfficialLink': 'No official source link is on file for this entry.',
  'schemeDetails.overview': 'Overview',
  'schemeDetails.matchExplanation': 'Match explanation',
  'schemeDetails.finishToSeeMatch': 'Finish your assessment to see how your profile matches this scheme’s eligibility rules.',
  'schemeDetails.applicationChecklist': 'Application checklist',
  'schemeDetails.checklistIntro':
    'A guided walkthrough of the general application path, with this scheme’s own documents and steps filled in wherever the dataset has them.',
  'schemeDetails.quickRefTitle': 'Before you apply',
  'schemeDetails.quickRefDocs': 'Documents needed',
  'schemeDetails.quickRefDocsUnknown': 'Not catalogued yet for this scheme — check the official source.',
  'schemeDetails.quickRefWhere': 'Where to apply',
  'schemeDetails.whoCanBenefit': 'Who can benefit',

  // Checklist
  'checklist.stepsChecked': '{done} of {total} steps checked off',
  'checklist.officialPortal': 'Official application portal',
  'checklist.next': 'Next: {step}',
  'checklist.allDone':
    'Every step is checked off for this session — give everything one more look on the official source before you submit.',
  'checklist.footerNote': 'Always verify final eligibility, documents, and application steps on the official source above before you submit anything.',
  'checklist.completed': 'Completed',
  'checklist.notStarted': 'Not started',
  'checklist.markAs': 'Mark "{label}" as {state}',
  'checklist.step.check-eligibility': 'Check eligibility',
  'checklist.step.prepare-documents': 'Prepare documents',
  'checklist.step.visit-portal': 'Visit official application portal',
  'checklist.step.register-login': 'Register / log in',
  'checklist.step.complete-application': 'Complete the application',
  'checklist.step.upload-documents': 'Upload documents',
  'checklist.step.submit-track': 'Submit and track',
  'checklist.detail.check-eligibility':
    'Confirm you meet this scheme’s eligibility rules on the official source — the match shown on this page is a simplified prototype estimate, not a final decision.',
  'checklist.detail.prepare-documents-fallback':
    'Scheme-specific documents aren’t catalogued in this prototype yet — check the official source below for the current list.',
  'checklist.detail.visit-portal-fallback': 'No official source link is on file for this entry.',
  'checklist.detail.register-login': 'Most portals need an account or login, often linked to Aadhaar or a business registration.',
  'checklist.detail.complete-application-fallback':
    'Scheme-specific application steps aren’t catalogued in this prototype yet — the official portal will walk you through its own process.',
  'checklist.detail.upload-documents': 'Upload the documents the portal asks for, in the format and size it accepts.',
  'checklist.detail.submit-track': 'Submit the application and save any reference or tracking number the portal gives you.',

  // Saved schemes / dashboard
  'saved.title': 'Saved schemes',
  'saved.subtitle': 'Schemes you’ve bookmarked to revisit or apply to later.',
  'saved.emptyTitle': 'No saved schemes yet',
  'saved.emptyBody': 'Bookmark a scheme from your recommendations or the scheme browser, and it’ll show up here.',
  'saved.browseSchemes': 'Browse all schemes',
  'saved.needsProfile': 'Finish your assessment to see a personalised match score for your saved schemes.',
  'saved.countLabel': '{count} saved',

  // Scheme browser
  'browser.title': 'Browse all schemes',
  'browser.subtitle': 'Search or filter the full dataset of 13 government schemes — no assessment required.',
  'browser.searchPlaceholder': 'Search by name, ministry, or keyword…',
  'browser.showingCount': 'Showing {shown} of {total} schemes',
  'browser.documentsRequired': '{count} documents required',
  'browser.documentsUnknown': 'Documents not yet catalogued',

  // Match explanation / criteria tones (recommendation-card, criteria-list, match-explanation)
  'criteria.matched': 'Matched',
  'criteria.missing': 'Needs verification',
  'criteria.failed': 'Not aligned',
  'matchExplanation.why': 'Why this matches you:',
  'matchExplanation.moreMatched': '+{count} more matched criteria',
}

const hi: Dictionary = {
  'nav.home': 'होम',
  'nav.assessment': 'मूल्यांकन',
  'nav.schemes': 'योजनाएं',
  'nav.recommendations': 'सिफ़ारिशें',
  'nav.saved': 'सहेजी गई योजनाएं',
  'nav.brandTagline': 'एआई स्कीम मैचिंग',
  'nav.themeToggle': 'थीम बदलें',
  'nav.languageToggle': 'भाषा बदलें',
  'nav.savedSchemesLink': 'सहेजी गई योजनाएं',
  'nav.unsavedGuard': 'आपके पास मूल्यांकन के असहेजे उत्तर हैं। इस पेज को छोड़ें और अपनी प्रगति खोएं?',

  'landing.eyebrow': 'SIH26092 · प्रोटोटाइप',
  'landing.heroTitle': 'जानिए, आप किन सरकारी योजनाओं के लिए वाकई पात्र हैं',
  'landing.heroSubtitle':
    'महिलाओं, SC/ST, OBC, ग्रामीण, कम आय वाले और पहली बार उद्यम शुरू करने वालों के लिए बनाया गया। एक संक्षिप्त प्रोफ़ाइल भरें और एक पारदर्शी, नियम-आधारित मिलान इंजन से क्रमबद्ध, समझाई गई योजना सिफ़ारिशें पाएं — किसी अनुमान लगाने वाले चैटबॉट से नहीं।',
  'landing.ctaStart': 'मूल्यांकन शुरू करें',
  'landing.ctaDemo': 'एक लाइव डेमो प्रोफ़ाइल देखें',
  'landing.schemeCount': 'मौजूदा डेटासेट में {count} सत्यापित सरकारी योजनाएं, हर एक आधिकारिक स्रोत लिंक के साथ।',
  'landing.browseAll': 'पूरी सूची देखें →',
  'landing.trust1Title': 'नियम-आधारित, ब्लैक बॉक्स नहीं',
  'landing.trust1Desc': 'हर स्कोर एक दस्तावेज़ीकृत पात्रता नियम पर आधारित है।',
  'landing.trust2Title': '{count} सत्यापित योजनाएं',
  'landing.trust2Desc': 'केवल वास्तविक भारत सरकार के कार्यक्रम — कोई गढ़ा हुआ डेटा नहीं।',
  'landing.trust3Title': 'आधिकारिक स्रोत जुड़े हुए',
  'landing.trust3Desc': 'हर योजना उस सरकारी पेज से जुड़ी है जो उसे परिभाषित करता है।',
  'landing.howItWorks': 'यह कैसे काम करता है',
  'landing.step1Title': '1. अपनी प्रोफ़ाइल साझा करें',
  'landing.step1Desc': 'श्रेणी, लिंग, राज्य, क्षेत्र, व्यवसाय चरण, और कुछ त्वरित पात्रता प्रश्न।',
  'landing.step2Title': '2. नियम-आधारित मिलान',
  'landing.step2Desc': 'एक पारदर्शी, निश्चित स्कोरिंग इंजन आपकी प्रोफ़ाइल को हर योजना के विरुद्ध जांचता है — कोई अनुमान नहीं।',
  'landing.step3Title': '3. समझाई गई सिफ़ारिशें',
  'landing.step3Desc': 'अपने शीर्ष मिलान देखें, हर एक क्यों उपयुक्त है (या नहीं), और आवेदन के लिए आधिकारिक अगला कदम।',

  'disclaimer.title': 'एआई-सहायित सिफ़ारिशें, कोई आधिकारिक निर्णय नहीं।',
  'disclaimer.body':
    'यह एक हैकाथॉन प्रोटोटाइप (SIH26092) है। आवेदन करने से पहले हमेशा अंतिम पात्रता, लाभ, आवश्यक दस्तावेज़ और आवेदन के चरण योजना के आधिकारिक सरकारी स्रोत पर सत्यापित करें।',
  'methodology.title': 'ये एआई-सहायित, नियम-आधारित मिलान हैं',
  'methodology.body':
    'आपके द्वारा दिए गए सात कारकों से गणना की गई: श्रेणी, लिंग, राज्य, क्षेत्र, व्यवसाय चरण, पहली बार की स्थिति, और आय (यदि दी गई हो)। आपके द्वारा दर्ज अन्य विवरण, जैसे व्यवसाय आवश्यकताएं, कारोबार, या धन आवश्यकता, भविष्य की मार्गदर्शन सुविधाओं के लिए सहेजे गए हैं लेकिन अभी इस स्कोर को प्रभावित नहीं करते।',
  'lowMatch.title': 'अभी तक इनमें से कोई भी मजबूत मिलान नहीं है',
  'lowMatch.body':
    'आपके द्वारा साझा की गई जानकारी के आधार पर, नीचे दी गई योजनाएं आपकी प्रोफ़ाइल से मजबूती से मेल नहीं खातीं। इसका मतलब यह नहीं कि कुछ भी उपलब्ध नहीं है — अपनी श्रेणी, राज्य, क्षेत्र और व्यवसाय चरण दोबारा जांचें, क्योंकि एक छोटा सुधार परिणाम बदल सकता है। नीचे सूचीबद्ध योजनाएं फिर भी पढ़ने लायक हैं।',
  'lowMatch.cta': 'अपने उत्तर देखें',

  'common.back': 'पीछे',
  'common.next': 'आगे',
  'common.startOver': 'फिर से शुरू करें',
  'common.startOverConfirm': 'फिर से शुरू करें? इससे आपके सहेजे गए उत्तर मिट जाएंगे और मूल्यांकन शुरुआत से दोबारा शुरू होगा।',
  'common.viewDetails': 'विवरण देखें',
  'common.officialSource': 'आधिकारिक योजना देखें',
  'common.officialPortal': 'आधिकारिक योजना देखें →',
  'common.save': 'सहेजें',
  'common.saved': 'सहेजा गया',
  'common.saveScheme': 'योजना सहेजें',
  'common.schemeSaved': 'योजना सहेजी गई',
  'common.remove': 'हटाएं',
  'common.loading': 'आपका मूल्यांकन लोड हो रहा है…',
  'common.search': 'खोजें',
  'common.allCategories': 'सभी श्रेणियां',
  'common.allSectors': 'सभी क्षेत्र',
  'common.noResults': 'आपकी खोज से कोई योजना मेल नहीं खाती।',
  'common.clearFilters': 'फ़िल्टर साफ़ करें',

  'assessment.stepOf': 'चरण {current} / {total}',
  'assessment.stepLabel': 'चरण {n}',
  'assessment.jumpToDemo': 'जल्दी में हैं? एक डेमो प्रोफ़ाइल पर जाएं ↓',
  'assessment.demoSectionTitle': 'या डेमो प्रोफ़ाइल के साथ सीधे परिणाम देखें',
  'assessment.loadThisProfile': 'यह प्रोफ़ाइल लोड करें',
  'assessment.seeRecommendations': 'मेरी सिफ़ारिशें देखें',
  'assessment.helperBasic': 'जारी रखने के लिए श्रेणी, लिंग और राज्य चुनें।',
  'assessment.helperBusiness': 'जारी रखने के लिए क्षेत्र, व्यवसाय चरण और पहली बार की स्थिति चुनें।',

  'assessment.step.basic.title': 'बुनियादी प्रोफ़ाइल',
  'assessment.step.basic.description': 'श्रेणी, लिंग और राज्य सीधे तय करते हैं कि कौन-सी योजनाएं आप पर लागू होती हैं।',
  'assessment.step.business.title': 'व्यवसाय जानकारी',
  'assessment.step.business.description': 'क्षेत्र, चरण और पहली बार की स्थिति योजनाओं को आपके व्यवसाय के अनुसार सीमित करती हैं।',
  'assessment.step.financial.title': 'वित्तीय जानकारी',
  'assessment.step.financial.description': 'आय (वैकल्पिक) आय-सीमित योजनाओं से मेल खा सकती है; बाकी हमें आपकी आवश्यकताएं समझने में मदद करता है।',
  'assessment.step.needs.title': 'व्यवसाय आवश्यकताएं',
  'assessment.step.needs.description': 'जो भी लागू हो उसे चुनें — इससे हमें पता चलता है कि आपको किस तरह के समर्थन की आवश्यकता है।',

  'field.fullName': 'पूरा नाम (वैकल्पिक)',
  'field.fullNamePlaceholder': 'जैसे प्रिया शर्मा',
  'field.age': 'आयु (वैकल्पिक)',
  'field.gender': 'लिंग',
  'field.selectGender': 'लिंग चुनें',
  'field.state': 'राज्य',
  'field.selectState': 'अपना राज्य चुनें',
  'field.district': 'ज़िला (वैकल्पिक)',
  'field.districtPlaceholder': 'जैसे पटना',
  'field.locationType': 'ग्रामीण / शहरी (वैकल्पिक)',
  'field.category': 'सामाजिक / आर्थिक श्रेणी',
  'field.selectCategory': 'श्रेणी चुनें',
  'field.disabilityStatus': 'विकलांगता स्थिति (वैकल्पिक)',
  'field.educationLevel': 'शिक्षा स्तर (वैकल्पिक)',
  'field.selectEducationLevel': 'शिक्षा स्तर चुनें',
  'field.businessName': 'व्यवसाय का नाम (वैकल्पिक)',
  'field.businessNamePlaceholder': 'जैसे शर्मा हस्तशिल्प',
  'field.businessType': 'व्यवसाय प्रकार (वैकल्पिक)',
  'field.selectBusinessType': 'व्यवसाय प्रकार चुनें',
  'field.sector': 'उद्योग / क्षेत्र',
  'field.selectSector': 'अपना क्षेत्र चुनें',
  'field.stage': 'व्यवसाय चरण',
  'field.selectStage': 'व्यवसाय चरण चुनें',
  'field.yearsInOperation': 'संचालन के वर्ष (वैकल्पिक)',
  'field.numberOfEmployees': 'कर्मचारियों की संख्या (वैकल्पिक)',
  'field.annualTurnoverLakh': 'वार्षिक कारोबार, ₹ लाख (वैकल्पिक)',
  'field.businessLocation': 'व्यवसाय स्थान (वैकल्पिक)',
  'field.businessLocationPlaceholder': 'शहर / कस्बा',
  'field.registrationStatus': 'पंजीकरण स्थिति (वैकल्पिक)',
  'field.selectRegistrationStatus': 'पंजीकरण स्थिति चुनें',
  'field.firstTime': 'क्या यह आपका पहला व्यवसाय है?',
  'field.selectOption': 'एक विकल्प चुनें',
  'field.firstTimeYes': 'हां, यह मेरा पहला व्यवसाय है',
  'field.firstTimeNo': 'नहीं, मैंने पहले भी व्यवसाय चलाया है',
  'field.income': 'अनुमानित वार्षिक आय (वैकल्पिक)',
  'field.investmentRequiredLakh': 'आवश्यक निवेश, ₹ लाख (वैकल्पिक)',
  'field.fundingRequirementLakh': 'आवश्यक धनराशि, ₹ लाख (वैकल्पिक)',
  'field.existingLoan': 'क्या आपके पास मौजूदा ऋण है? (वैकल्पिक)',
  'field.creditRequirement': 'क्या आपको ऋण सहायता चाहिए? (वैकल्पिक)',
  'field.subsidyRequirement': 'क्या आपको सब्सिडी सहायता चाहिए? (वैकल्पिक)',
  'field.businessNeedsLabel': 'जो भी लागू हो चुनें (वैकल्पिक)',
  'field.yes': 'हां',
  'field.no': 'नहीं',

  'recommendations.title': 'आपके शीर्ष योजना मिलान',
  'recommendations.subtitle': 'आपकी प्रोफ़ाइल हर योजना के सार्वजनिक पात्रता नियमों से कितनी मेल खाती है, उसके अनुसार क्रमबद्ध।',
  'recommendations.incompleteTitle': 'आपके शीर्ष योजना मिलान',
  'recommendations.incompleteSubtitle': 'कुछ और प्रश्नों के उत्तर दें और हम उन योजनाओं को क्रमबद्ध करेंगे जिनके लिए आप सबसे अधिक पात्र हैं।',
  'recommendations.incompleteAlert':
    'आपका मूल्यांकन अभी पूरा नहीं हुआ है — योजनाओं का जिम्मेदारी से मिलान करने से पहले श्रेणी, लिंग, राज्य, क्षेत्र, व्यवसाय चरण और पहली बार की स्थिति का स्पष्ट उत्तर आवश्यक है।',
  'recommendations.finishAssessment': 'मूल्यांकन पूरा करें',
  'recommendations.orLoadDemo': 'या एक डेमो प्रोफ़ाइल लोड करें',
  'recommendations.backToAssessment': 'मूल्यांकन पर वापस जाएं',
  'recommendations.schemesShown': 'दिखाई गई योजनाएं',
  'recommendations.strongestMatch': 'सबसे मजबूत मिलान',
  'recommendations.missingInfo': 'जानकारी अनुपलब्ध',
  'recommendations.noneShown': 'दिखाई गई योजनाओं के लिए कोई नहीं',
  'recommendations.schemesShownDetail': '{total} में से {shown} का मूल्यांकन किया गया',
  'recommendations.needsMoreInfoOne': '1 योजना को अधिक जानकारी चाहिए',
  'recommendations.needsMoreInfoMany': '{count} योजनाओं को अधिक जानकारी चाहिए',

  'schemeDetails.notFoundTitle': 'योजना नहीं मिली',
  'schemeDetails.notFoundBody': 'इस प्रोटोटाइप के डेटासेट में इस आईडी वाली कोई योजना नहीं है।',
  'schemeDetails.backToRecommendations': 'सिफ़ारिशों पर वापस जाएं',
  'schemeDetails.backToSchemes': 'योजनाओं पर वापस जाएं',
  'schemeDetails.noOfficialLink': 'इस प्रविष्टि के लिए कोई आधिकारिक स्रोत लिंक दर्ज नहीं है।',
  'schemeDetails.overview': 'अवलोकन',
  'schemeDetails.matchExplanation': 'मिलान स्पष्टीकरण',
  'schemeDetails.finishToSeeMatch': 'यह देखने के लिए कि आपकी प्रोफ़ाइल इस योजना के पात्रता नियमों से कैसे मेल खाती है, अपना मूल्यांकन पूरा करें।',
  'schemeDetails.applicationChecklist': 'आवेदन चेकलिस्ट',
  'schemeDetails.checklistIntro':
    'सामान्य आवेदन प्रक्रिया का एक निर्देशित विवरण, जिसमें जहां भी डेटासेट में उपलब्ध हो, इस योजना के अपने दस्तावेज़ और चरण शामिल किए गए हैं।',
  'schemeDetails.quickRefTitle': 'आवेदन करने से पहले',
  'schemeDetails.quickRefDocs': 'आवश्यक दस्तावेज़',
  'schemeDetails.quickRefDocsUnknown': 'इस योजना के लिए अभी सूचीबद्ध नहीं — आधिकारिक स्रोत देखें।',
  'schemeDetails.quickRefWhere': 'कहां आवेदन करें',
  'schemeDetails.whoCanBenefit': 'कौन लाभ उठा सकता है',

  'checklist.stepsChecked': '{total} में से {done} चरण पूरे किए गए',
  'checklist.officialPortal': 'आधिकारिक आवेदन पोर्टल',
  'checklist.next': 'अगला: {step}',
  'checklist.allDone': 'इस सत्र के सभी चरण पूरे हो गए हैं — सबमिट करने से पहले आधिकारिक स्रोत पर एक बार और जांच लें।',
  'checklist.footerNote': 'कुछ भी सबमिट करने से पहले हमेशा अंतिम पात्रता, दस्तावेज़ और आवेदन के चरण ऊपर दिए गए आधिकारिक स्रोत पर सत्यापित करें।',
  'checklist.completed': 'पूरा हुआ',
  'checklist.notStarted': 'शुरू नहीं हुआ',
  'checklist.markAs': '"{label}" को {state} के रूप में चिह्नित करें',
  'checklist.step.check-eligibility': 'पात्रता जांचें',
  'checklist.step.prepare-documents': 'दस्तावेज़ तैयार करें',
  'checklist.step.visit-portal': 'आधिकारिक आवेदन पोर्टल पर जाएं',
  'checklist.step.register-login': 'पंजीकरण / लॉगिन करें',
  'checklist.step.complete-application': 'आवेदन पूरा करें',
  'checklist.step.upload-documents': 'दस्तावेज़ अपलोड करें',
  'checklist.step.submit-track': 'सबमिट करें और ट्रैक करें',
  'checklist.detail.check-eligibility':
    'आधिकारिक स्रोत पर पुष्टि करें कि आप इस योजना के पात्रता नियमों को पूरा करते हैं — इस पेज पर दिखाया गया मिलान एक सरलीकृत प्रोटोटाइप अनुमान है, अंतिम निर्णय नहीं।',
  'checklist.detail.prepare-documents-fallback':
    'इस प्रोटोटाइप में योजना-विशिष्ट दस्तावेज़ अभी सूचीबद्ध नहीं हैं — मौजूदा सूची के लिए नीचे आधिकारिक स्रोत देखें।',
  'checklist.detail.visit-portal-fallback': 'इस प्रविष्टि के लिए कोई आधिकारिक स्रोत लिंक दर्ज नहीं है।',
  'checklist.detail.register-login': 'अधिकांश पोर्टल को एक खाते या लॉगिन की आवश्यकता होती है, जो अक्सर आधार या व्यवसाय पंजीकरण से जुड़ा होता है।',
  'checklist.detail.complete-application-fallback':
    'इस प्रोटोटाइप में योजना-विशिष्ट आवेदन चरण अभी सूचीबद्ध नहीं हैं — आधिकारिक पोर्टल आपको अपनी प्रक्रिया के माध्यम से मार्गदर्शन देगा।',
  'checklist.detail.upload-documents': 'पोर्टल जिस प्रारूप और आकार में मांगे, उसमें दस्तावेज़ अपलोड करें।',
  'checklist.detail.submit-track': 'आवेदन सबमिट करें और पोर्टल द्वारा दिया गया कोई भी संदर्भ या ट्रैकिंग नंबर सहेज लें।',

  'saved.title': 'सहेजी गई योजनाएं',
  'saved.subtitle': 'वे योजनाएं जिन्हें आपने बाद में देखने या आवेदन करने के लिए सहेजा है।',
  'saved.emptyTitle': 'अभी तक कोई योजना सहेजी नहीं गई',
  'saved.emptyBody': 'अपनी सिफ़ारिशों या योजना ब्राउज़र से किसी योजना को सहेजें, और वह यहां दिखेगी।',
  'saved.browseSchemes': 'सभी योजनाएं ब्राउज़ करें',
  'saved.needsProfile': 'अपनी सहेजी गई योजनाओं के लिए व्यक्तिगत मिलान स्कोर देखने हेतु अपना मूल्यांकन पूरा करें।',
  'saved.countLabel': '{count} सहेजी गई',

  'browser.title': 'सभी योजनाएं ब्राउज़ करें',
  'browser.subtitle': '13 सरकारी योजनाओं के पूरे डेटासेट को खोजें या फ़िल्टर करें — किसी मूल्यांकन की आवश्यकता नहीं।',
  'browser.searchPlaceholder': 'नाम, मंत्रालय, या कीवर्ड से खोजें…',
  'browser.showingCount': '{total} में से {shown} योजनाएं दिखाई जा रही हैं',
  'browser.documentsRequired': '{count} दस्तावेज़ आवश्यक',
  'browser.documentsUnknown': 'दस्तावेज़ अभी सूचीबद्ध नहीं',

  'criteria.matched': 'मेल खाया',
  'criteria.missing': 'सत्यापन आवश्यक',
  'criteria.failed': 'मेल नहीं खाता',
  'matchExplanation.why': 'यह आपसे क्यों मेल खाता है:',
  'matchExplanation.moreMatched': '+{count} और मेल खाते मानदंड',
}

export const translations: Record<Locale, Dictionary> = { en, hi }
