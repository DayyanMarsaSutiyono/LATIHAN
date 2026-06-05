/**
 * TRAFFIC MANAGEMENT SYSTEM - Dashboard Logic
 * Handles real-time monitoring, charts, filtering, and exports
 */

document.addEventListener('DOMContentLoaded', () => {
    const DashboardManager = {
        // DOM Elements
        totalTruckEl: document.getElementById('totalTrucks'),
        todayTruckEl: document.getElementById('todayTrucks'),
        avgWeightEl: document.getElementById('avgWeight'),
        peakTimeEl: document.getElementById('peakTime'),
        tableBody: document.getElementById('tableBody'),
        pageInfo: document.getElementById('pageInfo'),
        prevPageBtn: document.getElementById('prevPageBtn'),
        nextPageBtn: document.getElementById('nextPageBtn'),
        pageNumbersContainer: document.getElementById('pageNumbersContainer'),
        lastUpdateTime: document.getElementById('lastUpdateTime'),
        totalDataStored: document.getElementById('totalDataStored'),
        lastSyncTime: document.getElementById('lastSyncTime'),
        autoRefreshToggle: document.getElementById('autoRefreshToggle'),
        filterDate: document.getElementById('filterDate'),
        filterTruckType: document.getElementById('filterTruckType'),
        filterWeight: document.getElementById('filterWeight'),
        searchPlate: document.getElementById('searchPlate'),
        vehicleDetails: document.getElementById('vehicleDetails'),
        classificationSummary: document.getElementById('classificationSummary'),
        dashboardMap: document.getElementById('dashboardMap'),
        resetFilterBtn: document.getElementById('resetFilterBtn'),
        exportExcelBtn: document.getElementById('exportExcelBtn'),
        exportPdfBtn: document.getElementById('exportPdfBtn'),
        loadingIndicator: document.getElementById('loadingIndicator'),
        dashboardMapInstance: null,
        dashboardMarkers: [],

        // Chart instances
        routeChart: null,
        weightChart: null,

        // State
        currentPage: 1,
        itemsPerPage: 50,
        autoRefreshInterval: null,
        filteredData: [],

        // Default filter date to today
        init() {
            this.setDefaultDate();
            this.setupEventListeners();
            this.initMap();
            this.loadDashboard();
            this.startAutoRefresh();
        },

        // ===== EVENT LISTENERS =====

        setupEventListeners() {
            // Filters
            this.resetFilterBtn.addEventListener('click', () => this.resetFilters());
            this.filterDate.addEventListener('change', () => this.applyFilters());
            this.filterTruckType.addEventListener('change', () => this.applyFilters());
            this.filterWeight.addEventListener('change', () => this.applyFilters());
            this.searchPlate.addEventListener('input', () => this.applyFilters());

            // Auto-refresh toggle
            this.autoRefreshToggle.addEventListener('change', () => {
                if (this.autoRefreshToggle.checked) {
                    this.startAutoRefresh();
                } else {
                    this.stopAutoRefresh();
                }
            });

            // Pagination
            this.prevPageBtn.addEventListener('click', () => this.previousPage());
            this.nextPageBtn.addEventListener('click', () => this.nextPage());

            // Export
            this.exportExcelBtn.addEventListener('click', () => this.exportToExcel());
            this.exportPdfBtn.addEventListener('click', () => this.exportToPdf());

            // Connection changes
            window.addEventListener('online', () => this.handleConnectionChange());
            window.addEventListener('offline', () => this.handleConnectionChange());
        },

        setDefaultDate() {
            const today = new Date().toISOString().split('T')[0];
            this.filterDate.value = today;
        },

        // ===== DASHBOARD LOADING =====

        loadDashboard() {
            this.showLoading();
            setTimeout(() => {
                try {
                    this.updateKPIs();
                    this.applyFilters();
                    this.updateCharts();
                    this.updateStatistics();
                    this.updateLastSync();
                    this.hideLoading();
                } catch (error) {
                    console.error('Error loading dashboard:', error);
                    this.hideLoading();
                }
            }, 300);
        },

        // ===== KPI UPDATES =====

        updateKPIs() {
            const total = app.getTotalCount();
            const today = app.getTodayCount();
            const avgWeight = app.getAverageWeight();
            const peakTime = app.getPeakHour();

            // Animate number changes
            this.animateValue(this.totalTruckEl, parseInt(this.totalTruckEl.textContent), total);
            this.animateValue(this.todayTruckEl, parseInt(this.todayTruckEl.textContent), today);
            this.avgWeightEl.textContent = avgWeight;
            this.peakTimeEl.textContent = peakTime;
        },

        animateValue(element, start, end) {
            if (start === end) return;
            
            const duration = 500;
            const increment = (end - start) / (duration / 16);
            let current = start;

            const timer = setInterval(() => {
                current += increment;
                if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                    element.textContent = end;
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current);
                }
            }, 16);
        },

        // ===== FILTERING =====

        applyFilters() {
            const filters = {
                date: this.filterDate.value,
                truckType: this.filterTruckType.value,
                weightCategory: this.filterWeight.value,
                plateNumber: this.searchPlate.value.trim()
            };

            this.filteredData = app.getFilteredSurveys(filters);
            this.currentPage = 1;
            this.renderTable();
            this.updateCharts();
            this.updateClassificationSummary();
        },

        resetFilters() {
            this.setDefaultDate();
            this.filterTruckType.value = '';
            this.filterWeight.value = '';
            this.searchPlate.value = '';
            this.applyFilters();
        },

        // ===== TABLE RENDERING =====

        renderTable() {
            const startIdx = (this.currentPage - 1) * this.itemsPerPage;
            const endIdx = startIdx + this.itemsPerPage;
            const pageData = this.filteredData.slice(startIdx, endIdx);

            if (pageData.length === 0) {
                this.tableBody.innerHTML = `
                    <tr class="empty-state">
                        <td colspan="7">Tidak ada data untuk filter yang dipilih</td>
                    </tr>
                `;
                this.updatePagination();
                return;
            }

            this.tableBody.innerHTML = pageData.map((survey, idx) => `
                <tr data-id="${survey.id}">
                    <td>${startIdx + idx + 1}</td>
                    <td>${app.formatTime(survey.timestamp)}</td>
                    <td><strong>${survey.plateNumber}</strong></td>
                    <td>${app.getTruckTypeLabel(survey.truckType)}</td>
                    <td>
                        ${app.getLocationLabel(survey.origin)} → 
                        ${app.getLocationLabel(survey.destination)}
                    </td>
                    <td>${app.getWeightLabel(survey.weightCategory)}</td>
                    <td>
                        <span class="status-badge ${survey.synced ? 'synced' : 'pending'}">
                            ${survey.synced ? '✓ Synced' : '⟳ Pending'}
                        </span>
                    </td>
                </tr>
            `).join('');

            this.tableBody.querySelectorAll('tr[data-id]').forEach(row => {
                row.addEventListener('click', () => {
                    const surveyId = Number(row.dataset.id);
                    const selected = this.filteredData.find(item => item.id === surveyId);
                    if (selected) {
                        this.renderVehicleDetails(selected);
                    }
                });
            });

            this.updatePagination();
            this.updateLastUpdateTime();
        },

        // ===== PAGINATION =====

        updatePagination() {
            const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);

            // Update page info
            this.pageInfo.textContent = `Halaman ${this.currentPage} of ${totalPages}`;

            // Update buttons
            this.prevPageBtn.disabled = this.currentPage === 1;
            this.nextPageBtn.disabled = this.currentPage === totalPages;

            // Update page numbers
            this.renderPageNumbers(totalPages);
        },

        renderPageNumbers(totalPages) {
            this.pageNumbersContainer.innerHTML = '';

            let startPage = Math.max(1, this.currentPage - 2);
            let endPage = Math.min(totalPages, startPage + 4);

            if (endPage - startPage < 4) {
                startPage = Math.max(1, endPage - 4);
            }

            for (let i = startPage; i <= endPage; i++) {
                const btn = document.createElement('button');
                btn.textContent = i;
                btn.className = `page-btn ${i === this.currentPage ? 'active' : ''}`;
                btn.addEventListener('click', () => {
                    this.currentPage = i;
                    this.renderTable();
                });
                this.pageNumbersContainer.appendChild(btn);
            }
        },

        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderTable();
            }
        },

        nextPage() {
            const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderTable();
            }
        },

        // ===== CHARTS =====

        updateCharts() {
            this.updateRouteChart();
            this.updateWeightChart();
            this.updateClassificationSummary();
            this.updateMapMarkers();
        },

        updateRouteChart() {
            const topRoutes = app.getTopRoutes(10);
            const ctx = document.getElementById('routeChart').getContext('2d');

            const colors = [
                '#0066CC', '#00AA44', '#FF9900', '#DD0000', '#0099FF',
                '#FF66B2', '#66FF99', '#FF9933', '#3366FF', '#99FF33'
            ];

            if (this.routeChart) {
                this.routeChart.destroy();
            }

            this.routeChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: topRoutes.map(r => r.route),
                    datasets: [{
                        label: 'Jumlah Truk',
                        data: topRoutes.map(r => r.count),
                        backgroundColor: colors,
                        borderColor: colors,
                        borderWidth: 1,
                        borderRadius: 4
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        },

        updateWeightChart() {
            const distribution = app.getWeightDistribution();
            const ctx = document.getElementById('weightChart').getContext('2d');

            if (this.weightChart) {
                this.weightChart.destroy();
            }

            this.weightChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: [
                        app.getWeightLabel('5-10'),
                        app.getWeightLabel('10-20'),
                        app.getWeightLabel('20-30'),
                        app.getWeightLabel('30+')
                    ],
                    datasets: [{
                        data: [
                            distribution['5-10'],
                            distribution['10-20'],
                            distribution['20-30'],
                            distribution['30+']
                        ],
                        backgroundColor: [
                            '#99FF33',
                            '#0066CC',
                            '#FF9900',
                            '#DD0000'
                        ],
                        borderColor: '#FFFFFF',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        },

        // ===== CLASSIFICATION SUMMARY =====

        updateClassificationSummary() {
            const distribution = app.getWeightDistribution();
            const labels = ['5-10', '10-20', '20-30', '30+'];
            const labelMap = labels.map(label => ({
                label: app.getWeightLabel(label),
                count: distribution[label],
                classification: app.classifyVehicle(label, 'box').label
            }));

            if (!this.classificationSummary) return;
            this.classificationSummary.innerHTML = labelMap.map(item => `
                <div class="summary-item">
                    <div class="summary-label">${item.label}</div>
                    <div class="summary-value">${item.count}</div>
                    <div class="summary-tag">${item.classification}</div>
                </div>
            `).join('');
        },

        // ===== MAP =====

        initMap() {
            try {
                this.dashboardMapInstance = L.map('dashboardMap', {
                    center: [-6.2088, 106.8456],
                    zoom: 11,
                    zoomControl: true,
                    attributionControl: false
                });

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19
                }).addTo(this.dashboardMapInstance);

                this.updateMapMarkers();
            } catch (error) {
                console.warn('Leaflet tidak tersedia:', error);
            }
        },

        updateMapMarkers() {
            if (!this.dashboardMapInstance) return;

            this.dashboardMarkers.forEach(marker => {
                this.dashboardMapInstance.removeLayer(marker);
            });
            this.dashboardMarkers = [];

            const allSurveys = app.getFilteredSurveys({});
            allSurveys.forEach(survey => {
                if (survey.gps && survey.gps.lat && survey.gps.lng) {
                    const marker = L.marker([survey.gps.lat, survey.gps.lng])
                        .addTo(this.dashboardMapInstance)
                        .bindPopup(`Plat: ${survey.plateNumber}<br>${app.getTruckTypeLabel(survey.truckType)}<br>${app.getWeightLabel(survey.weightCategory)}`);

                    this.dashboardMarkers.push(marker);
                }
            });

            if (this.dashboardMarkers.length > 0) {
                const group = L.featureGroup(this.dashboardMarkers);
                this.dashboardMapInstance.fitBounds(group.getBounds().pad(0.2));
            }
        },

        renderVehicleDetails(survey) {
            if (!this.vehicleDetails) return;
            const classification = app.classifyVehicle(survey.weightCategory, survey.truckType);
            this.vehicleDetails.innerHTML = `
                <p><strong>Plat Nomor:</strong> ${survey.plateNumber}</p>
                <p><strong>Jenis Truk:</strong> ${app.getTruckTypeLabel(survey.truckType)}</p>
                <p><strong>Berat:</strong> ${app.getWeightLabel(survey.weightCategory)}</p>
                <p><strong>Rute:</strong> ${app.getLocationLabel(survey.origin)} → ${app.getLocationLabel(survey.destination)}</p>
                <p><strong>Status:</strong> ${survey.synced ? '✓ Synced' : '⟳ Pending'}</p>
                <p><strong>Klasifikasi:</strong> ${classification.label}</p>
            `;
        },


        updateLastUpdateTime() {
            this.lastUpdateTime.textContent = 'Baru saja';
        },

        updateLastSync() {
            this.lastSyncTime.textContent = new Date().toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        },

        // ===== AUTO-REFRESH =====

        startAutoRefresh() {
            if (this.autoRefreshInterval) {
                clearInterval(this.autoRefreshInterval);
            }

            this.autoRefreshInterval = setInterval(() => {
                this.loadDashboard();
            }, 30000); // Refresh every 30 seconds
        },

        stopAutoRefresh() {
            if (this.autoRefreshInterval) {
                clearInterval(this.autoRefreshInterval);
                this.autoRefreshInterval = null;
            }
        },

        // ===== EXPORT FUNCTIONS =====

        exportToExcel() {
            const surveys = this.filteredData;
            const ws_name = 'Traffic Survey';

            // Prepare data
            const data = surveys.map(s => ({
                'Waktu': app.formatTime(s.timestamp),
                'Tanggal': app.formatDate(s.timestamp),
                'Plat Nomor': s.plateNumber,
                'Jenis Truk': app.getTruckTypeLabel(s.truckType),
                'Berat': app.getWeightLabel(s.weightCategory),
                'Kondisi': s.truckCondition,
                'Asal': app.getLocationLabel(s.origin),
                'Tujuan': app.getLocationLabel(s.destination),
                'Catatan': s.notes,
                'Status': s.synced ? 'Synced' : 'Pending'
            }));

            // Create worksheet
            const ws = XLSX.utils.json_to_sheet(data);
            
            // Set column widths
            ws['!cols'] = [
                { wch: 8 },
                { wch: 10 },
                { wch: 15 },
                { wch: 12 },
                { wch: 12 },
                { wch: 10 },
                { wch: 15 },
                { wch: 15 },
                { wch: 20 },
                { wch: 10 }
            ];

            // Create workbook
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, ws_name);

            // Generate filename
            const filename = `Traffic_Survey_${new Date().toISOString().split('T')[0]}.xlsx`;

            // Write file
            XLSX.writeFile(wb, filename);

            console.log('✓ Excel exported:', filename);
        },

        exportToPdf() {
            const element = document.createElement('div');
            element.innerHTML = `
                <div style="padding: 20px;">
                    <h1>Laporan Survei Lalu Lintas Truk Berat</h1>
                    <p>Tanggal Laporan: ${new Date().toLocaleDateString('id-ID', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</p>
                    
                    <h2>Ringkasan Statistik</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="border: 1px solid #ddd; padding: 8px;">
                            <td style="padding: 8px;"><strong>Total Truk:</strong></td>
                            <td style="padding: 8px;">${app.getTotalCount()}</td>
                        </tr>
                        <tr style="border: 1px solid #ddd; background: #f5f5f5;">
                            <td style="padding: 8px;"><strong>Hari Ini:</strong></td>
                            <td style="padding: 8px;">${app.getTodayCount()}</td>
                        </tr>
                        <tr style="border: 1px solid #ddd;">
                            <td style="padding: 8px;"><strong>Rata-rata Berat:</strong></td>
                            <td style="padding: 8px;">${app.getAverageWeight()} ton</td>
                        </tr>
                        <tr style="border: 1px solid #ddd; background: #f5f5f5;">
                            <td style="padding: 8px;"><strong>Peak Time:</strong></td>
                            <td style="padding: 8px;">${app.getPeakHour()}</td>
                        </tr>
                    </table>

                    <h2>Top Routes</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #0066CC; color: white;">
                                <th style="border: 1px solid #ddd; padding: 8px;">Rute</th>
                                <th style="border: 1px solid #ddd; padding: 8px;">Jumlah</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${app.getTopRoutes(10).map((r, i) => `
                                <tr style="border: 1px solid #ddd; ${i % 2 === 0 ? 'background: #f5f5f5;' : ''}">
                                    <td style="border: 1px solid #ddd; padding: 8px;">${r.route}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${r.count}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <h2>Distribusi Berat Muatan</h2>
                    <ul>
                        ${Object.entries(app.getWeightDistribution()).map(([weight, count]) => 
                            `<li>${app.getWeightLabel(weight)}: ${count} truk</li>`
                        ).join('')}
                    </ul>

                    <hr style="margin-top: 30px; margin-bottom: 10px;">
                    <p style="font-size: 12px; color: #666;">
                        Laporan ini dihasilkan oleh Sistem Manajemen Lalu Lintas Truk Berat<br>
                        ${new Date().toLocaleString('id-ID')}
                    </p>
                </div>
            `;

            const opt = {
                margin: 10,
                filename: `Traffic_Report_${new Date().toISOString().split('T')[0]}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
            };

            html2pdf().set(opt).from(element).save();

            console.log('✓ PDF exported');
        },

        // ===== CONNECTION HANDLING =====

        handleConnectionChange() {
            if (app.isOnline()) {
                console.log('✓ Connection restored - refreshing data');
                this.loadDashboard();
            } else {
                console.log('✗ Connection lost - using cached data');
            }
        },

        // ===== LOADING INDICATOR =====

        showLoading() {
            this.loadingIndicator.classList.add('active');
        },

        hideLoading() {
            this.loadingIndicator.classList.remove('active');
        }
    };

    // Initialize dashboard
    DashboardManager.init();

    // Auto-refresh immediately on page load
    setInterval(() => {
        if (DashboardManager.autoRefreshToggle.checked) {
            DashboardManager.loadDashboard();
        }
    }, 30000);
});
