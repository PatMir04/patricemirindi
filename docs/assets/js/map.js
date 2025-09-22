/**
 * Interactive Global Projects Map
 * Showing Patrice Mirindi's project locations worldwide
 */

class ProjectsMap {
    constructor() {
        this.map = null;
        this.markers = [];
        this.projectData = [
            {
                name: "Financial Resilience Framework",
                country: "Canada",
                coords: [49.8951, -97.1384],
                type: "active",
                sector: "Financial Services",
                period: "2024 - Ongoing",
                description: "Leading research initiatives to develop evidence-based frameworks for measuring and enhancing financial resilience across diverse communities in Canada and internationally.",
                client: "Financial Resilience Institute",
                impact: "15+ partner organizations, 5 research publications",
                methods: ["Survey Design", "Statistical Modeling", "Policy Analysis"],
                status: "In Progress"
            },
            {
                name: "CBI Dried Pineapple Sector Development",
                country: "Benin",
                coords: [9.3077, 2.3158],
                type: "completed",
                sector: "Agriculture",
                period: "2022 - 2024",
                description: "Supported Beninese SMEs in dried pineapple sector for export readiness and sustainable production practices. Collaborated with CBI and Ministry of Foreign Affairs Netherlands.",
                client: "CBI - Centre for the Promotion of Imports",
                impact: "25+ SMEs supported, €500K+ in new export contracts",
                methods: ["Market Analysis", "Capacity Building", "Value Chain Assessment"],
                status: "Successfully Completed"
            },
            {
                name: "Processed Mango Sector Enhancement",
                country: "Burkina Faso",
                coords: [12.2383, -1.5616],
                type: "completed",
                sector: "Agriculture",
                period: "2022 - 2023",
                description: "Strengthened agro-export value chains for processed mango sector, working with local agencies and Netherlands stakeholders to improve market access.",
                client: "CBI Netherlands & Local Partners",
                impact: "15+ processing facilities upgraded, 200+ farmers trained",
                methods: ["Value Chain Analysis", "Quality Standards", "Export Facilitation"],
                status: "Successfully Completed"
            },
            {
                name: "Agricultural Development & Food Security",
                country: "Democratic Republic of Congo",
                coords: [-4.4419, 15.2663],
                type: "completed",
                sector: "Agriculture",
                period: "2019 - 2022",
                description: "Implemented comprehensive poverty reduction and rural finance projects focusing on market systems development and agricultural productivity enhancement.",
                client: "Multiple Development Organizations",
                impact: "1,500+ farmers reached, 30% productivity increase",
                methods: ["Rural Finance", "Market Systems", "Agricultural Extension"],
                status: "Successfully Completed"
            },
            {
                name: "Multi-Country Agricultural Initiative",
                country: "Ivory Coast",
                coords: [7.5399, -5.5471],
                type: "completed",
                sector: "Agriculture",
                period: "2021 - 2023",
                description: "Pan-African agricultural development program focusing on sustainable farming practices and market integration across West and Central African countries.",
                client: "Regional Development Consortium",
                impact: "500+ cooperatives strengthened, 12+ countries covered",
                methods: ["Regional Analysis", "Cooperative Development", "Market Integration"],
                status: "Successfully Completed"
            },
            {
                name: "International Agrifood Consulting",
                country: "Netherlands",
                coords: [52.1326, 5.2913],
                type: "research",
                sector: "Policy & Research",
                period: "2020 - Present",
                description: "Ongoing collaboration with EU agencies and international donors on global agrifood policy research and development strategy formulation.",
                client: "Netherlands Enterprise Agency & Partners",
                impact: "10+ policy papers published, 5+ international conferences",
                methods: ["Policy Research", "International Collaboration", "Strategic Planning"],
                status: "Ongoing Collaboration"
            }
        ];
        
        this.init();
    }

    init() {
        if (document.getElementById('projects-map')) {
            this.createMap();
            this.addMarkers();
            this.setupMapControls();
        }
    }

