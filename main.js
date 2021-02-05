let request = "https://raw.githubusercontent.com/freeCodeCamp/";
request += "ProjectReferenceData/master/cyclist-data.json";

const regex = /[confessed|associated|admitted|implicated|payments|high|removed|failed|alleged|drug|positive|testified|doping|illegal|stripped]/;

const red = d3.color("#8B0000");
const blue = d3.color("#0C2340");

const margin = {
  top: 20,
  right: 60,
  bottom: 50,
  left: 60
};

const width = 950;
const innerWidth = width - (margin.left + margin.right);
const height = 575;
const innerHeight = height - (margin.top + margin.bottom);

let section = d3.select(".container");

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
  let [min_year, max_year] = d3.extent(years);

  let xScale = d3.scaleTime(
    [new Date(min_year.getUTCFullYear() - 2, 0), new Date(max_year.getUTCFullYear() + 2, 0)],
    [0, innerWidth]
  );

  let yScale = d3.scaleTime(
    d3.extent(times),
    [0, innerHeight]
  );

  // Axes
  let xAxis = d3.axisBottom(xScale);
  let yAxis = d3.axisLeft(yScale)
                .tickFormat(d3.timeFormat("%M:%S"));

  xAxis(svg.append("g").attr(
    "transform", `translate(${margin.left}, ${height - margin.bottom})`)
  );
  yAxis(svg.append("g").attr(
    "transform", `translate(${margin.left}, ${margin.top})`)
  );

  svg.append("g")
    .attr("transform", `translate(${margin.left * 0.25}, ${200}), rotate(270)`)
    .append("text").text("Time (in minutes)")
    .style("font-size", '12px').style("font-family", "Arial")

  svg.append("text")
    .attr("x", width * 0.5).attr("y", height - margin.bottom * .5)
    .text("Years").style("font-size", '12px').style("font-family", "Arial")

  // Data plotting
  gCircles.selectAll("circle")
    .data(response).enter().append("circle")
    .attr("cx", (d, i) => xScale(years[i]))
    .attr("cy", (d, i) => yScale(times[i]))
    .attr("r", 7)
    .attr("fill", (d) => {
      const accusation = d.Doping.toLowerCase();
      return regex.test(accusation) ? red : blue
    });

})

// legend
const allegation = "Riders with doping allegations";
const noAllegation = "No doping allegations";
let legend = svg.append('g')
      .attr(
        "transform",
        `translate(${innerWidth - 200}, ${innerHeight * 0.5})`
      ).attr("height", 200);

[[red, allegation], [blue, noAllegation]].forEach(function(color, i) {
  const gKey = legend.append('g')
      .attr('transform', `translate(0, ${i * 25})`);
  gKey.append("rect")
        .attr("width", 20).attr("height", 20)
        .attr("x", 0).attr("y", i * 10)
        .attr("fill", color[0]);
  gKey.append("text").text(color[1])
        .attr('x', 25).attr("y", (i + 1) * 12.5)
        .style("font-size", '12px').style("font-family", "Arial")
});


//tooltip
// section.append("div")
//       .attr('class', 'tip')
//
// svg.append("circle")
//     .attr("x", 500).attr("y", 200).attr('r', 10)

console.log(gCircles.selectAll("circle"));

// circles.on("mouseover", function(event) {
//   console.log("Hello")
// })
