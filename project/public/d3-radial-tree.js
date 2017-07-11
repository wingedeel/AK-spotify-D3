var tree;
var baseSvg;
var svgGroup;
var i;
var diagonal;

function displayAsTree(treeData) {
 
  // Establish margin, width, height
  var margin = {top: 20, right: 120, bottom: 20, left: 120},
    width = 960 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;
    
    i = 0;

  // Create a tree layout object with specified width and height
  tree = d3.layout.tree()
    .size([height, width]);
    
  //?
  diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

  // Remove any previously created svg
  var chart = document.getElementById("chart");
  if ( chart != null){
    console.log(typeof baseSvg)
    document.body.removeChild(chart);
  }

// Append a group which holds all nodes and which the zoom Listener can act upon.
    
  // Create an svg in body, of specified width and height
  // Create a <g> within the <svg> and shift by correct margins
  //svg = d3.select("#tree-container").append("svg")
  baseSvg = d3.select("body").append("svg")
    .attr("id", "chart")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    //.call(zoomListener);

  svgGroup = baseSvg.append("g");

  // Create a new object with a property name of children rather than artists
  //let obj3 = JSON.parse(JSON.stringify(treeData));
  let newObj = {};
  newObj.children = treeData.artists;
  root = newObj;
  update(root);

}


function update(source) {

  // Compute the new tree layout.
  // Create an array of nodes each with the following properties:
  // - depth
  // - parent
  var nodes = tree.nodes(root).reverse(),
    links = tree.links(nodes);

  // Set y pos based on depth
    // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Declare the nodes…
  var node = svgGroup.selectAll("g.node")
    .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter the nodes.
  var nodeEnter = node.enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { 
      return "translate(" + d.y + "," + d.x + ")"; })
    .on('click', click)

  nodeEnter.append("circle")
    .attr("r", 10)
    .style("fill", "#fff");

  // Set the text of the node
  // If the node has children set text to left of node
  // Otherwise set text to right of node
  nodeEnter.append("text")
    .attr("x", function(d) { 
      return d.children || d._children ? -13 : 13; })
    .attr("dy", ".35em")
    .attr("text-anchor", function(d) { 
      return d.children || d._children ? "end" : "start"; })
    .text(function(d) { return d.name; })
    .style("fill-opacity", 1);

  // Declare the links…
  var link = svgGroup.selectAll("path.link")
    .data(links, function(d) { return d.target.id; });

  // Enter the links.
  link.enter().insert("path", "g")
    .attr("class", "link")
    .attr("d", diagonal);
}

// ----- CLICK --------- //
function click(d) {
        //d = toggleChildren(d);
    getAndDisplayRelatedArtists(d.name);
}

// ----- ZOOM --------- //
/*
 function zoom() {
  console.log('zoom')
        svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

// define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);
*/