    createMap() {
        // Initialize the map
        this.map = L.map('projects-map', {
            center: [10, 10],
            zoom: 2,
            minZoom: 2,
            maxZoom: 8,
            scrollWheelZoom: false,
            dragging: true,
            touchZoom: true,
            doubleClickZoom: false
        });

        // Add tile layer with professional styling
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 8,
            className: 'map-tiles'
        }).addTo(this.map);

        // Enable scroll wheel zoom on click
        this.map.on('click', () => {
            this.map.scrollWheelZoom.enable();
        });

        // Disable scroll wheel zoom when mouse leaves
        this.map.on('mouseout', () => {
            this.map.scrollWheelZoom.disable();
        });
    }

    addMarkers() {
        this.projectData.forEach((project, index) => {
            const markerIcon = this.createCustomMarker(project.type);
            
            const marker = L.marker(project.coords, { icon: markerIcon })
                .addTo(this.map)
                .bindPopup(this.createPopupContent(project), {
                    maxWidth: 350,
                    className: 'project-popup'
                });

            // Add click event for detailed view
            marker.on('click', () => {
                this.showProjectDetails(project);
            });

            this.markers.push(marker);
        });
    }

    createCustomMarker(type) {
        const colors = {
            active: '#FF6600',
            completed: '#10b981',
            research: '#004085'
        };

        const color = colors[type] || '#6b7280';
        
        return L.divIcon({
            className: 'custom-marker',
            html: `
                <div class="marker-pin" style="background-color: ${color};">
                    <div class="marker-center"></div>
                </div>
                <div class="marker-shadow"></div>
            `,
            iconSize: [30, 40],
            iconAnchor: [15, 40],
            popupAnchor: [0, -40]
        });
    }

    createPopupContent(project) {
        return `
            <div class="project-popup-content">
                <div class="popup-header">
                    <h3>${project.name}</h3>
                    <span class="project-status ${project.type}">${this.getStatusLabel(project.type)}</span>
                </div>
                <div class="popup-body">
                    <div class="project-meta">
                        <span class="meta-item"><i class="fas fa-map-marker-alt"></i> ${project.country}</span>
                        <span class="meta-item"><i class="fas fa-calendar"></i> ${project.period}</span>
                        <span class="meta-item"><i class="fas fa-industry"></i> ${project.sector}</span>
                    </div>
                    <p class="project-description">${project.description.substring(0, 120)}...</p>
                    <div class="popup-footer">
                        <button onclick="window.projectsMap.showProjectDetails(${JSON.stringify(project).replace(/"/g, '&quot;')})" class="btn-view-details">
                            View Details <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getStatusLabel(type) {
        const labels = {
            active: 'Active Project',
            completed: 'Completed',
            research: 'Research & Policy'
        };
        return labels[type] || 'Project';
    }

    showProjectDetails(project) {
        // Create modal or detailed view
        const modal = document.createElement('div');
        modal.className = 'project-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${project.name}</h2>
                    <button class="modal-close" onclick="this.closest('.project-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="project-details-grid">
                        <div class="detail-section">
                            <h3>Project Overview</h3>
                            <div class="detail-item">
                                <label>Location:</label>
                                <span>${project.country}</span>
                            </div>
                            <div class="detail-item">
                                <label>Period:</label>
                                <span>${project.period}</span>
                            </div>
                            <div class="detail-item">
                                <label>Sector:</label>
                                <span>${project.sector}</span>
                            </div>
                            <div class="detail-item">
                                <label>Client:</label>
                                <span>${project.client}</span>
                            </div>
                            <div class="detail-item">
                                <label>Status:</label>
                                <span class="status-badge ${project.type}">${project.status}</span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>Description</h3>
                            <p>${project.description}</p>
                        </div>
                        
                        <div class="detail-section">
                            <h3>Impact & Results</h3>
                            <p>${project.impact}</p>
                        </div>
                        
                        <div class="detail-section">
                            <h3>Methodology</h3>
                            <div class="method-tags">
                                ${project.methods.map(method => `<span class="method-tag">${method}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Add event listener to restore scroll when modal is closed
        modal.addEventListener('click', (e) => {
            if (e.target === modal.querySelector('.modal-overlay') || e.target === modal.querySelector('.modal-close')) {
                document.body.style.overflow = 'auto';
            }
        });
    }

    setupMapControls() {
        // Add legend interactivity
        const legendItems = document.querySelectorAll('.legend-item');
        legendItems.forEach(item => {
            item.addEventListener('click', () => {
                const markerClass = item.querySelector('.legend-marker').className;
                this.filterMarkers(markerClass);
            });
        });
    }

    filterMarkers(filterType) {
        this.markers.forEach((marker, index) => {
            const project = this.projectData[index];
            if (filterType === 'legend-marker' || filterType.includes(project.type)) {
                marker.addTo(this.map);
            } else {
                this.map.removeLayer(marker);
            }
        });
    }
}

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.projectsMap = new ProjectsMap();
});

