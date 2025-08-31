// Indian states, districts, and villages data
const INDIAN_LOCATIONS = {
  "Uttar Pradesh": {
    "Muzaffarnagar": {
      villages: ["Khatauli", "Jansath", "Budhana", "Charthawal", "Shahpur", "Kairana", "Shamli", "Kandhla", "Thana Bhawan", "Baghra"],
      population: 4143512,
      rating: 3.8,
      schemes: ["PM-KISAN", "Ayushman Bharat", "MGNREGA", "Pradhan Mantri Awas Yojana", "Kisan Credit Card"]
    },
    "Shamli": {
      villages: ["Shamli", "Kairana", "Thanabhawan", "Kandhla", "Jhinjhana", "Babri", "Garhi Pukhta", "Lisarh", "Badshahpur", "Dhimanpura"],
      population: 1464228,
      rating: 3.6,
      schemes: ["PM-KISAN", "Ayushman Bharat", "MGNREGA", "Swachh Bharat Mission", "Digital India"]
    },
    "Baghpat": {
      villages: ["Baghpat", "Baraut", "Khekra", "Pilana", "Binauli", "Doghat", "Chaprauli", "Chhaprauli", "Khekada", "Tikri"],
      population: 1303048,
      rating: 3.7,
      schemes: ["PM-KISAN", "Ayushman Bharat", "MGNREGA", "Pradhan Mantri Fasal Bima Yojana", "Soil Health Card"]
    },
    "Meerut": {
      villages: ["Meerut", "Sardhana", "Daurala", "Parikshitgarh", "Rajpura", "Kharkhauda", "Rohta", "Jani Khurd", "Hastinapur", "Kithor"],
      population: 3443689,
      rating: 4.1,
      schemes: ["PM-KISAN", "Ayushman Bharat", "MGNREGA", "Smart City Mission", "Digital India", "Skill India"]
    },
    "Ghaziabad": {
      villages: ["Ghaziabad", "Loni", "Muradnagar", "Hapur", "Pilkhuwa", "Garh", "Bhojpur", "Dadri", "Tronica City", "Raj Nagar"],
      population: 4681645,
      rating: 4.2,
      schemes: ["PM-KISAN", "Ayushman Bharat", "MGNREGA", "Smart City Mission", "Digital India", "Startup India"]
    }
  },
  "Haryana": {
    "Panipat": {
      villages: ["Panipat", "Samalkha", "Israna", "Bapoli", "Madlauda", "Kanoli", "Sanauli", "Ugra Kheri", "Kurar", "Lalpur"],
      population: 1205437,
      rating: 4.0,
      schemes: ["PM-KISAN", "Ayushman Bharat", "MGNREGA", "Beti Bachao Beti Padhao", "Pradhan Mantri Mudra Yojana"]
    },
    "Karnal": {
      villages: ["Karnal", "Assandh", "Indri", "Nilokheri", "Gharaunda", "Ballah", "Kunjpura", "Taraori", "Kohand", "Nissing"],
      population: 1505324,
      rating: 4.1,
      schemes: ["PM-KISAN", "Ayushman Bharat", "MGNREGA", "National Food Security Mission", "Paramparagat Krishi Vikas Yojana"]
    }
  },
  "Punjab": {
    "Ludhiana": {
      villages: ["Ludhiana", "Khanna", "Samrala", "Payal", "Raikot", "Machhiwara", "Dehlon", "Doraha", "Sidhwan Bet", "Sudhar"],
      population: 3498739,
      rating: 4.3,
      schemes: ["PM-KISAN", "Ayushman Bharat", "MGNREGA", "National Food Security Mission", "Pradhan Mantri Fasal Bima Yojana"]
    },
    "Amritsar": {
      villages: ["Amritsar", "Tarn Taran", "Patti", "Khadoor Sahib", "Baba Bakala", "Rayya", "Majitha", "Bhikhiwind", "Jandiala Guru", "Lopoke"],
      population: 2490891,
      rating: 4.4,
      schemes: ["PM-KISAN", "Ayushman Bharat", "MGNREGA", "Swachh Bharat Mission", "Digital India"]
    }
  },
  "Rajasthan": {
    "Jaipur": {
      villages: ["Jaipur", "Chomu", "Phulera", "Dudu", "Mauzamabad", "Sambhar", "Kotputli", "Viratnagar", "Shahpura", "Bassi"],
      population: 6626178,
      rating: 4.0,
      schemes: ["PM-KISAN", "Ayushman Bharat", "MGNREGA", "Pradhan Mantri Awas Yojana", "Swachh Bharat Mission"]
    },
    "Jodhpur": {
      villages: ["Jodhpur", "Bilara", "Luni", "Bhopalgarh", "Osian", "Phalodi", "Shergarh", "Mandore", "Balesar", "Tinwari"],
      population: 3687165,
      rating: 3.9,
      schemes: ["PM-KISAN", "Ayushman Bharat", "MGNREGA", "Jal Jeevan Mission", "Solar Rooftop Scheme"]
    }
  }
};

class LocationService {
  constructor() {
    this.locations = INDIAN_LOCATIONS;
  }

  // Get all states
  getStates() {
    return Object.keys(this.locations);
  }

  // Get districts for a state
  getDistricts(state) {
    if (!state || !this.locations[state]) return [];
    return Object.keys(this.locations[state]);
  }

  // Get villages for a district
  getVillages(state, district) {
    if (!state || !district || !this.locations[state] || !this.locations[state][district]) return [];
    return this.locations[state][district].villages;
  }

