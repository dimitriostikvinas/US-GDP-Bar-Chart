/**
 * Draws a bar chart using a given dataset.
 * @param {Array} dataset - An array of data points, where each point is an array with a date string and a numeric value.
 */
function drawBarChart(dataset) {
    // Set up margins, width, and height
    const margin = { top: 30, right: 20, bottom: 50, left: 80 };
    const width = 1100 - margin.left - margin.right;
    const height = 610 - margin.top - margin.bottom;
    const barWidth = width / 275;

    // Create the SVG container and set up the main group
    const svg = d3.select("#bar-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Prepare formatted years and quarters
    const yearsAndMonths = dataset.map(([dateStr]) => {
        const month = dateStr.substring(5, 7);
        let quarter;
        switch (month) {
            case '01': quarter = 'Q1'; break;
            case '04': quarter = 'Q2'; break;
            case '07': quarter = 'Q3'; break;
            case '10': quarter = 'Q4'; break;
            default: quarter = ''; break;
        }
        return `${dateStr.substring(0, 4)} ${quarter}`;
    });

    // Convert date strings to Date objects for x-axis scaling
    const years = dataset.map(([dateStr]) => new Date(dateStr));

    // Define the x-scale (time) and y-scale (linear)
    const xScale = d3.scaleTime()
        .domain([d3.min(years), d3.max(years)])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, ([, value]) => value)])
        .range([height, 0]);

    // Create x-axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .attr('id', 'x-axis')
        .selectAll("text")
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em");

    // Create y-axis
    svg.append('g')
        .call(d3.axisLeft(yScale))
        .attr('id', 'y-axis');

    // Add label for the y-axis
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -200)
        .attr('y', 50)
        .text('Gross Domestic Product (Billions)');

    // Scale dataset to align with the y-scale
    const scaledDataset = dataset.map(([dateStr, value]) => [dateStr, height - yScale(value)]);

    // Initialize tooltip for displaying data details on hover
    const tooltip = d3.select("#tooltip");

    // Draw the bar chart
    svg.selectAll("rect")
        .data(scaledDataset)
        .enter()
        .append("rect")
        .attr("data-date", ([dateStr]) => dateStr)
        .attr("data-gdp", ([, value]) => value)
        .attr("x", (d, i) => xScale(years[i]))
        .attr("y", (d) => height - d[1])
        .attr("width", barWidth)
        .attr("height", (d) => d[1])
        .attr('index', (d, i) => i)
        .style('fill', '#33adff')
        .on('mouseover', (event, d) => {
            const i = scaledDataset.indexOf(d);
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltip.html(`${yearsAndMonths[i]}<br>$${dataset[i][1]} Billions`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on('mousemove', (event) => {
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on('mouseout', () => {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
}
