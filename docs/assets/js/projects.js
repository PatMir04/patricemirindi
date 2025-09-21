// ==========================================================================
// PROJECT FILTERING FUNCTIONALITY
// ==========================================================================

class ProjectsManager {
    constructor() {
        this.currentFilter = 'all';
        this.projects = [];
        this.init();
    }

    init() {
        this.setupFilterButtons();
        this.loadProjectsData();
    }

    setupFilterButtons() {
        const filterButtons = document.querySelectorAll('.filter-btn');

        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');

                // Update current filter
                this.currentFilter = e.target.dataset.category;
                this.filterProjects();
            });
        });
    }

    async loadProjectsData() {
        try {
            const response = await fetch('/data/key_projects.json');
            if (response.ok) {
                this.projects = await response.json();
            }
        } catch (error) {
            console.warn('Could not load projects data:', error);
        }
    }

    filterProjects() {
        const projectCards = document.querySelectorAll('.project-card, .project-card-compact');

        projectCards.forEach(card => {
            const category = card.dataset.category;

            if (this.currentFilter === 'all' || category === this.currentFilter) {
                card.style.display = 'block';
                card.classList.add('fade-in');
            } else {
                card.style.display = 'none';
                card.classList.remove('fade-in');
            }
        });
    }
}

// Initialize projects manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.project-filters')) {
        window.projectsManager = new ProjectsManager();
    }
});