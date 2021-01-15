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
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv('./assets/data/healthData.csv').then(function(healthData, err) {
  if (err) throw err;
  //parse data
  healthData.forEach(function(data) {
    data.healthcare = +data.healthcare
    data.obesity = +data.obesity
  });

  var yLinearScale= d3.scaleLinear().range([height, 0]);
  var xLinearScale= d3.scaleLinear().range([0, height]);

  var bottomAxis= d3.axisBottom(xLinearScale)
  var leftAxis= d3.axisLeft(yLinearScale);

  var xAxis= chartGroup.append('g')
    .classed('x-axis', true)
    .attr('transform', `translate(0, ${height})`)
    .call(bottomAxis);

})