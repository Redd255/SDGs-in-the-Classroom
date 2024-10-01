let wrongAnswers = 0;

function checkAnswer(option) {
    const correctAnswer = 'B'; 

    // Reset all options
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('correct', 'wrong');
    });

    // Check if the selected option is correct
    if (option === correctAnswer) {
        document.getElementById('option' + option).classList.add('correct');
        alert('Correct Answer!');
    } else {
        document.getElementById('option' + option).classList.add('wrong');
        alert('Wrong Answer! The fish is getting worse.');
        wrongAnswers++;
        updateFish();
    }
}

function updateFish() {
    const fish = document.getElementById('fish');

    // Change fish image based on wrong answers
    if (wrongAnswers === 1) {
        fish.src = '/media/fishWell.webp'; // Fish getting sick
    } else if (wrongAnswers === 2) {
        fish.src = '/media/fishSick.webp'; // Fish more sick
    } else if (wrongAnswers >= 3) {
        fish.src = '/media/fishDie.webp'; // Fish dies
        alert('The fish has died!');
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Select all sliders
    const coalSlider = document.getElementById('coal');
    const renewablesSlider = document.getElementById('renewables');
    const oilSlider = document.getElementById('oil');
    const deforestationSlider = document.getElementById('deforestation');
    const agricultureSlider = document.getElementById('agriculture');
    const industrySlider = document.getElementById('industry');
    const transportSlider = document.getElementById('transport');
    const wasteSlider = document.getElementById('waste');

    // Energy chart
    const energyChartCtx = document.getElementById('energyChart').getContext('2d');
    const emissionsChartCtx = document.getElementById('emissionsChart').getContext('2d');

    const energyChart = new Chart(energyChartCtx, {
        type: 'line',
        data: {
            labels: ['2000', '2005', '2010', '2020', '2024', '2030'],
            datasets: [
                {
                    label: 'Coal',
                    data: [100, 60, 80, 70, 90, 50],
                    borderColor: 'rgba(128, 0, 0, 1)',
                    backgroundColor: 'rgba(128, 0, 0, 0.3)',
                    fill: true,
                    tension: 0.3
                },
                {
                    label: 'Renewables',
                    data: [90, 30, 40, 50, 60, 70],
                    borderColor: 'rgba(0, 128, 0, 1)',
                    backgroundColor: 'rgba(0, 128, 0, 0.3)',
                    fill: true,
                    tension: 0.3
                },
                {
                    label: 'Oil',
                    data: [80, 70, 60, 50, 40, 30],
                    borderColor: 'rgba(255, 165, 0, 1)',
                    backgroundColor: 'rgba(255, 165, 0, 0.3)',
                    fill: true,
                    tension: 0.3
                },
                // New datasets for additional sliders
                {
                    label: 'Deforestation',
                    data: [50, 45, 40, 35, 30, 50],
                    borderColor: 'rgba(34, 139, 34, 1)',  // Green color
                    backgroundColor: 'rgba(34, 139, 34, 0.3)',
                    fill: true,
                    tension: 0.3
                },
                {
                    label: 'Agriculture',
                    data: [60, 55, 50, 45, 40, 50],
                    borderColor: 'rgba(218, 165, 32, 1)',  // Goldenrod color
                    backgroundColor: 'rgba(218, 165, 32, 0.3)',
                    fill: true,
                    tension: 0.3
                },
                {
                    label: 'Industrial Emissions',
                    data: [40, 75, 70, 65, 60, 50],
                    borderColor: 'rgba(75, 0, 130, 1)',  // Indigo color
                    backgroundColor: 'rgba(75, 0, 130, 0.3)',
                    fill: true,
                    tension: 0.3
                },
                {
                    label: 'Transport Emissions',
                    data: [30, 65, 60, 55, 50, 50],
                    borderColor: 'rgba(70, 130, 180, 1)',  // Steelblue color
                    backgroundColor: 'rgba(70, 130, 180, 0.3)',
                    fill: true,
                    tension: 0.3
                },
                {
                    label: 'Waste Management',
                    data: [20, 35, 30, 25, 20, 50],
                    borderColor: 'rgba(255, 69, 0, 1)',  // Red-orange color
                    backgroundColor: 'rgba(255, 69, 0, 0.3)',
                    fill: true,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Energy Usage (%)'
                    }
                }
            }
        }
    });

    // Emissions chart update logic
    const emissionsChart = new Chart(emissionsChartCtx, {
        type: 'line',
        data: {
            labels: ['2000', '2020', '2040', '2060', '2080', '2100'],
            datasets: [{
                label: 'CO2 Emissions (Gt)',
                data: [40, 45, 50, 55, 60, 65],
                borderColor: 'rgba(0, 0, 255, 1)',
                backgroundColor: 'rgba(0, 0, 255, 0.3)',
                fill: true,
                tension: 0.3,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'CO2 Emissions (Gt)'
                    }
                }
            }
        }
    });

    // Update charts function
    function updateCharts() {
        const coalValue = parseInt(coalSlider.value);
        const renewablesValue = parseInt(renewablesSlider.value);
        const oilValue = parseInt(oilSlider.value);
        const deforestationValue = parseInt(deforestationSlider.value);
        const agricultureValue = parseInt(agricultureSlider.value);
        const industryValue = parseInt(industrySlider.value);
        const transportValue = parseInt(transportSlider.value);
        const wasteValue = parseInt(wasteSlider.value);

        // Update energy chart datasets with new values
        energyChart.data.datasets[0].data[5] = coalValue;
        energyChart.data.datasets[1].data[5] = renewablesValue;
        energyChart.data.datasets[2].data[5] = oilValue;
        energyChart.data.datasets[3].data[5] = deforestationValue;
        energyChart.data.datasets[4].data[5] = agricultureValue;
        energyChart.data.datasets[5].data[5] = industryValue;
        energyChart.data.datasets[6].data[5] = transportValue;
        energyChart.data.datasets[7].data[5] = wasteValue;

        // Simple logic for emissions (average of all values, or any other formula)
        emissionsChart.data.datasets[0].data[5] = 100 - (coalValue + renewablesValue + oilValue + deforestationValue + agricultureValue + industryValue + transportValue + wasteValue) / 8;

        // Update the charts
        energyChart.update();
        emissionsChart.update();
    }

    // Add event listeners for all sliders
    coalSlider.addEventListener('input', updateCharts);
    renewablesSlider.addEventListener('input', updateCharts);
    oilSlider.addEventListener('input', updateCharts);
    deforestationSlider.addEventListener('input', updateCharts);
    agricultureSlider.addEventListener('input', updateCharts);
    industrySlider.addEventListener('input', updateCharts);
    transportSlider.addEventListener('input', updateCharts);
    wasteSlider.addEventListener('input', updateCharts);
});
