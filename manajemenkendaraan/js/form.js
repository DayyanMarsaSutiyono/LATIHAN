/**
 * TRAFFIC MANAGEMENT SYSTEM - Form Input Logic
 * Handles form submission, validation, and data capture
 */

document.addEventListener('DOMContentLoaded', () => {
    const FormManager = {
        form: document.getElementById('surveyForm'),
        locationDisplay: document.getElementById('locationDisplay'),
        coordinatesDisplay: document.getElementById('coordinatesDisplay'),
        refreshLocationBtn: document.getElementById('refreshLocationBtn'),
        plateNumberInput: document.getElementById('plateNumber'),
        plateError: document.getElementById('plateError'),
        notesInput: document.getElementById('notes'),
        notesCounter: document.getElementById('notesCounter'),
        photoInput: document.getElementById('photoInput'),
        cameraInput: document.getElementById('cameraInput'),
        cameraBtn: document.getElementById('cameraBtn'),
        galleryBtn: document.getElementById('galleryBtn'),
        photoPreview: document.getElementById('photoPreview'),
        successModal: document.getElementById('successModal'),
        continueBtn: document.getElementById('continueBtn'),
        dataCountBadge: document.getElementById('dataCount'),
        departureTimeInput: document.getElementById('departureTime'),

        photos: [],
        currentLocation: null,

        init() {
            this.setupEventListeners();
            this.loadLocation();
            this.setDefaultTime();
            this.updateDataCount();
            this.enableDemoMode();
        },

        // ===== EVENT LISTENERS =====

        setupEventListeners() {
            // Form submission
            this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));

            // Location refresh
            this.refreshLocationBtn.addEventListener('click', () => this.loadLocation());

            // Plate number validation
            this.plateNumberInput.addEventListener('blur', () => this.validatePlateNumber());
            this.plateNumberInput.addEventListener('change', () => {
                this.plateNumberInput.value = app.formatPlateNumber(this.plateNumberInput.value);
            });

            // Notes counter
            this.notesInput.addEventListener('input', () => this.updateNotesCounter());

            // Camera button
            this.cameraBtn.addEventListener('click', () => this.openCamera());

            // Gallery button
            this.galleryBtn.addEventListener('click', () => this.openGallery());

            // File input change (both camera and gallery)
            this.photoInput.addEventListener('change', (e) => this.handlePhotoSelect(e));
            this.cameraInput.addEventListener('change', (e) => this.handlePhotoSelect(e));

            // Success modal continue button
            this.continueBtn.addEventListener('click', () => this.resetForm());

            // Connection status updates
            window.addEventListener('online', () => this.updateConnectionUI());
            window.addEventListener('offline', () => this.updateConnectionUI());

            // Auto-focus on plate number after truck type selection
            document.getElementById('truckType').addEventListener('change', () => {
                this.plateNumberInput.focus();
            });

            // Demo mode checkbox (press Ctrl+Shift+D to enable)
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && e.code === 'KeyD') {
                    this.toggleDemoMode();
                }
            });
        },

        // ===== LOCATION HANDLING =====

        loadLocation() {
            this.refreshLocationBtn.classList.add('loading');
            this.locationDisplay.textContent = 'Mengambil lokasi...';

            app.getCurrentLocation()
                .then(location => {
                    this.currentLocation = location;
                    const locationName = app.getLocationName(location.lat, location.lng);
                    this.locationDisplay.textContent = locationName;
                    this.coordinatesDisplay.textContent = 
                        `GPS: ${location.lat.toFixed(4)}°, ${location.lng.toFixed(4)}° (Akurasi: ±${Math.round(location.accuracy)}m)`;
                    this.refreshLocationBtn.classList.remove('loading');
                })
                .catch(error => {
                    this.locationDisplay.textContent = 'Gagal mendapatkan lokasi';
                    this.coordinatesDisplay.textContent = `Error: ${error}`;
                    this.refreshLocationBtn.classList.remove('loading');
                    console.error('Location error:', error);
                });
        },

        // ===== TIME HANDLING =====

        setDefaultTime() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            this.departureTimeInput.value = `${hours}:${minutes}`;
        },

        // ===== PLATE NUMBER VALIDATION =====

        validatePlateNumber() {
            const plate = this.plateNumberInput.value.trim();
            const isValid = app.validatePlateNumber(plate);

            if (plate === '') {
                this.plateError.textContent = '';
                return true;
            }

            if (!isValid) {
                this.plateError.textContent = 'Format nomor pelat tidak sesuai (contoh: B 1234 CD)';
                this.plateNumberInput.classList.add('invalid');
                return false;
            }

            this.plateError.textContent = '';
            this.plateNumberInput.classList.remove('invalid');
            return true;
        },

        // ===== NOTES COUNTER =====

        updateNotesCounter() {
            const count = this.notesInput.value.length;
            this.notesCounter.textContent = `${count}/250`;

            if (count > 240) {
                this.notesCounter.classList.add('text-muted');
            } else {
                this.notesCounter.classList.remove('text-muted');
            }
        },

        // ===== PHOTO HANDLING =====

        openCamera() {
            this.cameraInput.click();
        },

        openGallery() {
            this.photoInput.click();
        },

        handlePhotoSelect(event) {
            const files = event.target.files;
            if (files.length === 0) return;

            for (let file of files) {
                // Check file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert('Ukuran foto terlalu besar (max 5MB). Silakan pilih foto lain.');
                    continue;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    const photoData = {
                        id: Date.now(),
                        data: e.target.result,
                        name: file.name,
                        size: file.size,
                        type: file.type
                    };

                    this.photos.push(photoData);
                    this.renderPhotoPreview();
                };

                reader.readAsDataURL(file);
            }

            // Reset input
            event.target.value = '';
        },

        renderPhotoPreview() {
            this.photoPreview.innerHTML = '';

            this.photos.forEach(photo => {
                const photoDiv = document.createElement('div');
                photoDiv.className = 'photo-preview';

                const img = document.createElement('img');
                img.src = photo.data;
                img.alt = photo.name;

                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.className = 'photo-remove-btn';
                removeBtn.innerHTML = '✕';
                removeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.photos = this.photos.filter(p => p.id !== photo.id);
                    this.renderPhotoPreview();
                });

                photoDiv.appendChild(img);
                photoDiv.appendChild(removeBtn);
                this.photoPreview.appendChild(photoDiv);
            });
        },

        // ===== FORM SUBMISSION =====

        handleFormSubmit(e) {
            e.preventDefault();

            // Validate plate number
            if (!this.validatePlateNumber()) {
                alert('Silakan perbaiki nomor pelat');
                return;
            }

            // Collect form data
            const formData = {
                location: this.locationDisplay.textContent,
                gps: this.currentLocation || { lat: 0, lng: 0 },
                truckType: document.getElementById('truckType').value,
                plateNumber: app.formatPlateNumber(this.plateNumberInput.value),
                weightCategory: document.getElementById('weightCategory').value,
                truckCondition: document.getElementById('truckCondition').value,
                origin: document.getElementById('origin').value,
                destination: document.getElementById('destination').value,
                departureTime: this.departureTimeInput.value,
                notes: this.notesInput.value,
                photos: this.photos.map(p => ({
                    data: p.data,
                    name: p.name
                })),
                submittedAt: new Date().toISOString()
            };

            try {
                // Save to localStorage
                app.saveSurvey(formData);

                // Update data count
                this.updateDataCount();

                // Show success modal
                this.showSuccessModal();

                // Log submission
                console.log('✓ Form submitted successfully:', formData);

            } catch (error) {
                alert('Gagal menyimpan data: ' + error.message);
                console.error('Form submission error:', error);
            }
        },

        // ===== SUCCESS MODAL =====

        showSuccessModal() {
            this.successModal.classList.add('active');
            
            // Auto-close after 3 seconds if user doesn't interact
            setTimeout(() => {
                if (this.successModal.classList.contains('active')) {
                    // Keep open for user to click
                }
            }, 3000);
        },

        resetForm() {
            this.form.reset();
            this.photos = [];
            this.photoPreview.innerHTML = '';
            this.successModal.classList.remove('active');
            this.setDefaultTime();
            this.updateNotesCounter();
            this.plateError.textContent = '';
            this.updateDataCount();
            this.loadLocation();
        },

        // ===== DATA COUNT UPDATE =====

        updateDataCount() {
            const count = app.getTotalCount();
            this.dataCountBadge.textContent = count;
        },

        // ===== UI UPDATES =====

        updateConnectionUI() {
            const statusEl = document.querySelector('.connection-status');
            if (app.isOnline()) {
                statusEl.classList.remove('offline');
                statusEl.classList.add('online');
                statusEl.querySelector('.status-text').textContent = 'Online';
            } else {
                statusEl.classList.remove('online');
                statusEl.classList.add('offline');
                statusEl.querySelector('.status-text').textContent = 'Offline';
            }
        },

        // ===== DEMO MODE =====

        enableDemoMode() {
            // Check if demo mode is enabled
            if (localStorage.getItem('demo_mode') === 'true') {
                console.log('📝 Demo mode enabled - sample data loaded');
            }
        },

        toggleDemoMode() {
            const isDemoMode = localStorage.getItem('demo_mode') === 'true';
            if (isDemoMode) {
                localStorage.removeItem('demo_mode');
                app.clearAllSurveys();
                alert('✓ Demo mode disabled. Data cleared.');
                location.reload();
            } else {
                localStorage.setItem('demo_mode', 'true');
                app.generateSampleData();
                alert('✓ Demo mode enabled. Sample data loaded.');
                location.reload();
            }
        }
    };

    // Initialize the form manager
    FormManager.init();
});
