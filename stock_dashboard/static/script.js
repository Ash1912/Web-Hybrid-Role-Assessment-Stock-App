document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("themeToggle");
    const currentTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", currentTheme);
    themeToggle.textContent = currentTheme === "dark" ? "🌙" : "☀️";

    themeToggle.addEventListener("click", function () {
        const newTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        themeToggle.textContent = newTheme === "dark" ? "🌙" : "☀️";
        updateChartTheme(newTheme);
    });

    fetch("/companies")
        .then(response => response.json())
        .then(companies => {
            let companyList = document.getElementById("companyList");
            companies.forEach(company => {
                let li = document.createElement("li");
                li.textContent = company;
                li.onclick = () => {
                    document.querySelectorAll("li").forEach(item => item.classList.remove("active"));
                    li.classList.add("active");
                    fetchCompanyData(company);
                };
                companyList.appendChild(li);
            });
        });

    function fetchCompanyData(company) {
        fetch(`/data/${company}`)
            .then(response => response.json())
            .then(data => updateChart(data, company));
    }

    let ctx = document.getElementById("stockChart").getContext("2d");
    
    // Function to get theme colors
    function getChartColors(theme) {
        return theme === "dark"
            ? { text: "#fff", 
                opening : { line: "#ffcc00", point: "#ffcc00", bg: "rgba(255, 204, 0, 0.1)" },
                closing : { line: "#ff0000", point: "#ff0000", bg: "rgba(255, 0, 0, 0.1)"}
            }
            : { text: "#000", 
                opening : {line: "#0000FF", point: "#0000FF", bg: "rgba(0, 0, 255, 0.1)" },
                closing : { line: "#00FF00", point: "#00FF00", bg: "rgba(255, 0, 255, 0.1)" }
            };
    }

    let chartColors = getChartColors(currentTheme);

    let stockChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [
            {
                label: "Opening Price",
                data: [],
                borderColor: chartColors.opening.line,
                backgroundColor: chartColors.opening.bg,
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: chartColors.opening.point,
                tension: 0.3
            },
            {
                label: "Closing Price",
                data: [],
                borderColor: chartColors.closing.line,
                backgroundColor: chartColors.closing.bg,
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: chartColors.closing.point,
                tension: 0.3
            },
        ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: chartColors.text } },
                title: { display: true, color: chartColors.text }
            },
            scales: {
                x: { ticks: { color: chartColors.text } },
                y: { ticks: { color: chartColors.text } }
            }
        }
    });

    function updateChartTheme(theme) {
        let colors = getChartColors(theme);
        stockChart.data.datasets[0].borderColor = colors.opening.line;
        stockChart.data.datasets[0].backgroundColor = colors.opening.bg;
        stockChart.data.datasets[0].pointBackgroundColor = colors.opening.point;
        stockChart.data.datasets[1].borderColor = colors.closing.line;
        stockChart.data.datasets[1].backgroundColor = colors.closing.bg;
        stockChart.data.datasets[1].pointBackgroundColor = colors.closing.point;
        stockChart.options.plugins.legend.labels.color = colors.text;
        stockChart.options.plugins.title.color = colors.text;
        stockChart.options.scales.x.ticks.color = colors.text;
        stockChart.options.scales.y.ticks.color = colors.text;
        stockChart.update();
    }

    function updateChart(data, company) {
        document.getElementById("chartTitle").textContent = company;
        stockChart.data.labels = data.map(entry => entry.index_date);
        stockChart.data.datasets[0].data = data.map(entry => entry.open_index_value);
        stockChart.data.datasets[1].data = data.map(entry => entry.closing_index_value);
        stockChart.update();
    }
});