// Add CSS styles for map components
const mapStyles = `
<style>
/* Map Container */
.projects-map {
    height: 450px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 64, 133, 0.15);
    margin: 2rem 0;
    border: 2px solid #F4F7FC;
    overflow: hidden;
}

/* Map Legend */
.map-legend {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 1rem;
    flex-wrap: wrap;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-family: 'Avenir', sans-serif;
    font-weight: 600;
    font-size: 0.9rem;
}

.legend-item:hover {
    background: #F4F7FC;
    transform: translateY(-2px);
}

.legend-marker {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.legend-marker.active { background: #FF6600; }
.legend-marker.completed { background: #10b981; }
.legend-marker.research { background: #004085; }

/* Custom Markers */
.custom-marker {
    background: none;
    border: none;
}

.marker-pin {
    width: 24px;
    height: 32px;
    border-radius: 12px 12px 12px 2px;
    border: 3px solid white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    position: relative;
    transform: rotate(-45deg);
    cursor: pointer;
    transition: all 0.3s ease;
}

.marker-center {
    width: 8px;
    height: 8px;
    background: white;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
}

.marker-shadow {
    width: 20px;
    height: 8px;
    background: rgba(0,0,0,0.2);
    border-radius: 50%;
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    filter: blur(2px);
}

.custom-marker:hover .marker-pin {
    transform: rotate(-45deg) scale(1.2);
}

/* Popup Styles */
.leaflet-popup-content-wrapper {
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    border: 2px solid #F4F7FC;
}

.project-popup-content {
    font-family: 'Avenir', sans-serif;
    color: #000;
    min-width: 280px;
}

.popup-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
}

.popup-header h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: bold;
    color: #004085;
    line-height: 1.3;
    flex: 1;
    margin-right: 0.5rem;
}

.project-status {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
}

.project-status.active {
    background: #FFF3E0;
    color: #FF6600;
    border: 1px solid #FF6600;
}

.project-status.completed {
    background: #F0FDF4;
    color: #10b981;
    border: 1px solid #10b981;
}

.project-status.research {
    background: #EBF8FF;
    color: #004085;
    border: 1px solid #004085;
}

.project-meta {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: #6C757D;
    font-weight: 500;
}

.meta-item i {
    width: 14px;
    color: #004085;
}

.project-description {
    font-size: 0.9rem;
    line-height: 1.5;
    color: #333;
    margin-bottom: 1rem;
}

.btn-view-details {
    background: linear-gradient(135deg, #004085, #FF6600);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'Avenir', sans-serif;
}

.btn-view-details:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 64, 133, 0.3);
}

/* Modal Styles */
.project-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    box-sizing: border-box;
}

.modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    backdrop-filter: blur(8px);
    cursor: pointer;
}

.modal-content {
    background: white;
    border-radius: 20px;
    max-width: 800px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 25px 60px rgba(0,0,0,0.3);
    font-family: 'Avenir', sans-serif;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem 2rem 1rem;
    border-bottom: 2px solid #F4F7FC;
}

.modal-header h2 {
    margin: 0;
    color: #004085;
    font-weight: bold;
    font-size: 1.5rem;
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #6C757D;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.modal-close:hover {
    background: #F4F7FC;
    color: #004085;
}

.modal-body {
    padding: 2rem;
}

.project-details-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
}

.detail-section h3 {
    color: #FF6600;
    font-size: 1.2rem;
    margin-bottom: 1rem;
    font-weight: bold;
}

.detail-item {
    display: flex;
    margin-bottom: 0.75rem;
    align-items: flex-start;
}

.detail-item label {
    font-weight: bold;
    color: #004085;
    min-width: 100px;
    margin-right: 1rem;
}

.detail-item span {
    color: #333;
    flex: 1;
}

.status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: bold;
    text-transform: uppercase;
}

.status-badge.active {
    background: #FFF3E0;
    color: #FF6600;
    border: 1px solid #FF6600;
}

.status-badge.completed {
    background: #F0FDF4;
    color: #10b981;
    border: 1px solid #10b981;
}

.status-badge.research {
    background: #EBF8FF;
    color: #004085;
    border: 1px solid #004085;
}

.method-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.method-tag {
    background: #F4F7FC;
    color: #004085;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    border: 2px solid #004085;
    transition: all 0.3s ease;
}

.method-tag:hover {
    background: #004085;
    color: white;
}

/* Responsive Design */
@media (max-width: 768px) {
    .projects-map {
        height: 350px;
    }
    
    .map-legend {
        gap: 1rem;
        margin-top: 0.5rem;
    }
    
    .legend-item {
        font-size: 0.8rem;
        padding: 0.25rem 0.5rem;
    }
    
    .modal-content {
        margin: 1rem;
        max-width: calc(100vw - 2rem);
    }
    
    .modal-header,
    .modal-body {
        padding: 1.5rem 1rem;
    }
    
    .project-details-grid {
        gap: 1.5rem;
    }
    
    .detail-item {
        flex-direction: column;
        gap: 0.25rem;
    }
    
    .detail-item label {
        min-width: auto;
        margin-right: 0;
    }
}
</style>
`;

// Add styles to document head
document.head.insertAdjacentHTML('beforeend', mapStyles);