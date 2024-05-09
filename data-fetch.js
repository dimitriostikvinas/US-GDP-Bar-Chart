
const URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"; // static JSON file
document.addEventListener('DOMContentLoaded', function(){
    fetch(URL)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Fetched GDP Data:", data)
        drawBarChart(data.data); // Calls the function defined in d3-bar-chart.js
    })
    .catch(error => {
        console.error("Error fetching the data:", error);
    });
});