  // Validate location
  validateLocation(state, district, village) {
    const errors = [];
    
    if (!state || !this.locations[state]) {
      errors.push('Invalid state selected');
      return { isValid: false, errors };
    }
    
    if (!district || !this.locations[state][district]) {
      errors.push('Invalid district for the selected state');
      return { isValid: false, errors };
    }
    
    if (!village || !this.locations[state][district].villages.includes(village)) {
      errors.push('Invalid village for the selected district');
      return { isValid: false, errors };
    }
    
    return { isValid: true, errors: [] };
  }

  // Get location data
  getLocationData(state, district, village) {
    const validation = this.validateLocation(state, district, village);
    if (!validation.isValid) {
      return null;
    }
    
    const districtData = this.locations[state][district];
    return {
      state,
      district,
      village,
      population: districtData.population,
      rating: districtData.rating,
      availableSchemes: districtData.schemes,
      isVerified: true
    };
  }

  // Search locations
  searchLocations(query, type = 'all') {
    const results = [];
    const searchQuery = query.toLowerCase();
    
    Object.keys(this.locations).forEach(state => {
      if (type === 'all' || type === 'states') {
        if (state.toLowerCase().includes(searchQuery)) {
          results.push({ type: 'state', name: state, fullPath: state });
        }
      }
      
      Object.keys(this.locations[state]).forEach(district => {
        if (type === 'all' || type === 'districts') {
          if (district.toLowerCase().includes(searchQuery)) {
            results.push({ 
              type: 'district', 
              name: district, 
              fullPath: `${district}, ${state}`,
              state: state 
            });
          }
        }
        
        if (type === 'all' || type === 'villages') {
          this.locations[state][district].villages.forEach(village => {
            if (village.toLowerCase().includes(searchQuery)) {
              results.push({ 
                type: 'village', 
                name: village, 
                fullPath: `${village}, ${district}, ${state}`,
                district: district,
                state: state 
              });
            }
          });
        }
      });
    });
    
    return results.slice(0, 10); // Limit to 10 results
  }

  // Get schemes for location
  getLocationSchemes(state, district) {
    if (!state || !district || !this.locations[state] || !this.locations[state][district]) {
      return [];
    }
    return this.locations[state][district].schemes;
  }

  // Check if user is eligible for schemes based on profile
  checkSchemeEligibility(userProfile) {
    const eligibleSchemes = [];
    
    if (!userProfile.state || !userProfile.district) {
      return { eligible: [], missing: ['Complete location information required'] };
    }
    
    const locationSchemes = this.getLocationSchemes(userProfile.state, userProfile.district);
    const missing = [];
    
    locationSchemes.forEach(scheme => {
      const eligibility = this.getSchemeEligibility(scheme, userProfile);
      if (eligibility.eligible) {
        eligibleSchemes.push({
          name: scheme,
          description: eligibility.description,
          benefits: eligibility.benefits,
          requirements: eligibility.requirements
        });
      } else {
        missing.push(...eligibility.missing);
      }
    });
    
    return { eligible: eligibleSchemes, missing: [...new Set(missing)] };
  }

  // Get scheme eligibility details
  getSchemeEligibility(scheme, userProfile) {
    const schemes = {
      "PM-KISAN": {
        description: "प्रधानमंत्री किसान सम्मान निधि योजना",
        benefits: "₹6000 प्रति वर्ष तीन किस्तों में",
        requirements: ["किसान होना चाहिए", "आधार कार्ड", "बैंक खाता", "भूमि के कागजात"],
        eligible: userProfile.occupation === 'farmer' || userProfile.landOwnership === 'yes',
        missing: userProfile.occupation !== 'farmer' ? ['Farmer occupation required'] : []
      },
      "Ayushman Bharat": {
        description: "आयुष्मान भारत प्रधानमंत्री जन आरोग्य योजना",
        benefits: "₹5 लाख तक का मुफ्त इलाज",
        requirements: ["आधार कार्ड", "राशन कार्ड", "आय प्रमाण पत्र"],
        eligible: userProfile.annualIncome <= 250000,
        missing: userProfile.annualIncome > 250000 ? ['Annual income should be ≤ ₹2.5 lakh'] : []
      },
      "MGNREGA": {
        description: "महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम",
        benefits: "100 दिन का गारंटीशुदा रोजगार",
        requirements: ["18+ वर्ष की आयु", "ग्रामीण निवासी", "जॉब कार्ड"],
        eligible: userProfile.age >= 18 && userProfile.areaType === 'rural',
        missing: userProfile.age < 18 ? ['Must be 18+ years old'] : userProfile.areaType !== 'rural' ? ['Must be rural resident'] : []
      },
      "Pradhan Mantri Awas Yojana": {
        description: "प्रधानमंत्री आवास योजना",
        benefits: "घर बनाने के लिए सब्सिडी",
        requirements: ["आधार कार्ड", "आय प्रमाण पत्र", "भूमि के कागजात"],
        eligible: userProfile.annualIncome <= 1800000 && userProfile.houseOwnership === 'no',
        missing: userProfile.houseOwnership === 'yes' ? ['Should not own a pucca house'] : userProfile.annualIncome > 1800000 ? ['Annual income should be ≤ ₹18 lakh'] : []
      }
    };
    
    return schemes[scheme] || { 
      description: scheme, 
      benefits: "विवरण उपलब्ध नहीं", 
      requirements: [], 
      eligible: false, 
      missing: ['Scheme details not available'] 
    };
  }
}

export const locationService = new LocationService();