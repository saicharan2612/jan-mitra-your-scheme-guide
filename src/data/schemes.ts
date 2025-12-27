export interface Scheme {
  id: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  category: string;
  deadline: string;
  eligibility: {
    income?: string[];
    category?: string[];
    gender?: string[];
    state?: string[];
    minAge?: number;
    maxAge?: number;
    occupation?: string[];
  };
  benefits: string;
  benefitsHi: string;
  status: "new" | "ongoing" | "closing-soon";
  type: "scholarship" | "welfare" | "subsidy" | "pension";
  documents: string[];
  websiteUrl: string;
  applicationProcess: string[];
  applicationProcessHi: string[];
}

export const schemes: Scheme[] = [
  {
    id: "1",
    title: "Post Matric Scholarship for SC Students",
    titleHi: "एससी छात्रों के लिए पोस्ट मैट्रिक छात्रवृत्ति",
    description: "Financial assistance for SC students pursuing post-matriculation courses",
    descriptionHi: "पोस्ट-मैट्रिक पाठ्यक्रमों का अध्ययन कर रहे एससी छात्रों के लिए वित्तीय सहायता",
    category: "Education",
    deadline: "2025-01-31",
    eligibility: {
      income: ["below-1-lakh", "1-2.5-lakh"],
      category: ["sc"],
      maxAge: 35,
    },
    benefits: "Full tuition fee + ₹1,200/month stipend",
    benefitsHi: "पूर्ण शुल्क + ₹1,200/माह वजीफा",
    status: "ongoing",
    type: "scholarship",
    documents: ["Caste Certificate", "Income Certificate", "Marksheet", "Bank Passbook", "Aadhaar Card"],
    websiteUrl: "https://scholarships.gov.in/",
    applicationProcess: [
      "Visit the National Scholarship Portal (scholarships.gov.in)",
      "Register with your mobile number and email",
      "Complete the One Time Registration (OTR)",
      "Login and select 'Post Matric Scholarship for SC'",
      "Fill in personal, academic, and bank details",
      "Upload required documents (max 200KB each)",
      "Submit application and note the Application ID",
      "Track application status using the Application ID"
    ],
    applicationProcessHi: [
      "राष्ट्रीय छात्रवृत्ति पोर्टल (scholarships.gov.in) पर जाएं",
      "अपने मोबाइल नंबर और ईमेल से पंजीकरण करें",
      "वन टाइम रजिस्ट्रेशन (OTR) पूरा करें",
      "लॉगिन करें और 'एससी के लिए पोस्ट मैट्रिक छात्रवृत्ति' चुनें",
      "व्यक्तिगत, शैक्षणिक और बैंक विवरण भरें",
      "आवश्यक दस्तावेज़ अपलोड करें (अधिकतम 200KB प्रत्येक)",
      "आवेदन जमा करें और आवेदन आईडी नोट करें",
      "आवेदन आईडी का उपयोग करके आवेदन की स्थिति ट्रैक करें"
    ],
  },
  {
    id: "2",
    title: "PM Kisan Samman Nidhi",
    titleHi: "पीएम किसान सम्मान निधि",
    description: "Direct income support of ₹6,000 per year for small and marginal farmers",
    descriptionHi: "छोटे और सीमांत किसानों के लिए ₹6,000 प्रति वर्ष की प्रत्यक्ष आय सहायता",
    category: "Agriculture",
    deadline: "2025-03-31",
    eligibility: {
      income: ["below-1-lakh", "1-2.5-lakh", "2.5-5-lakh"],
      occupation: ["farmer", "agriculture"],
    },
    benefits: "₹6,000/year in 3 installments",
    benefitsHi: "3 किस्तों में ₹6,000/वर्ष",
    status: "ongoing",
    type: "welfare",
    documents: ["Aadhaar Card", "Land Records", "Bank Passbook"],
    websiteUrl: "https://pmkisan.gov.in/",
    applicationProcess: [
      "Visit pmkisan.gov.in official portal",
      "Click on 'New Farmer Registration'",
      "Select your state and enter Aadhaar number",
      "Fill in land and personal details",
      "Upload land records and bank passbook",
      "Submit and get registration number",
      "Check beneficiary status using registration number"
    ],
    applicationProcessHi: [
      "pmkisan.gov.in आधिकारिक पोर्टल पर जाएं",
      "'नया किसान पंजीकरण' पर क्लिक करें",
      "अपना राज्य चुनें और आधार नंबर दर्ज करें",
      "भूमि और व्यक्तिगत विवरण भरें",
      "भूमि रिकॉर्ड और बैंक पासबुक अपलोड करें",
      "जमा करें और पंजीकरण संख्या प्राप्त करें",
      "पंजीकरण संख्या का उपयोग करके लाभार्थी स्थिति जांचें"
    ],
  },
  {
    id: "3",
    title: "Pradhan Mantri Awas Yojana",
    titleHi: "प्रधानमंत्री आवास योजना",
    description: "Housing subsidy for economically weaker sections to build pucca houses",
    descriptionHi: "पक्के मकान बनाने के लिए आर्थिक रूप से कमजोर वर्गों के लिए आवास सब्सिडी",
    category: "Housing",
    deadline: "2025-12-31",
    eligibility: {
      income: ["below-1-lakh", "1-2.5-lakh"],
      category: ["general", "obc", "sc", "st", "ews"],
    },
    benefits: "Subsidy up to ₹2.67 Lakh",
    benefitsHi: "₹2.67 लाख तक की सब्सिडी",
    status: "ongoing",
    type: "subsidy",
    documents: ["Aadhaar Card", "Income Certificate", "BPL Card", "Land Documents"],
    websiteUrl: "https://pmaymis.gov.in/",
    applicationProcess: [
      "Visit pmaymis.gov.in portal",
      "Click on 'Citizen Assessment'",
      "Select 'Benefits under other 3 components'",
      "Enter Aadhaar number for verification",
      "Fill in family and income details",
      "Upload required documents",
      "Submit application and note reference number",
      "Track status on the portal"
    ],
    applicationProcessHi: [
      "pmaymis.gov.in पोर्टल पर जाएं",
      "'नागरिक मूल्यांकन' पर क्लिक करें",
      "'अन्य 3 घटकों के तहत लाभ' चुनें",
      "सत्यापन के लिए आधार नंबर दर्ज करें",
      "परिवार और आय विवरण भरें",
      "आवश्यक दस्तावेज़ अपलोड करें",
      "आवेदन जमा करें और संदर्भ संख्या नोट करें",
      "पोर्टल पर स्थिति ट्रैक करें"
    ],
  },
  {
    id: "4",
    title: "National Means-cum-Merit Scholarship",
    titleHi: "राष्ट्रीय साधन-सह-मेधा छात्रवृत्ति",
    description: "Scholarship for meritorious students from economically weaker sections studying in Class 9-12",
    descriptionHi: "कक्षा 9-12 में पढ़ने वाले आर्थिक रूप से कमजोर वर्गों के मेधावी छात्रों के लिए छात्रवृत्ति",
    category: "Education",
    deadline: "2025-02-15",
    eligibility: {
      income: ["below-1-lakh", "1-2.5-lakh"],
      maxAge: 18,
    },
    benefits: "₹12,000/year",
    benefitsHi: "₹12,000/वर्ष",
    status: "closing-soon",
    type: "scholarship",
    documents: ["Marksheet", "Income Certificate", "Aadhaar Card", "Bank Passbook"],
    websiteUrl: "https://scholarships.gov.in/",
    applicationProcess: [
      "Register on National Scholarship Portal",
      "Login and select NMMS scholarship",
      "Fill academic and personal details",
      "Upload Class 8 marksheet",
      "Upload income certificate (below ₹3.5 lakh)",
      "Submit application online",
      "Application verified by school and district",
      "Track status using Application ID"
    ],
    applicationProcessHi: [
      "राष्ट्रीय छात्रवृत्ति पोर्टल पर पंजीकरण करें",
      "लॉगिन करें और NMMS छात्रवृत्ति चुनें",
      "शैक्षणिक और व्यक्तिगत विवरण भरें",
      "कक्षा 8 की मार्कशीट अपलोड करें",
      "आय प्रमाण पत्र अपलोड करें (₹3.5 लाख से कम)",
      "ऑनलाइन आवेदन जमा करें",
      "स्कूल और जिले द्वारा आवेदन सत्यापित",
      "आवेदन आईडी का उपयोग करके स्थिति ट्रैक करें"
    ],
  },
  {
    id: "5",
    title: "Atal Pension Yojana",
    titleHi: "अटल पेंशन योजना",
    description: "Guaranteed pension scheme for workers in unorganized sector",
    descriptionHi: "असंगठित क्षेत्र में श्रमिकों के लिए गारंटीकृत पेंशन योजना",
    category: "Social Security",
    deadline: "2025-06-30",
    eligibility: {
      income: ["below-1-lakh", "1-2.5-lakh", "2.5-5-lakh", "5-8-lakh"],
      minAge: 18,
      maxAge: 40,
    },
    benefits: "₹1,000 - ₹5,000/month pension after 60",
    benefitsHi: "60 के बाद ₹1,000 - ₹5,000/माह पेंशन",
    status: "ongoing",
    type: "pension",
    documents: ["Aadhaar Card", "Bank Passbook", "Mobile Number"],
    websiteUrl: "https://www.npscra.nsdl.co.in/",
    applicationProcess: [
      "Visit your bank branch with documents",
      "Fill APY registration form",
      "Choose pension amount (₹1000-5000)",
      "Link Aadhaar and mobile number",
      "Set up auto-debit from bank account",
      "Get PRAN (Permanent Retirement Account Number)",
      "Monthly contributions auto-debited till age 60"
    ],
    applicationProcessHi: [
      "दस्तावेजों के साथ अपनी बैंक शाखा जाएं",
      "APY पंजीकरण फॉर्म भरें",
      "पेंशन राशि चुनें (₹1000-5000)",
      "आधार और मोबाइल नंबर लिंक करें",
      "बैंक खाते से ऑटो-डेबिट सेट करें",
      "PRAN (स्थायी सेवानिवृत्ति खाता संख्या) प्राप्त करें",
      "60 वर्ष तक मासिक योगदान ऑटो-डेबिट"
    ],
  },
  {
    id: "6",
    title: "Sukanya Samriddhi Yojana",
    titleHi: "सुकन्या समृद्धि योजना",
    description: "Savings scheme for girl child with high interest rate and tax benefits",
    descriptionHi: "उच्च ब्याज दर और कर लाभ के साथ बालिकाओं के लिए बचत योजना",
    category: "Women & Child",
    deadline: "2025-12-31",
    eligibility: {
      gender: ["female"],
      maxAge: 10,
    },
    benefits: "8.2% interest rate + Tax benefits",
    benefitsHi: "8.2% ब्याज दर + कर लाभ",
    status: "new",
    type: "welfare",
    documents: ["Birth Certificate", "Aadhaar Card", "Parent's ID Proof", "Address Proof"],
    websiteUrl: "https://www.indiapost.gov.in/",
    applicationProcess: [
      "Visit nearest Post Office or authorized bank",
      "Fill SSY account opening form",
      "Attach girl child's birth certificate",
      "Submit parent's ID and address proof",
      "Deposit minimum ₹250 to open account",
      "Get SSY passbook",
      "Deposit yearly (min ₹250, max ₹1.5 lakh)"
    ],
    applicationProcessHi: [
      "नजदीकी डाकघर या अधिकृत बैंक जाएं",
      "SSY खाता खोलने का फॉर्म भरें",
      "बालिका का जन्म प्रमाण पत्र संलग्न करें",
      "माता-पिता की आईडी और पता प्रमाण जमा करें",
      "खाता खोलने के लिए न्यूनतम ₹250 जमा करें",
      "SSY पासबुक प्राप्त करें",
      "वार्षिक जमा करें (न्यूनतम ₹250, अधिकतम ₹1.5 लाख)"
    ],
  },
  {
    id: "7",
    title: "MGNREGA Job Card",
    titleHi: "मनरेगा जॉब कार्ड",
    description: "100 days guaranteed wage employment for rural households",
    descriptionHi: "ग्रामीण परिवारों के लिए 100 दिन की गारंटीकृत मजदूरी रोजगार",
    category: "Employment",
    deadline: "2025-12-31",
    eligibility: {
      income: ["below-1-lakh", "1-2.5-lakh"],
      minAge: 18,
    },
    benefits: "100 days work at ₹267/day (varies by state)",
    benefitsHi: "₹267/दिन पर 100 दिन का काम (राज्य के अनुसार भिन्न)",
    status: "ongoing",
    type: "welfare",
    documents: ["Aadhaar Card", "Ration Card", "Passport Photo", "Bank Passbook"],
    websiteUrl: "https://nrega.nic.in/",
    applicationProcess: [
      "Visit Gram Panchayat office",
      "Fill job card application form",
      "Submit Aadhaar and ration card copy",
      "Attach passport size photographs",
      "Gram Panchayat verifies application",
      "Job card issued within 15 days",
      "Request work in writing to Gram Panchayat",
      "Work assigned within 15 days of request"
    ],
    applicationProcessHi: [
      "ग्राम पंचायत कार्यालय जाएं",
      "जॉब कार्ड आवेदन फॉर्म भरें",
      "आधार और राशन कार्ड की कॉपी जमा करें",
      "पासपोर्ट आकार की तस्वीरें संलग्न करें",
      "ग्राम पंचायत आवेदन सत्यापित करती है",
      "15 दिनों के भीतर जॉब कार्ड जारी",
      "ग्राम पंचायत को लिखित में काम का अनुरोध करें",
      "अनुरोध के 15 दिनों के भीतर काम सौंपा जाता है"
    ],
  },
  {
    id: "8",
    title: "Pre-Matric Scholarship for OBC Students",
    titleHi: "ओबीसी छात्रों के लिए प्री-मैट्रिक छात्रवृत्ति",
    description: "Financial assistance for OBC students in classes 1-10",
    descriptionHi: "कक्षा 1-10 में ओबीसी छात्रों के लिए वित्तीय सहायता",
    category: "Education",
    deadline: "2025-01-20",
    eligibility: {
      income: ["below-1-lakh", "1-2.5-lakh"],
      category: ["obc"],
      maxAge: 18,
    },
    benefits: "₹100-500/month + Book allowance",
    benefitsHi: "₹100-500/माह + पुस्तक भत्ता",
    status: "closing-soon",
    type: "scholarship",
    documents: ["OBC Certificate", "Income Certificate", "Marksheet", "Aadhaar Card"],
    websiteUrl: "https://scholarships.gov.in/",
    applicationProcess: [
      "Register on National Scholarship Portal",
      "Complete One Time Registration (OTR)",
      "Login and select Pre-Matric OBC scholarship",
      "Fill student and family details",
      "Upload OBC and income certificates",
      "Upload previous year marksheet",
      "School verifies and forwards application",
      "Track status with Application ID"
    ],
    applicationProcessHi: [
      "राष्ट्रीय छात्रवृत्ति पोर्टल पर पंजीकरण करें",
      "वन टाइम रजिस्ट्रेशन (OTR) पूरा करें",
      "लॉगिन करें और प्री-मैट्रिक OBC छात्रवृत्ति चुनें",
      "छात्र और परिवार का विवरण भरें",
      "OBC और आय प्रमाण पत्र अपलोड करें",
      "पिछले वर्ष की मार्कशीट अपलोड करें",
      "स्कूल सत्यापित करता है और आवेदन अग्रेषित करता है",
      "आवेदन आईडी के साथ स्थिति ट्रैक करें"
    ],
  },
];

