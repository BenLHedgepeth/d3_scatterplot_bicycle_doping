let request = "https://raw.githubusercontent.com/freeCodeCamp/";
request += "ProjectReferenceData/master/cyclist-data.json";

const margin = {
  top: 20,
  right: 30,
  bottom: 20,
  left: 20
};

const width = 800;
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
    return new Date(year.getUTCFullYear(), 0, 1, 0, +minutes, +seconds);
  });


  // Scales
  let xScale = d3.scaleTime(
    d3.extent(years, (d) => d.getFullYear()),
    [0, innerWidth]
  );

  let yScale = d3.scaleTime(
    d3.extent(response, (d) => d.Seconds),
    [innerHeight, 0]
  );

  // Data plotting
  gCircles.selectAll("circles")
    .data(response).enter().append("circle")
    .attr("cx", (d) => xScale(d.Year))
    .attr("cy", (d) => innerHeight - yScale(d.Seconds))
    .attr("r", 7)

  // Axes
  // let xAxis = d3.axisBottom(xScale);
  // let yAxis = d3.axisLeft(yAxis);
  //
  // xAxis(gAxes.append("g").attr("transform", `translate(${width / 2}, ${height - margin.bottom})`));


})
