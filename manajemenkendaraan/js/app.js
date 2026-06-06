/**
 * TRAFFIC MANAGEMENT SYSTEM - Core App Utilities
 * Shared functionality for storage, helpers, and common operations
 */

class TrafficApp {
    constructor() {
        this.storageKey = 'traffic_surveys';
        this.gpsKey = 'current_gps_location';
        this.init();
    }

    init() {
        this.setupConnectionListener();
        this.detectOS();
    }

    // ===== STORAGE MANAGEMENT =====
    
    /**
     * Save survey data to localStorage
     */
    saveSurvey(surveyData) {
        try {
            const surveys = this.getAllSurveys();
            surveyData.id = Date.now();
            surveyData.timestamp = new Date().toISOString();
            surveyData.synced = false;
            surveys.push(surveyData);
            localStorage.setItem(this.storageKey, JSON.stringify(surveys));
            console.log('✓ Survey saved:', surveyData);
            return surveyData;
        } catch (error) {
            console.error('Error saving survey:', error);
            throw error;
        }
    }

    /**
     * Get all surveys from localStorage
     */
    getAllSurveys() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading surveys:', error);
            return [];
        }
    }

    /**
     * Get filtered surveys based on criteria
     */
    getFilteredSurveys(filters = {}) {
        let surveys = this.getAllSurveys();

        if (filters.date) {
            surveys = surveys.filter(s => {
                const surveyDate = new Date(s.timestamp).toISOString().split('T')[0];
                return surveyDate === filters.date;
            });
        }

        if (filters.truckType && filters.truckType !== '') {
            surveys = surveys.filter(s => s.truckType === filters.truckType);
        }

        if (filters.weightCategory && filters.weightCategory !== '') {
            surveys = surveys.filter(s => s.weightCategory === filters.weightCategory);
        }

        if (filters.plateNumber) {
            const query = filters.plateNumber.toLowerCase();
            surveys = surveys.filter(s => s.plateNumber.toLowerCase().includes(query));
        }

        // Sort by timestamp descending (newest first)
        surveys.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        return surveys;
    }

    /**
     * Delete survey by ID
     */
    deleteSurvey(surveyId) {
        try {
            const surveys = this.getAllSurveys().filter(s => s.id !== surveyId);
            localStorage.setItem(this.storageKey, JSON.stringify(surveys));
            console.log('✓ Survey deleted:', surveyId);
        } catch (error) {
            console.error('Error deleting survey:', error);
        }
    }

    /**
     * Clear all surveys (warning: irreversible)
     */
    clearAllSurveys() {
        if (confirm('Yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan!')) {
            localStorage.removeItem(this.storageKey);
            console.log('✓ All surveys cleared');
            return true;
        }
        return false;
    }

    // ===== GPS LOCATION HANDLING =====

    /**
     * Get current GPS location
     */
    getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject('Geolocation tidak tersedia di browser ini');
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: new Date().toISOString()
                    };
                    localStorage.setItem(this.gpsKey, JSON.stringify(location));
                    resolve(location);
                },
                (error) => {
                    console.error('GPS Error:', error);
                    reject(error.message);
                },
                { 
                    enableHighAccuracy: true, 
                    timeout: 10000, 
                    maximumAge: 0 
                }
            );
        });
    }

    /**
     * Get location name from coordinates (simple mapping)
     */
    getLocationName(lat, lng) {
        // Simple location mapping for demo (in production, use reverse geocoding API)
        const locations = {
            'pusat': { lat: -6.2088, lng: 106.8456 },
            'pelabuhan': { lat: -6.1256, lng: 106.9613 },
            'industri': { lat: -6.2450, lng: 106.9000 },
            'airport': { lat: -6.1256, lng: 106.6590 },
        };

        // Find closest location
        let closest = 'Jakarta';
        let minDistance = Infinity;

        for (const [name, coords] of Object.entries(locations)) {
            const distance = this.calculateDistance(lat, lng, coords.lat, coords.lng);
            if (distance < minDistance) {
                minDistance = distance;
                closest = name.charAt(0).toUpperCase() + name.slice(1);
            }
        }

        return closest;
    }

    /**
     * Calculate distance between two coordinates (Haversine formula)
     */
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    // ===== AUTHENTICATION =====

    getSessionUser() {
        const sessionData = localStorage.getItem('traffic_user_session');
        return sessionData ? JSON.parse(sessionData) : null;
    }

    setSessionUser(user) {
        localStorage.setItem('traffic_user_session', JSON.stringify(user));
    }

    clearSession() {
        localStorage.removeItem('traffic_user_session');
    }

    isAuthenticated() {
        return !!this.getSessionUser();
    }

    hasRole(role) {
        const user = this.getSessionUser();
        return user ? user.role === role : false;
    }

    classifyVehicle(weightCategory, truckType) {
        const weightLabels = {
            '5-10': 'Ringan',
            '10-20': 'Sedang',
            '20-30': 'Berat',
            '30+': 'Sangat Berat'
        };

        return {
            label: weightLabels[weightCategory] || 'Tidak Diketahui',
            description: `Jenis: ${this.getTruckTypeLabel(truckType)}, Kategori Berat: ${weightLabels[weightCategory] || 'Tidak Diketahui'}`
        };
    }

    // ===== CONNECTION DETECTION =====

    /**
     * Setup connection status listener
     */
    setupConnectionListener() {
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
    }

    /**
     * Handle when device comes online
     */
    handleOnline() {
        console.log('✓ Connection restored');
        this.updateConnectionStatus('online');
        this.syncPendingData();
    }

    /**
     * Handle when device goes offline
     */
    handleOffline() {
        console.log('✗ Connection lost');
        this.updateConnectionStatus('offline');
    }

    /**
     * Update connection status in UI
     */
    updateConnectionStatus(status) {
        const statusElements = document.querySelectorAll('.connection-status');
        statusElements.forEach(el => {
            el.classList.remove('online', 'offline');
            el.classList.add(status);
            el.querySelector('.status-text').textContent = status === 'online' ? 'Online' : 'Offline';
        });
    }

    /**
     * Check if currently online
     */
    isOnline() {
        return navigator.onLine;
    }

    /**
     * Sync pending data (when coming back online)
     */
    syncPendingData() {
        const surveys = this.getAllSurveys();
        const pending = surveys.filter(s => !s.synced);
        
        if (pending.length > 0) {
            console.log(`Syncing ${pending.length} pending surveys...`);
            // In production, send to server
            pending.forEach(s => {
                s.synced = true;
            });
            localStorage.setItem(this.storageKey, JSON.stringify(surveys));
            console.log('✓ Sync complete');
        }
    }

    // ===== DATA ANALYTICS =====

    /**
     * Get today's truck count
     */
    getTodayCount() {
        const today = new Date().toISOString().split('T')[0];
        const surveys = this.getAllSurveys();
        return surveys.filter(s => s.timestamp.split('T')[0] === today).length;
    }

    /**
     * Get total truck count
     */
    getTotalCount() {
        return this.getAllSurveys().length;
    }

    /**
     * Calculate average weight
     */
    getAverageWeight() {
        const surveys = this.getAllSurveys();
        if (surveys.length === 0) return 0;

        const weights = {
            '5-10': 7.5,
            '10-20': 15,
            '20-30': 25,
            '30+': 35
        };

        const total = surveys.reduce((sum, s) => {
            return sum + (weights[s.weightCategory] || 0);
        }, 0);

        return (total / surveys.length).toFixed(1);
    }

    /**
     * Get top routes
     */
    getTopRoutes(limit = 10) {
        const surveys = this.getAllSurveys();
        const routeMap = {};

        surveys.forEach(s => {
            const route = `${s.origin} → ${s.destination}`;
            routeMap[route] = (routeMap[route] || 0) + 1;
        });

        return Object.entries(routeMap)
            .map(([route, count]) => ({ route, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }

    /**
     * Get weight distribution
     */
    getWeightDistribution() {
        const surveys = this.getAllSurveys();
        const distribution = {
            '5-10': 0,
            '10-20': 0,
            '20-30': 0,
            '30+': 0
        };

        surveys.forEach(s => {
            if (distribution.hasOwnProperty(s.weightCategory)) {
                distribution[s.weightCategory]++;
            }
        });

        return distribution;
    }

    /**
     * Get peak traffic hour
     */
    getPeakHour() {
        const surveys = this.getAllSurveys();
        const hourMap = {};

        surveys.forEach(s => {
            const hour = new Date(s.timestamp).getHours();
            hourMap[hour] = (hourMap[hour] || 0) + 1;
        });

        if (Object.keys(hourMap).length === 0) return '-';

        const peakHour = Object.keys(hourMap).reduce((a, b) => 
            hourMap[a] > hourMap[b] ? a : b
        );

        return `${String(peakHour).padStart(2, '0')}:00 WIB`;
    }

    /**
     * Get truck type distribution
     */
    getTruckTypeDistribution() {
        const surveys = this.getAllSurveys();
        const distribution = {};

        surveys.forEach(s => {
            distribution[s.truckType] = (distribution[s.truckType] || 0) + 1;
        });

        return distribution;
    }

    // ===== UTILITY HELPERS =====

    /**
     * Format timestamp to readable format
     */
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    /**
     * Format date to readable format
     */
    formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString('id-ID', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    /**
     * Get truck type label
     */
    getTruckTypeLabel(type) {
        const labels = {
            'box': 'Box Truck',
            'dump': 'Dump Truck',
            'tanker': 'Tanker Truck',
            'trailer': 'Trailer',
            'pickup': 'Pickup Truck',
            'other': 'Lainnya'
        };
        return labels[type] || type;
    }

    /**
     * Get weight category label
     */
    getWeightLabel(category) {
        const labels = {
            '5-10': '5-10 ton',
            '10-20': '10-20 ton',
            '20-30': '20-30 ton',
            '30+': '30+ ton'
        };
        return labels[category] || category;
    }

    /**
     * Get location label
     */
    getLocationLabel(location) {
        const labels = {
            'pusat': 'Pusat Kota',
            'pelabuhan': 'Pelabuhan',
            'industri': 'Area Industri',
            'airport': 'Bandara',
            'mall': 'Mall',
            'luar': 'Luar Kota',
            'other': 'Lainnya'
        };
        return labels[location] || location;
    }

    /**
     * Get coordinates for a known location key
     */
    getLocationCoordinates(key) {
        const coords = {
            'pusat': [-6.2088, 106.8456],
            'pelabuhan': [-6.1256, 106.9613],
            'industri': [-6.2450, 106.9000],
            'airport': [-6.1256, 106.6590],
            'mall': [-6.2146, 106.8451],
            'luar': [-6.5000, 106.8000],
            'other': [-6.2088, 106.8456]
        };

        return coords[key] || null;
    }

    /**
     * Parse route points from input text and fallback to origin/destination
     */
    parseRoutePoints(routeText, origin, destination) {
        const points = [];

        const originCoords = this.getLocationCoordinates(origin);
        const destinationCoords = this.getLocationCoordinates(destination);

        if (originCoords) {
            points.push(originCoords);
        }

        if (routeText) {
            const stops = routeText.split(',').map(item => item.trim()).filter(Boolean);
            stops.forEach(stop => {
                const normalized = stop.toLowerCase();
                if (normalized.includes('pusat')) {
                    points.push(this.getLocationCoordinates('pusat'));
                } else if (normalized.includes('pelabuhan')) {
                    points.push(this.getLocationCoordinates('pelabuhan'));
                } else if (normalized.includes('industri')) {
                    points.push(this.getLocationCoordinates('industri'));
                } else if (normalized.includes('bandara') || normalized.includes('airport')) {
                    points.push(this.getLocationCoordinates('airport'));
                } else if (normalized.includes('mall')) {
                    points.push(this.getLocationCoordinates('mall'));
                } else if (normalized.includes('luar') || normalized.includes('kota')) {
                    points.push(this.getLocationCoordinates('luar'));
                } else {
                    points.push(this.getLocationCoordinates('other'));
                }
            });
        }

        if (destinationCoords) {
            points.push(destinationCoords);
        }

        return points.filter(Boolean);
    }

    /**
     * Validate plate number format
     */
    validatePlateNumber(plate) {
        // Simple validation: B 1234 CD or similar
        const pattern = /^[A-Z]\s?\d{4}\s?[A-Z]{1,3}$/i;
        return pattern.test(plate.toUpperCase());
    }

    /**
     * Format plate number to standard format
     */
    formatPlateNumber(plate) {
        return plate.toUpperCase().replace(/\s+/g, ' ').trim();
    }

    /**
     * Generate sample data for demo (optional)
     */
    generateSampleData() {
        const sampleSurveys = [
            {
                id: 1000,
                timestamp: new Date(new Date().setHours(14, 35)).toISOString(),
                location: 'Jakarta Pusat',
                truckType: 'box',
                plateNumber: 'B 1234 CD',
                weightCategory: '20-30',
                truckCondition: 'good',
                origin: 'pusat',
                destination: 'pelabuhan',
                departureTime: '14:35',
                notes: '',
                photos: [],
                synced: true
            },
            {
                id: 1001,
                timestamp: new Date(new Date().setHours(14, 33)).toISOString(),
                location: 'Jakarta Pusat',
                truckType: 'dump',
                plateNumber: 'B 5678 EF',
                weightCategory: '10-20',
                truckCondition: 'fair',
                origin: 'industri',
                destination: 'pusat',
                departureTime: '14:30',
                notes: 'Kondisi jalan baik',
                photos: [],
                synced: true
            },
            {
                id: 1002,
                timestamp: new Date(new Date().setHours(14, 30)).toISOString(),
                location: 'Jakarta Pusat',
                truckType: 'tanker',
                plateNumber: 'B 9101 GH',
                weightCategory: '20-30',
                truckCondition: 'good',
                origin: 'pelabuhan',
                destination: 'industri',
                departureTime: '13:45',
                notes: '',
                photos: [],
                synced: true
            },
            {
                id: 1003,
                timestamp: new Date(new Date().setHours(14, 20)).toISOString(),
                location: 'Jakarta Pusat',
                truckType: 'trailer',
                plateNumber: 'B 1111 IJ',
                weightCategory: '30+',
                truckCondition: 'good',
                origin: 'luar',
                destination: 'pusat',
                departureTime: '10:00',
                notes: 'Muatan berat, jalan normal',
                photos: [],
                synced: true
            },
            {
                id: 1004,
                timestamp: new Date(new Date().setHours(14, 15)).toISOString(),
                location: 'Jakarta Pusat',
                truckType: 'box',
                plateNumber: 'B 2222 KL',
                weightCategory: '10-20',
                truckCondition: 'good',
                origin: 'mall',
                destination: 'pusat',
                departureTime: '14:00',
                notes: '',
                photos: [],
                synced: true
            },
            {
                id: 1005,
                timestamp: new Date(new Date().setHours(13, 45)).toISOString(),
                location: 'Jakarta Pusat',
                truckType: 'pickup',
                plateNumber: 'B 3333 MN',
                weightCategory: '5-10',
                truckCondition: 'fair',
                origin: 'pusat',
                destination: 'airport',
                departureTime: '13:30',
                notes: 'Truk agak rusak',
                photos: [],
                synced: true
            },
            {
                id: 1006,
                timestamp: new Date(new Date().setHours(13, 30)).toISOString(),
                location: 'Jakarta Pusat',
                truckType: 'dump',
                plateNumber: 'B 4444 OP',
                weightCategory: '20-30',
                truckCondition: 'good',
                origin: 'pusat',
                destination: 'pelabuhan',
                departureTime: '13:15',
                notes: '',
                photos: [],
                synced: true
            },
            {
                id: 1007,
                timestamp: new Date(new Date().setHours(13, 15)).toISOString(),
                location: 'Jakarta Pusat',
                truckType: 'box',
                plateNumber: 'B 5555 QR',
                weightCategory: '10-20',
                truckCondition: 'good',
                origin: 'industri',
                destination: 'mall',
                departureTime: '13:00',
                notes: '',
                photos: [],
                synced: true
            },
            {
                id: 1008,
                timestamp: new Date(new Date().setHours(12, 45)).toISOString(),
                location: 'Jakarta Pusat',
                truckType: 'tanker',
                plateNumber: 'B 6666 ST',
                weightCategory: '20-30',
                truckCondition: 'good',
                origin: 'pelabuhan',
                destination: 'pusat',
                departureTime: '12:30',
                notes: 'Perjalanan lancar',
                photos: [],
                synced: true
            }
        ];

        localStorage.setItem(this.storageKey, JSON.stringify(sampleSurveys));
        console.log('✓ Sample data generated');
    }

    /**
     * Detect OS for appropriate UI hints
     */
    detectOS() {
        const ua = navigator.userAgent;
        if (/android/i.test(ua)) {
            document.body.classList.add('os-android');
        } else if (/iPad|iPhone|iPod/.test(ua)) {
            document.body.classList.add('os-ios');
        } else if (/Windows/.test(ua)) {
            document.body.classList.add('os-windows');
        }
    }
}

// Initialize app globally
const app = new TrafficApp();

// Check if we should load sample data (useful for demo/testing)
if (localStorage.getItem('demo_mode') === 'true' && app.getTotalCount() === 0) {
    app.generateSampleData();
}
