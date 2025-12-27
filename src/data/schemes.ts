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
  };
  benefits: string;
  benefitsHi: string;
  status: "new" | "ongoing" | "closing-soon";
  type: "scholarship" | "welfare" | "subsidy" | "pension";
  documents: string[];
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
    },
    benefits: "Full tuition fee + ₹1,200/month stipend",
    benefitsHi: "पूर्ण शुल्क + ₹1,200/माह वजीफा",
    status: "ongoing",
    type: "scholarship",
    documents: ["Caste Certificate", "Income Certificate", "Marksheet", "Bank Passbook", "Aadhaar Card"],
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
    },
    benefits: "₹6,000/year in 3 installments",
    benefitsHi: "3 किस्तों में ₹6,000/वर्ष",
    status: "ongoing",
    type: "welfare",
    documents: ["Aadhaar Card", "Land Records", "Bank Passbook"],
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
    },
    benefits: "₹12,000/year",
    benefitsHi: "₹12,000/वर्ष",
    status: "closing-soon",
    type: "scholarship",
    documents: ["Marksheet", "Income Certificate", "Aadhaar Card", "Bank Passbook"],
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
    },
    benefits: "₹1,000 - ₹5,000/month pension after 60",
    benefitsHi: "60 के बाद ₹1,000 - ₹5,000/माह पेंशन",
    status: "ongoing",
    type: "pension",
    documents: ["Aadhaar Card", "Bank Passbook", "Mobile Number"],
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
    },
    benefits: "8.2% interest rate + Tax benefits",
    benefitsHi: "8.2% ब्याज दर + कर लाभ",
    status: "new",
    type: "welfare",
    documents: ["Birth Certificate", "Aadhaar Card", "Parent's ID Proof", "Address Proof"],
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
    },
    benefits: "100 days work at ₹267/day (varies by state)",
    benefitsHi: "₹267/दिन पर 100 दिन का काम (राज्य के अनुसार भिन्न)",
    status: "ongoing",
    type: "welfare",
    documents: ["Aadhaar Card", "Ration Card", "Passport Photo", "Bank Passbook"],
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
    },
    benefits: "₹100-500/month + Book allowance",
    benefitsHi: "₹100-500/माह + पुस्तक भत्ता",
    status: "closing-soon",
    type: "scholarship",
    documents: ["OBC Certificate", "Income Certificate", "Marksheet", "Aadhaar Card"],
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