export const nearbyOffices = [
  {
    id: "1",
    name: "District Collectorate Office",
    nameHi: "जिला कलेक्टर कार्यालय",
    address: "Civil Lines, Main Road",
    distance: "2.3 km",
    services: ["Income Certificate", "Caste Certificate", "Domicile Certificate"],
    timing: "10:00 AM - 5:00 PM",
  },
  {
    id: "2",
    name: "Block Development Office",
    nameHi: "खंड विकास कार्यालय",
    address: "Block HQ, Near Bus Stand",
    distance: "4.1 km",
    services: ["MGNREGA", "PM Awas Yojana", "BPL Card"],
    timing: "9:30 AM - 5:30 PM",
  },
  {
    id: "3",
    name: "Common Service Centre (CSC)",
    nameHi: "जन सेवा केंद्र",
    address: "Village Panchayat Building",
    distance: "0.8 km",
    services: ["Aadhaar Update", "PAN Card", "Scholarship Application"],
    timing: "9:00 AM - 6:00 PM",
  },
  {
    id: "4",
    name: "Post Office",
    nameHi: "डाकघर",
    address: "Market Road",
    distance: "1.2 km",
    services: ["Sukanya Samriddhi", "Atal Pension", "Savings Account"],
    timing: "10:00 AM - 4:00 PM",
  },
];