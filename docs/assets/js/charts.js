window.CHARTS = {
    currentChart: null,
    
    refreshAll: function() {
        console.log('📊 Refreshing charts...');
        const filteredData = window.UI.getFilteredData();
        
        if (filteredData.length === 0) {
            console.log('⚠️ No data to display');
            return;
        }
        
        this.renderChart(filteredData);
    },
    
    renderChart: function(data) {
        const ctx = document.getElementById('dataChart');
        if (!ctx) {
            console.log('⚠️ Chart canvas not found');
            return;
        }
        
        // Destroy existing chart
        if (this.currentChart) {
            this.currentChart.destroy();
        }
        
        // Prepare data for Chart.js
        const labels = [...new Set(data.map(d => d.Year))].sort();
        const datasets = {};
        
        // Group by country or indicator
        data.forEach(row => {
            const key = row.Country || row.Indicator;
            if (!datasets[key]) {
                datasets[key] = {
                    label: key,
                    data: [],
                    borderColor: this.getRandomColor(),
                    backgroundColor: this.getRandomColor(0.2),
                    tension: 0.1
                };
            }
        });
        
        // Fill data points
        labels.forEach(year => {
            Object.keys(datasets).forEach(key => {
                const value = data.find(d => 
                    (d.Country === key || d.Indicator === key) && d.Year == year
                )?.Value || null;
                datasets[key].data.push(value);
            });
        });
        
        // Create chart
        this.currentChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: Object.values(datasets)
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Global Development Analytics'
                    },
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Value'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Year'
                        }
                    }
                }
            }
        });
    },
    
    getRandomColor: function(alpha = 1) {
        const colors = [
            `rgba(255, 99, 132, ${alpha})`,
            `rgba(54, 162, 235, ${alpha})`,
            `rgba(255, 205, 86, ${alpha})`,
            `rgba(75, 192, 192, ${alpha})`,
            `rgba(153, 102, 255, ${alpha})`,
            `rgba(255, 159, 64, ${alpha})`
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
};
