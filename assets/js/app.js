var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  
var chartGroup= svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.select(".chart").append("div").attr("class","tooltip").style("opacity",0);

d3.csv('assets/data/healthData.csv').then(function(healthData, err) {
  if (err) throw err;
  //parse data
  healthData.forEach(function(data) {
    data.smokes = +data.smokes
    data.income = +data.income
  });
  // console.log(healthData);

// Create scaling functions   
  var yLinearScale= d3.scaleLinear().range([height, 0]).domain([9, d3.max(healthData, d => d.smokes)]);
  var xLinearScale= d3.scaleLinear().range([0, width]).domain([4, d3.max(healthData, d=> d.income)]);
// Create axis function
  var bottomAxis= d3.axisBottom(xLinearScale)
  var leftAxis= d3.axisLeft(yLinearScale);

  //Add axis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
      .call(leftAxis);

  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.income))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", 20)
    .attr("fill", "lightblue")
    .attr("opacity", ".5")
    .attr("stroke", "white");  

  chartGroup
    .append("text")
    .style("text-anchor", "middle")
    .style("font-family", "sans-serif")
    .style("font-size", "10px")
    .selectAll("tspan")
    .data(healthData)
    .enter()
    .append("tspan")
    .attr("x", function(data) {
        return xLinearScale(data.income);
    })
  .attr("y", function(data) {
      return yLinearScale(data.smokes -.02);
  })
  .text(function(data) {
      return data.abbr
  });

  // Initialize Tooltip
  var toolTip = d3.tip()
  .attr("class", "tooltip")
  .offset([80, -60])
  .style('position', 'absolute')
  .style('background', 'darkseagreen')
  .style('pointer-events', 'none')
  .html(function(data) {
    return (`<br><b>Age of Smokers:</b> ${data.smokes}%<br><b>Yearly Income ($):</b> ${data.income} `)
  });

    // tooltip in the chart
    chartGroup.call(toolTip);   

    // Add an on mouseover event   
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
  })

  // Add an on mouseout event   
  .on("mouseout", function(data, index) {
      toolTip.hide(data);
  });


  // Create axes labels  
  chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left - 5)
      .attr("x", 0 - (height / 1.30))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Age of Smokers");

  chartGroup.append("text")
      .attr("transform", `translate(${width / 2.5}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Yearly Income (%)");
    
});
