import { BadgeCheck, Building2, Camera, FileSignature, FileText, GraduationCap, IdCard, Landmark, MapPin, ScrollText, type LucideIcon } from 'lucide-react'

/**
 * Purely visual, best-effort categorisation of a requiredDocuments
 * string (see data/schemes.ts) into a recognisable icon — e.g.
 * "Aadhaar card" gets an ID-card icon, "Bank statement" gets a bank
 * icon. Matched by keyword against the document's own text, so a new
 * scheme's documents get sensible icons automatically without a
 * second, hand-maintained field per document.
 *
 * This never changes what a document IS, only how it's illustrated —
 * requested by the team (2026-09-06) as a lighter-weight alternative
 * to a real photo/mockup of each document, which risked looking like
 * an attempt at a genuine specimen ID. A generic icon carries no such
 * risk and needs no per-scheme upkeep.
 */
// Checked in order, first keyword match wins — so this is ordered from
// most-specific/unambiguous (an ID-card or bank keyword rarely shows up
// as an incidental aside) to least (an "affidavit"/"witness" mention is
// very often just a conditional alternative tacked onto some OTHER,
// more central document — e.g. "Caste Certificate ... or an affidavit"
// is fundamentally a certificate, not an affidavit — so those go last,
// after the more central certificate/address/institution categories
// have had a chance to match on the same string).
const RULES: Array<{ icon: LucideIcon; keywords: string[] }> = [
  {
    icon: IdCard,
    keywords: ['aadhaar', 'pan card', 'income tax pan', 'voter id', 'passport', 'driving licence', 'driving license', 'identity proof', 'proof of identity', 'kyc'],
  },
  {
    icon: Camera,
    keywords: ['photograph', 'photo of', 'live photograph', 'passport-size', 'passport size'],
  },
  {
    icon: Landmark,
    keywords: ['bank', 'passbook', 'cheque', 'ecs mandate', 'account statement', 'statement of account', 'balance sheet'],
  },
  {
    icon: Building2,
    keywords: [
      'udyam',
      'gstin',
      'gst',
      'fssai',
      'roc',
      'registrar of companies',
      'incorporation',
      'moa',
      'memorandum',
      'partnership deed',
      'bye-laws',
      'trust deed',
      'registration certificate',
      'shareholding',
    ],
  },
  {
    icon: MapPin,
    keywords: ['residence', 'address proof', 'domicile', 'ration card', 'utility bill', 'electricity', 'telephone bill', 'property tax', 'rent agreement', 'ownership proof', 'land document', 'workplace'],
  },
  {
    icon: GraduationCap,
    keywords: ['degree', 'diploma', 'mark list', 'educational qualification', 'training certificate', 'course completion', 'matriculation'],
  },
  {
    icon: ScrollText,
    keywords: ['certificate', 'caste', 'disability', 'pwd', 'age proof', 'special category', 'community certificate', 'school leaving'],
  },
  {
    icon: BadgeCheck,
    keywords: ['guarantee', 'witness', 'sanction letter', 'no-objection', 'legal heir', 'insurance receipt', 'photo id'],
  },
  {
    icon: FileSignature,
    keywords: ['affidavit', 'undertaking', 'sworn', 'notary', 'declaration'],
  },
]

export function getDocumentIcon(documentText: string): LucideIcon {
  const lower = documentText.toLowerCase()
  for (const rule of RULES) {
    if (rule.keywords.some((keyword) => lower.includes(keyword))) {
      return rule.icon
    }
  }
  return FileText
}
