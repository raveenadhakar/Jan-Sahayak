class HealthDataService {
    constructor() {
        // Health data endpoints
        this.endpoints = {
            // Ayushman Bharat - PM-JAY
            ayushmanBharat: 'https://pmjay.gov.in/api',

            // National Health Mission
            nhm: 'https://nhm.gov.in/api',

            // Health Management Information System
            hmis: 'https://hmis.nhp.gov.in/api',

            // Integrated Disease Surveillance Programme
            idsp: 'https://idsp.nic.in/api',

            // National Programme for Prevention and Control of Cancer, Diabetes, CVD and Stroke
            npcdcs: 'https://npcdcs.gov.in/api',

            // Janani Suraksha Yojana
            jsy: 'https://jsy.gov.in/api',

            // Rashtriya Swasthya Bima Yojana
            rsby: 'https://rsby.gov.in/api',

            // CoWIN (COVID Vaccination)
            cowin: 'https://cdn-api.co-vin.in/api',

            // National Health Portal
            nhp: 'https://nhp.gov.in/api'
        };

        this.apiKeys = {
            ayushmanBharat: import.meta.env.VITE_AYUSHMAN_BHARAT_API_KEY || '',
            nhm: import.meta.env.VITE_NHM_API_KEY || '',
            cowin: import.meta.env.VITE_COWIN_API_KEY || ''
        };

        // Health facility types
        this.facilityTypes = {
            hi: {
                'phc': 'प्राथमिक स्वास्थ्य केंद्र',
                'chc': 'सामुदायिक स्वास्थ्य केंद्र',
                'district_hospital': 'जिला अस्पताल',
                'medical_college': 'मेडिकल कॉलेज',
                'private_hospital': 'निजी अस्पताल',
                'dispensary': 'औषधालय',
                'anganwadi': 'आंगनवाड़ी केंद्र'
            },
            en: {
                'phc': 'Primary Health Centre',
                'chc': 'Community Health Centre',
                'district_hospital': 'District Hospital',
                'medical_college': 'Medical College',
                'private_hospital': 'Private Hospital',
                'dispensary': 'Dispensary',
                'anganwadi': 'Anganwadi Centre'
            },
            ur: {
                'phc': 'بنیادی صحت مرکز',
                'chc': 'کمیونٹی ہیلتھ سینٹر',
                'district_hospital': 'ضلعی ہسپتال',
                'medical_college': 'میڈیکل کالج',
                'private_hospital': 'پرائیویٹ ہسپتال',
                'dispensary': 'دوا خانہ',
                'anganwadi': 'آنگن واڑی مرکز'
            }
        };
    }

    // ==================== AYUSHMAN BHARAT ELIGIBILITY ====================

    async checkAyushmanBharatEligibility(familyId, rationCardNumber, language = 'hi') {
        try {
            const response = await fetch(
                `${this.endpoints.ayushmanBharat}/eligibility/check`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.apiKeys.ayushmanBharat}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        familyId,
                        rationCardNumber
                    })
                }
            );

            if (response.ok) {
                const data = await response.json();
                return this.formatAyushmanBharatEligibility(data, language);
            }

            return this.getMockAyushmanBharatEligibility(language);
        } catch (error) {
            console.error('Ayushman Bharat eligibility error:', error);
            return this.getMockAyushmanBharatEligibility(language);
        }
    }

    async getAyushmanBharatCard(familyId, language = 'hi') {
        try {
            const response = await fetch(
                `${this.endpoints.ayushmanBharat}/card/${familyId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKeys.ayushmanBharat}`,
                        'Accept': 'application/json'
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                return this.formatAyushmanBharatCard(data, language);
            }

            return this.getMockAyushmanBharatCard(language);
        } catch (error) {
            console.error('Ayushman Bharat card error:', error);
            return this.getMockAyushmanBharatCard(language);
        }
    }

    // ==================== HEALTH FACILITIES ====================

    async getNearbyHealthFacilities(district, state, facilityType = 'all', language = 'hi') {
        try {
            const response = await fetch(
                `${this.endpoints.nhm}/facilities/${state}/${district}?type=${facilityType}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKeys.nhm}`,
                        'Accept': 'application/json'
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                return this.formatHealthFacilities(data, language);
            }

            return this.getMockHealthFacilities(language);
        } catch (error) {
            console.error('Health facilities error:', error);
            return this.getMockHealthFacilities(language);
        }
    }

    async getHealthFacilityDetails(facilityId, language = 'hi') {
        try {
            const response = await fetch(
                `${this.endpoints.nhm}/facility/${facilityId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKeys.nhm}`,
                        'Accept': 'application/json'
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                return this.formatHealthFacilityDetails(data, language);
            }

            return this.getMockHealthFacilityDetails(language);
        } catch (error) {
            console.error('Health facility details error:', error);
            return this.getMockHealthFacilityDetails(language);
        }
    }

    // ==================== VACCINATION INFORMATION ====================

    async getVaccinationCenters(district, state, language = 'hi') {
        try {
            const response = await fetch(
                `${this.endpoints.cowin}/v2/admin/location/districts/${district}`,
                {
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                return this.formatVaccinationCenters(data, language);
            }

            return this.getMockVaccinationCenters(language);
        } catch (error) {
            console.error('Vaccination centers error:', error);
            return this.getMockVaccinationCenters(language);
        }
    }

    async getVaccinationSchedule(centerId, date, language = 'hi') {
        try {
            const response = await fetch(
                `${this.endpoints.cowin}/v2/appointment/sessions/public/calendarByCenter?center_id=${centerId}&date=${date}`,
                {
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                return this.formatVaccinationSchedule(data, language);
            }

            return this.getMockVaccinationSchedule(language);
        } catch (error) {
            console.error('Vaccination schedule error:', error);
            return this.getMockVaccinationSchedule(language);
        }
    }

    // ==================== HEALTH SCHEMES ====================

    async getHealthSchemes(state, district, category = 'all', language = 'hi') {
        try {
            const response = await fetch(
                `${this.endpoints.nhm}/schemes/${state}/${district}?category=${category}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKeys.nhm}`,
                        'Accept': 'application/json'
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                return this.formatHealthSchemes(data, language);
            }

            return this.getMockHealthSchemes(language);
        } catch (error) {
            console.error('Health schemes error:', error);
            return this.getMockHealthSchemes(language);
        }
    }

    // ==================== MATERNAL & CHILD HEALTH ====================

    async getMaternalChildHealthServices(district, state, language = 'hi') {
        try {
            const response = await fetch(
                `${this.endpoints.nhm}/mch/${state}/${district}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKeys.nhm}`,
                        'Accept': 'application/json'
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                return this.formatMaternalChildHealthServices(data, language);
            }

            return this.getMockMaternalChildHealthServices(language);
        } catch (error) {
            console.error('Maternal child health services error:', error);
            return this.getMockMaternalChildHealthServices(language);
        }
    }

    // ==================== DISEASE SURVEILLANCE ====================

    async getDiseaseAlerts(district, state, language = 'hi') {
        try {
            const response = await fetch(
                `${this.endpoints.idsp}/alerts/${state}/${district}`,
                {
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                return this.formatDiseaseAlerts(data, language);
            }

            return this.getMockDiseaseAlerts(language);
        } catch (error) {
            console.error('Disease alerts error:', error);
            return this.getMockDiseaseAlerts(language);
        }
    }

    // ==================== FORMATTING FUNCTIONS ====================

    formatAyushmanBharatEligibility(data, language) {
        const translations = {
            hi: {
                eligible: 'पात्र',
                not_eligible: 'अपात्र',
                pending: 'लंबित',
                active: 'सक्रिय',
                blocked: 'अवरुद्ध'
            },
            en: {
                eligible: 'Eligible',
                not_eligible: 'Not Eligible',
                pending: 'Pending',
                active: 'Active',
                blocked: 'Blocked'
            },
            ur: {
                eligible: 'اہل',
                not_eligible: 'غیر اہل',
                pending: 'زیر التواء',
                active: 'فعال',
                blocked: 'مسدود'
            }
        };

        const t = translations[language] || translations.hi;

        return {
            eligibility: {
                status: data.eligible ? 'eligible' : 'not_eligible',
                localizedStatus: data.eligible ? t.eligible : t.not_eligible,
                familyId: data.familyId || data.family_id,
                coverageAmount: data.coverageAmount || 500000,
                beneficiaries: (data.beneficiaries || []).map(b => ({
                    name: b.name,
                    age: b.age,
                    gender: b.gender,
                    relation: b.relation,
                    status: b.status || 'active',
                    localizedStatus: t[b.status] || b.status
                }))
            },
            card: {
                issued: data.cardIssued || false,
                cardNumber: data.cardNumber || data.card_number,
                issueDate: data.issueDate || data.issue_date,
                validTill: data.validTill || data.valid_till
            },
            hospitals: {
                empanelled: data.empanelledHospitals || data.empanelled_hospitals || 0,
                nearby: data.nearbyHospitals || data.nearby_hospitals || []
            },
            lastUpdated: new Date().toISOString()
        };
    }

    formatAyushmanBharatCard(data, language) {
        return {
            card: {
                familyId: data.familyId || data.family_id,
                cardNumber: data.cardNumber || data.card_number,
                issueDate: data.issueDate || data.issue_date,
                validTill: data.validTill || data.valid_till,
                qrCode: data.qrCode || data.qr_code,
                downloadUrl: data.downloadUrl || data.download_url
            },
            family: {
                headName: data.headName || data.head_name,
                address: data.address,
                members: (data.members || []).map(member => ({
                    name: member.name,
                    age: member.age,
                    gender: member.gender,
                    relation: member.relation,
                    photo: member.photo
                }))
            },
            coverage: {
                amount: data.coverageAmount || 500000,
                utilized: data.utilizedAmount || 0,
                balance: (data.coverageAmount || 500000) - (data.utilizedAmount || 0),
                claims: data.totalClaims || 0
            },
            lastUpdated: new Date().toISOString()
        };
    }

    formatHealthFacilities(data, language) {
        const facilities = this.facilityTypes[language] || this.facilityTypes.hi;

        return {
            facilities: (data.facilities || []).map(facility => ({
                id: facility.id,
                name: facility.name,
                type: facility.type,
                localizedType: facilities[facility.type] || facility.type,
                address: facility.address,
                district: facility.district,
                state: facility.state,
                pincode: facility.pincode,
                phone: facility.phone,
                services: facility.services || [],
                timings: facility.timings || {},
                distance: facility.distance || 0,
                rating: facility.rating || 0,
                ayushmanEmpanelled: facility.ayushmanEmpanelled || false
            })),
            summary: {
                total: (data.facilities || []).length,
                byType: this.groupFacilitiesByType(data.facilities || []),
                ayushmanEmpanelled: (data.facilities || []).filter(f => f.ayushmanEmpanelled).length
            },
            lastUpdated: new Date().toISOString()
        };
    }

    formatHealthFacilityDetails(data, language) {
        const facilities = this.facilityTypes[language] || this.facilityTypes.hi;

        return {
            facility: {
                id: data.id,
                name: data.name,
                type: data.type,
                localizedType: facilities[data.type] || data.type,
                address: data.address,
                contact: {
                    phone: data.phone,
                    email: data.email,
                    website: data.website
                },
                location: {
                    latitude: data.latitude,
                    longitude: data.longitude,
                    directions: data.directions
                }
            },
            services: {
                available: data.services || [],
                specialties: data.specialties || [],
                equipment: data.equipment || [],
                ambulance: data.ambulanceAvailable || false
            },
            staff: {
                doctors: data.doctorCount || 0,
                nurses: data.nurseCount || 0,
                paramedical: data.paramedicalCount || 0,
                specialists: data.specialists || []
            },
            timings: {
                opd: data.opdTimings || {},
                emergency: data.emergencyTimings || {},
                pharmacy: data.pharmacyTimings || {}
            },
            schemes: {
                ayushmanBharat: data.ayushmanEmpanelled || false,
                jsy: data.jsyAvailable || false,
                rsby: data.rsbyAvailable || false,
                stateSchemes: data.stateSchemes || []
            },
            lastUpdated: new Date().toISOString()
        };
    }

    formatVaccinationCenters(data, language) {
        return {
            centers: (data.centers || []).map(center => ({
                id: center.center_id,
                name: center.name,
                address: center.address,
                district: center.district_name,
                state: center.state_name,
                pincode: center.pincode,
                feeType: center.fee_type,
                timings: center.from + ' - ' + center.to,
                vaccines: center.vaccine_fees || []
            })),
            totalCenters: (data.centers || []).length,
            lastUpdated: new Date().toISOString()
        };
    }

    formatVaccinationSchedule(data, language) {
        return {
            center: {
                id: data.center_id,
                name: data.name,
                address: data.address
            },
            sessions: (data.sessions || []).map(session => ({
                date: session.date,
                availableCapacity: session.available_capacity,
                minAgeLimit: session.min_age_limit,
                vaccine: session.vaccine,
                slots: session.slots || [],
                availableCapacityDose1: session.available_capacity_dose1,
                availableCapacityDose2: session.available_capacity_dose2
            })),
            lastUpdated: new Date().toISOString()
        };
    }

    formatHealthSchemes(data, language) {
        const translations = {
            hi: {
                maternal: 'मातृत्व',
                child: 'बाल स्वास्थ्य',
                family_planning: 'परिवार नियोजन',
                immunization: 'टीकाकरण',
                nutrition: 'पोषण',
                communicable_diseases: 'संक्रामक रोग',
                non_communicable_diseases: 'गैर-संक्रामक रोग'
            },
            en: {
                maternal: 'Maternal Health',
                child: 'Child Health',
                family_planning: 'Family Planning',
                immunization: 'Immunization',
                nutrition: 'Nutrition',
                communicable_diseases: 'Communicable Diseases',
                non_communicable_diseases: 'Non-Communicable Diseases'
            },
            ur: {
                maternal: 'زچگی کی صحت',
                child: 'بچوں کی صحت',
                family_planning: 'خاندانی منصوبہ بندی',
                immunization: 'ویکسینیشن',
                nutrition: 'غذائیت',
                communicable_diseases: 'متعدی بیماریاں',
                non_communicable_diseases: 'غیر متعدی بیماریاں'
            }
        };

        const t = translations[language] || translations.hi;

        return {
            schemes: (data.schemes || []).map(scheme => ({
                id: scheme.id,
                name: scheme.name,
                category: scheme.category,
                localizedCategory: t[scheme.category] || scheme.category,
                description: scheme.description,
                eligibility: scheme.eligibility || [],
                benefits: scheme.benefits || [],
                applicationProcess: scheme.applicationProcess || scheme.application_process,
                documents: scheme.documents || [],
                contactInfo: scheme.contactInfo || scheme.contact_info
            })),
            categories: Object.keys(t),
            totalSchemes: (data.schemes || []).length,
            lastUpdated: new Date().toISOString()
        };
    }

    formatMaternalChildHealthServices(data, language) {
        return {
            services: {
                antenatal: data.antenatalServices || [],
                delivery: data.deliveryServices || [],
                postnatal: data.postnatalServices || [],
                childHealth: data.childHealthServices || [],
                immunization: data.immunizationServices || [],
                nutrition: data.nutritionServices || []
            },
            facilities: {
                anganwadi: data.anganwadiCenters || 0,
                phc: data.phcCenters || 0,
                chc: data.chcCenters || 0,
                hospitals: data.hospitals || 0
            },
            schemes: {
                jsy: data.jsyBeneficiaries || 0,
                pmmvy: data.pmmvyBeneficiaries || 0,
                rbsk: data.rbskScreenings || 0
            },
            statistics: {
                birthRate: data.birthRate || 0,
                infantMortalityRate: data.infantMortalityRate || 0,
                maternalMortalityRate: data.maternalMortalityRate || 0,
                immunizationCoverage: data.immunizationCoverage || 0
            },
            lastUpdated: new Date().toISOString()
        };
    }

    formatDiseaseAlerts(data, language) {
        const translations = {
            hi: {
                outbreak: 'प्रकोप',
                epidemic: 'महामारी',
                endemic: 'स्थानिक',
                low: 'कम',
                medium: 'मध्यम',
                high: 'उच्च',
                critical: 'गंभीर'
            },
            en: {
                outbreak: 'Outbreak',
                epidemic: 'Epidemic',
                endemic: 'Endemic',
                low: 'Low',
                medium: 'Medium',
                high: 'High',
                critical: 'Critical'
            },
            ur: {
                outbreak: 'پھیلاؤ',
                epidemic: 'وبا',
                endemic: 'مقامی',
                low: 'کم',
                medium: 'درمیانہ',
                high: 'زیادہ',
                critical: 'سنگین'
            }
        };

        const t = translations[language] || translations.hi;

        return {
            alerts: (data.alerts || []).map(alert => ({
                id: alert.id,
                disease: alert.disease,
                type: alert.type,
                localizedType: t[alert.type] || alert.type,
                severity: alert.severity,
                localizedSeverity: t[alert.severity] || alert.severity,
                affectedAreas: alert.affectedAreas || alert.affected_areas || [],
                cases: alert.cases || 0,
                deaths: alert.deaths || 0,
                description: alert.description,
                preventiveMeasures: alert.preventiveMeasures || alert.preventive_measures || [],
                reportedDate: alert.reportedDate || alert.reported_date,
                lastUpdated: alert.lastUpdated || alert.last_updated
            })),
            summary: {
                totalAlerts: (data.alerts || []).length,
                bySeverity: this.groupAlertsBySeverity(data.alerts || []),
                byDisease: this.groupAlertsByDisease(data.alerts || [])
            },
            lastUpdated: new Date().toISOString()
        };
    }

    // ==================== MOCK DATA FUNCTIONS ====================

    getMockAyushmanBharatEligibility(language) {
        const mockData = {
            eligible: true,
            familyId: 'AB123456789',
            coverageAmount: 500000,
            beneficiaries: [
                {
                    name: language === 'hi' ? 'राम कुमार' : 'Ram Kumar',
                    age: 45,
                    gender: 'Male',
                    relation: language === 'hi' ? 'मुखिया' : 'Head',
                    status: 'active'
                },
                {
                    name: language === 'hi' ? 'सीता देवी' : 'Sita Devi',
                    age: 40,
                    gender: 'Female',
                    relation: language === 'hi' ? 'पत्नी' : 'Wife',
                    status: 'active'
                }
            ],
            cardIssued: true,
            cardNumber: 'AB123456789',
            issueDate: '2019-04-15',
            validTill: '2024-04-15',
            empanelledHospitals: 25000,
            nearbyHospitals: [
                {
                    name: language === 'hi' ? 'जिला अस्पताल मुजफ्फरनगर' : 'District Hospital Muzaffarnagar',
                    distance: 5,
                    type: 'Government'
                }
            ]
        };

        return this.formatAyushmanBharatEligibility(mockData, language);
    }

    getMockAyushmanBharatCard(language) {
        const mockData = {
            familyId: 'AB123456789',
            cardNumber: 'AB123456789',
            issueDate: '2019-04-15',
            validTill: '2024-04-15',
            headName: language === 'hi' ? 'राम कुमार' : 'Ram Kumar',
            address: language === 'hi' ? 'गांव - रामपुर, मुजफ्फरनगर, उत्तर प्रदेश' : 'Village - Rampur, Muzaffarnagar, Uttar Pradesh',
            members: [
                {
                    name: language === 'hi' ? 'राम कुमार' : 'Ram Kumar',
                    age: 45,
                    gender: 'Male',
                    relation: language === 'hi' ? 'मुखिया' : 'Head'
                },
                {
                    name: language === 'hi' ? 'सीता देवी' : 'Sita Devi',
                    age: 40,
                    gender: 'Female',
                    relation: language === 'hi' ? 'पत्नी' : 'Wife'
                }
            ],
            coverageAmount: 500000,
            utilizedAmount: 25000,
            totalClaims: 2
        };

        return this.formatAyushmanBharatCard(mockData, language);
    }

    getMockHealthFacilities(language) {
        const mockData = {
            facilities: [
                {
                    id: 'HF001',
                    name: language === 'hi' ? 'प्राथमिक स्वास्थ्य केंद्र मुख्य बाजार' : 'Primary Health Centre Main Market',
                    type: 'phc',
                    address: language === 'hi' ? 'मुख्य बाजार, मुजफ्फरनगर' : 'Main Market, Muzaffarnagar',
                    district: language === 'hi' ? 'मुजफ्फरनगर' : 'Muzaffarnagar',
                    state: language === 'hi' ? 'उत्तर प्रदेश' : 'Uttar Pradesh',
                    pincode: '251001',
                    phone: '0131-2345678',
                    services: [
                        language === 'hi' ? 'OPD सेवा' : 'OPD Service',
                        language === 'hi' ? 'प्रसव सेवा' : 'Delivery Service',
                        language === 'hi' ? 'टीकाकरण' : 'Immunization'
                    ],
                    distance: 2.5,
                    rating: 4.2,
                    ayushmanEmpanelled: true
                },
                {
                    id: 'HF002',
                    name: language === 'hi' ? 'जिला अस्पताल मुजफ्फरनगर' : 'District Hospital Muzaffarnagar',
                    type: 'district_hospital',
                    address: language === 'hi' ? 'सिविल लाइन्स, मुजफ्फरनगर' : 'Civil Lines, Muzaffarnagar',
                    district: language === 'hi' ? 'मुजफ्फरनगर' : 'Muzaffarnagar',
                    state: language === 'hi' ? 'उत्तर प्रदेश' : 'Uttar Pradesh',
                    pincode: '251001',
                    phone: '0131-2654321',
                    services: [
                        language === 'hi' ? 'आपातकालीन सेवा' : 'Emergency Service',
                        language === 'hi' ? 'सर्जरी' : 'Surgery',
                        language === 'hi' ? 'विशेषज्ञ सेवा' : 'Specialist Service'
                    ],
                    distance: 5.0,
                    rating: 4.5,
                    ayushmanEmpanelled: true
                }
            ]
        };

        return this.formatHealthFacilities(mockData, language);
    }

    getMockHealthFacilityDetails(language) {
        const mockData = {
            id: 'HF001',
            name: language === 'hi' ? 'प्राथमिक स्वास्थ्य केंद्र मुख्य बाजार' : 'Primary Health Centre Main Market',
            type: 'phc',
            address: language === 'hi' ? 'मुख्य बाजार, मुजफ्फरनगर, उत्तर प्रदेश - 251001' : 'Main Market, Muzaffarnagar, Uttar Pradesh - 251001',
            phone: '0131-2345678',
            email: 'phc.mainmarket@up.gov.in',
            latitude: 29.4726,
            longitude: 77.7085,
            services: [
                language === 'hi' ? 'OPD सेवा' : 'OPD Service',
                language === 'hi' ? 'प्रसव सेवा' : 'Delivery Service',
                language === 'hi' ? 'टीकाकरण' : 'Immunization',
                language === 'hi' ? 'परिवार नियोजन' : 'Family Planning'
            ],
            specialties: [
                language === 'hi' ? 'सामान्य चिकित्सा' : 'General Medicine',
                language === 'hi' ? 'स्त्री रोग' : 'Gynecology',
                language === 'hi' ? 'बाल रोग' : 'Pediatrics'
            ],
            equipment: [
                language === 'hi' ? 'X-Ray मशीन' : 'X-Ray Machine',
                language === 'hi' ? 'ECG मशीन' : 'ECG Machine',
                language === 'hi' ? 'अल्ट्रासाउंड' : 'Ultrasound'
            ],
            doctorCount: 3,
            nurseCount: 8,
            paramedicalCount: 5,
            opdTimings: {
                monday_friday: '9:00 AM - 5:00 PM',
                saturday: '9:00 AM - 1:00 PM',
                sunday: 'Closed'
            },
            emergencyTimings: {
                all_days: '24x7'
            },
            ayushmanEmpanelled: true,
            jsyAvailable: true,
            ambulanceAvailable: true
        };

        return this.formatHealthFacilityDetails(mockData, language);
    }

    getMockVaccinationCenters(language) {
        const mockData = {
            centers: [
                {
                    center_id: 123456,
                    name: language === 'hi' ? 'सामुदायिक स्वास्थ्य केंद्र' : 'Community Health Centre',
                    address: language === 'hi' ? 'मुख्य बाजार मुजफ्फरनगर' : 'Main Market Muzaffarnagar',
                    district_name: language === 'hi' ? 'मुजफ्फरनगर' : 'Muzaffarnagar',
                    state_name: language === 'hi' ? 'उत्तर प्रदेश' : 'Uttar Pradesh',
                    pincode: '251001',
                    fee_type: 'Free',
                    from: '09:00:00',
                    to: '17:00:00'
                }
            ]
        };

        return this.formatVaccinationCenters(mockData, language);
    }

    getMockVaccinationSchedule(language) {
        const mockData = {
            center_id: 123456,
            name: language === 'hi' ? 'सामुदायिक स्वास्थ्य केंद्र' : 'Community Health Centre',
            address: language === 'hi' ? 'मुख्य बाजार मुजफ्फरनगर' : 'Main Market Muzaffarnagar',
            sessions: [
                {
                    date: new Date().toISOString().split('T')[0],
                    available_capacity: 100,
                    min_age_limit: 18,
                    vaccine: 'COVISHIELD',
                    slots: ['09:00AM-11:00AM', '11:00AM-01:00PM', '02:00PM-04:00PM'],
                    available_capacity_dose1: 50,
                    available_capacity_dose2: 50
                }
            ]
        };

        return this.formatVaccinationSchedule(mockData, language);
    }

    getMockHealthSchemes(language) {
        const mockData = {
            schemes: [
                {
                    id: 'JSY001',
                    name: language === 'hi' ? 'जननी सुरक्षा योजना' : 'Janani Suraksha Yojana',
                    category: 'maternal',
                    description: language === 'hi' ?
                        'गर्भवती महिलाओं को प्रसव के लिए आर्थिक सहायता' :
                        'Financial assistance to pregnant women for delivery',
                    eligibility: [
                        language === 'hi' ? 'BPL परिवार की महिला' : 'Women from BPL families',
                        language === 'hi' ? '19 वर्ष से अधिक आयु' : 'Age above 19 years'
                    ],
                    benefits: [
                        language === 'hi' ? 'ग्रामीण क्षेत्र: ₹1,400' : 'Rural area: ₹1,400',
                        language === 'hi' ? 'शहरी क्षेत्र: ₹1,000' : 'Urban area: ₹1,000'
                    ],
                    applicationProcess: language === 'hi' ?
                        'नजदीकी आंगनवाड़ी केंद्र या PHC में संपर्क करें' :
                        'Contact nearest Anganwadi centre or PHC'
                },
                {
                    id: 'PMMVY001',
                    name: language === 'hi' ? 'प्रधानमंत्री मातृ वंदना योजना' : 'Pradhan Mantri Matru Vandana Yojana',
                    category: 'maternal',
                    description: language === 'hi' ?
                        'गर्भवती और स्तनपान कराने वाली महिलाओं के लिए नकद प्रोत्साहन' :
                        'Cash incentive for pregnant and lactating women',
                    eligibility: [
                        language === 'hi' ? 'पहली संतान के लिए' : 'For first child',
                        language === 'hi' ? '18 वर्ष से अधिक आयु' : 'Age above 18 years'
                    ],
                    benefits: [
                        language === 'hi' ? 'कुल ₹5,000 तीन किस्तों में' : 'Total ₹5,000 in three installments'
                    ]
                }
            ]
        };

        return this.formatHealthSchemes(mockData, language);
    }

    getMockMaternalChildHealthServices(language) {
        const mockData = {
            antenatalServices: [
                language === 'hi' ? 'गर्भावस्था जांच' : 'Pregnancy checkup',
                language === 'hi' ? 'टेटनस टीकाकरण' : 'Tetanus vaccination',
                language === 'hi' ? 'आयरन फोलिक एसिड गोलियां' : 'Iron Folic Acid tablets'
            ],
            deliveryServices: [
                language === 'hi' ? 'संस्थागत प्रसव' : 'Institutional delivery',
                language === 'hi' ? 'कुशल प्रसव सहायक' : 'Skilled birth attendant',
                language === 'hi' ? '24x7 प्रसव सेवा' : '24x7 delivery service'
            ],
            childHealthServices: [
                language === 'hi' ? 'नवजात देखभाल' : 'Newborn care',
                language === 'hi' ? 'वृद्धि निगरानी' : 'Growth monitoring',
                language === 'hi' ? 'पोषण परामर्श' : 'Nutrition counseling'
            ],
            anganwadiCenters: 150,
            phcCenters: 25,
            chcCenters: 5,
            hospitals: 3,
            jsyBeneficiaries: 2500,
            pmmvyBeneficiaries: 1200,
            birthRate: 22.5,
            infantMortalityRate: 32,
            immunizationCoverage: 85.6
        };

        return this.formatMaternalChildHealthServices(mockData, language);
    }

    getMockDiseaseAlerts(language) {
        const mockData = {
            alerts: [
                {
                    id: 'DA001',
                    disease: language === 'hi' ? 'डेंगू' : 'Dengue',
                    type: 'outbreak',
                    severity: 'medium',
                    affectedAreas: [
                        language === 'hi' ? 'मुख्य बाजार क्षेत्र' : 'Main Market Area',
                        language === 'hi' ? 'सिविल लाइन्स' : 'Civil Lines'
                    ],
                    cases: 45,
                    deaths: 0,
                    description: language === 'hi' ?
                        'डेंगू के मामलों में वृद्धि देखी गई है' :
                        'Increase in dengue cases observed',
                    preventiveMeasures: [
                        language === 'hi' ? 'पानी का जमाव न होने दें' : 'Prevent water stagnation',
                        language === 'hi' ? 'मच्छरदानी का उपयोग करें' : 'Use mosquito nets',
                        language === 'hi' ? 'बुखार होने पर तुरंत डॉक्टर से मिलें' : 'Consult doctor immediately if fever'
                    ],
                    reportedDate: '2024-12-01'
                }
            ]
        };

        return this.formatDiseaseAlerts(mockData, language);
    }

    // ==================== UTILITY FUNCTIONS ====================

    groupFacilitiesByType(facilities) {
        return facilities.reduce((acc, facility) => {
            const type = facility.type || 'other';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});
    }

    groupAlertsBySeverity(alerts) {
        return alerts.reduce((acc, alert) => {
            const severity = alert.severity || 'low';
            acc[severity] = (acc[severity] || 0) + 1;
            return acc;
        }, {});
    }

    groupAlertsByDisease(alerts) {
        return alerts.reduce((acc, alert) => {
            const disease = alert.disease || 'other';
            acc[disease] = (acc[disease] || 0) + 1;
            return acc;
        }, {});
    }

    async testConnectivity() {
        const results = {
            ayushmanBharat: false,
            nhm: false,
            cowin: false
        };

        // Test CoWIN API (public endpoint)
        try {
            const response = await fetch('https://cdn-api.co-vin.in/api/v2/admin/location/states');
            results.cowin = response.ok;
        } catch (error) {
            console.error('CoWIN API test failed:', error);
        }

        // Test other APIs would require valid endpoints and keys

        return results;
    }
}

export const healthDataService = new HealthDataService();