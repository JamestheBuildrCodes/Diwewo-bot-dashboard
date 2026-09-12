/* Kayode Bot Dashboard - Application Logic */

class KayodeDashboard {
    constructor() {
        this.currentPage = 'overview';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadPage('overview');
        this.setupCharts();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.loadPage(page);
                this.updateActiveNav(item);
                this.closeSidebarMobile();
            });
        });

        // Mobile navigation
        const navToggle = document.getElementById('navToggle');
        const sidebar = document.getElementById('sidebar');
        const sidebarToggleMobile = document.querySelector('.sidebar-toggle-mobile');

        navToggle?.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        sidebarToggleMobile?.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !navToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });

        // Search functionality
        const setupsSearch = document.getElementById('setupsSearch');
        setupsSearch?.addEventListener('input', (e) => {
            this.filterSetups(e.target.value);
        });

        // Connect button
        const connectBtn = document.getElementById('connectBtn');
        connectBtn?.addEventListener('click', () => {
            this.showConnectionModal();
        });
    }

    loadPage(pageId) {
        const template = document.querySelector(`#${pageId}-page`);
        if (!template) {
            console.error(`Template for page ${pageId} not found`);
            return;
        }

        const contentContainer = document.getElementById('contentContainer');
        contentContainer.innerHTML = '';

        const clone = template.content.cloneNode(true);
        contentContainer.appendChild(clone);

        // Update page title
        const titles = {
            overview: 'Overview',
            setups: 'Setups',
            orders: 'Orders',
            positions: 'Positions',
            history: 'Trade History',
            performance: 'Performance',
            risk: 'Risk Management',
            account: 'Account'
        };

        document.getElementById('pageTitle').textContent = titles[pageId];
        this.currentPage = pageId;

        // Re-setup event listeners for new content
        this.setupPageSpecificListeners();
    }

    updateActiveNav(activeItem) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        activeItem.classList.add('active');
    }

    closeSidebarMobile() {
        if (window.innerWidth <= 1024) {
            document.getElementById('sidebar').classList.remove('active');
        }
    }

    setupPageSpecificListeners() {
        // Add page-specific event listeners here
        if (this.currentPage === 'account') {
            const toggles = document.querySelectorAll('.toggle input');
            toggles.forEach(toggle => {
                toggle.addEventListener('change', (e) => {
                    this.updateSetting(e.target.checked);
                });
            });
        }
    }

    filterSetups(searchTerm) {
        const setupCards = document.querySelectorAll('.setup-card');
        const term = searchTerm.toLowerCase();

        setupCards.forEach(card => {
            const title = card.querySelector('.setup-card-header h3').textContent.toLowerCase();
            const symbol = title.split('-')[0].trim();

            if (symbol.includes(term)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    setupCharts() {
        // Wait for page to load charts
        setTimeout(() => {
            this.drawEquityChart();
            this.drawMonthlyChart();
        }, 100);
    }

    drawEquityChart() {
        const canvas = document.getElementById('equityChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        // Set canvas size
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        // Mock equity data
        const data = [
            { date: 'Sep 1', value: 45000 },
            { date: 'Sep 3', value: 46500 },
            { date: 'Sep 5', value: 45800 },
            { date: 'Sep 7', value: 48200 },
            { date: 'Sep 9', value: 47500 },
            { date: 'Sep 11', value: 50000 }
        ];

        this.drawLineChart(ctx, data, rect.width, rect.height);
    }

    drawMonthlyChart() {
        const canvas = document.getElementById('monthlyChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        // Set canvas size
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        // Mock monthly P&L data
        const data = [
            { month: 'Jul', value: 800 },
            { month: 'Aug', value: -200 },
            { month: 'Sep', value: 1250 }
        ];

        this.drawBarChart(ctx, data, rect.width, rect.height);
    }

    drawLineChart(ctx, data, width, height) {
        const padding = 40;
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;

        // Find min/max values
        const values = data.map(d => d.value);
        const minVal = Math.min(...values);
        const maxVal = Math.max(...values);
        const range = maxVal - minVal;
        const margin = range * 0.1;

        // Draw background
        ctx.fillStyle = '#f9fafb';
        ctx.fillRect(padding, padding, chartWidth, chartHeight);

        // Draw grid
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding + (chartHeight / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + chartWidth, y);
            ctx.stroke();
        }

        // Draw line
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        ctx.beginPath();
        data.forEach((point, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const normalizedValue = (point.value - minVal + margin) / (range + 2 * margin);
            const y = padding + chartHeight - normalizedValue * chartHeight;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        // Draw points
        ctx.fillStyle = '#10b981';
        data.forEach((point, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const normalizedValue = (point.value - minVal + margin) / (range + 2 * margin);
            const y = padding + chartHeight - normalizedValue * chartHeight;

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });

        // Draw axes
        ctx.strokeStyle = '#6b7280';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();

        // Draw labels
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'center';

        data.forEach((point, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            ctx.fillText(point.date, x, height - padding + 20);
        });

        // Draw value labels
        ctx.textAlign = 'right';
        for (let i = 0; i <= 4; i++) {
            const value = minVal + (range / 4) * i;
            const y = padding + chartHeight - (chartHeight / 4) * i;
            ctx.fillText(`$${Math.round(value).toLocaleString()}`, padding - 10, y + 4);
        }
    }

    drawBarChart(ctx, data, width, height) {
        const padding = 40;
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;

        // Find max value
        const maxVal = Math.max(...data.map(d => Math.abs(d.value)));
        const margin = maxVal * 0.1;

        // Draw background
        ctx.fillStyle = '#f9fafb';
        ctx.fillRect(padding, padding, chartWidth, chartHeight);

        // Draw grid
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding + (chartHeight / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + chartWidth, y);
            ctx.stroke();
        }

        // Draw bars
        const barWidth = (chartWidth - data.length * 10) / data.length;
        data.forEach((point, index) => {
            const x = padding + index * (barWidth + 10) + 5;
            const normalizedValue = point.value / (maxVal + margin);
            const barHeight = normalizedValue * chartHeight;

            if (point.value > 0) {
                ctx.fillStyle = '#10b981';
                ctx.fillRect(x, padding + chartHeight - barHeight, barWidth, barHeight);
            } else {
                ctx.fillStyle = '#ef4444';
                ctx.fillRect(x, padding + chartHeight, barWidth, -barHeight);
            }

            // Draw label
            ctx.fillStyle = '#6b7280';
            ctx.font = '12px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(point.month, x + barWidth / 2, height - padding + 20);

            // Draw value on bar
            ctx.fillStyle = '#111827';
            ctx.textAlign = 'center';
            const valueY = point.value > 0
                ? padding + chartHeight - barHeight - 5
                : padding + chartHeight + 15;
            ctx.fillText(`$${Math.round(point.value).toLocaleString()}`, x + barWidth / 2, valueY);
        });

        // Draw axes
        ctx.strokeStyle = '#6b7280';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();
    }

    showConnectionModal() {
        alert('Exchange connection will be available in the next phase.\n\nPhase 1 is focused on perfecting the frontend dashboard.\n\nAPI connection to Bybit will be implemented in Phase 2.');
    }

    updateSetting(enabled) {
        console.log('Setting updated:', enabled);
        // In Phase 2, this would save to backend
    }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new KayodeDashboard();
});

// Handle window resize for responsive behavior
window.addEventListener('resize', () => {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth > 1024 && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }
});
