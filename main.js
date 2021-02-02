let request = "https://raw.githubusercontent.com/freeCodeCamp/";
request += "ProjectReferenceData/master/cyclist-data.json";

const margin = {
  top: 20,
  right: 60,
  bottom: 20,
  left: 60
};

const width = 950;
const innerWidth = width - (margin.left + margin.right);
const height = 575;
const innerHeight = height - (margin.top + margin.bottom);

let svg = d3.select(".container").append("svg")
  .attr("width", width).attr("height", height)
  .attr("class", "svg_box");

let gCircles = svg.append('g')
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.json(request).then((response) => {

  let years = response.map((x) => new Date(x.Year, 0));
  let times = years.map((year, i) => {
    let [minutes, seconds] = response[i].Time.split(":");
    return new Date(0, 0, 1, 0, +minutes, +seconds); // passing year causes y-axis render to break
  });


  // Scales
  let xScale = d3.scaleTime(
    d3.extent(years),
    [0, innerWidth]
  );
  console.log(xScale.domain())
  let yScale = d3.scaleTime(
    d3.extent(times),
    [0, innerHeight]
  );

  console.log(yScale.domain())

  // Axes
  let xAxis = d3.axisBottom(xScale);
  let yAxis = d3.axisLeft(yScale)
                .tickFormat(d3.timeFormat("%M:%S"));

  // Data plotting
  gCircles.selectAll("circles")
    .data(response).enter().append("circle")
    .attr("cx", (d, i) => xScale(years[i]))
    .attr("cy", (d, i) => yScale(times[i]))
    .attr("r", 7);


  xAxis(svg.append("g").attr("transform", `translate(${margin.left}, ${height - margin.bottom})`));
  yAxis(svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`));

})
