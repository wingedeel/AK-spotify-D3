var tree;
var baseSvg;
var svgGroup;
var i;
var diagonal;
var root;
var duration;

function displayAsTree(data) {
 
  var margin = {top: 30, right: 120, bottom: 20, left: 120},
    width = 960 - margin.right - margin.left,
    height = 780 - margin.top - margin.bottom;

  i = 0;
  duration = 750;

  tree = d3.layout.tree()
    .size([height, width])
    .separation(function(a, b) {
        return a.parent == b.parent ? 3 : 2.25;
    });

  diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

  // Create body.svg.g
  svg = d3.select("body").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Root object is a simple object with
  // a children property which consists of an
  // array of related artists
  let newObj = {};
  newObj.children = data.artists;
  root = newObj;
  root.x0 = height / 2;
  root.y0 = 0;

  update(root);
}



function update(source) {

  console.log('update ', source)

  // Compute the new tree layout.  
  // Create the nodes and links.
  var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

  // Normalize for fixed-depth. 
  // Set the y pos for each node
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Update the nodes…
  // Create nodes in body.svg.g
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { 
        return d.id || (d.id = ++i); 
      });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", click);

  nodeEnter.append("circle")
      .attr("r", 1e-6)
      .style("fill", function(d) { return d._children ? "#193441" : "#fff"; });

  nodeEnter.append("text")
      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
      .text(function(d) { 
        return d.name; 
      })
      .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
      .attr("r", 4.5)
      .style("fill", function(d) { return d._children ? "#193441" : "#fff"; });

  nodeUpdate.select("text")
      .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      });

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

/* Bostock way */
/*
function click(d) {

  //----------------
  // This node does not know what its children are yet.
  // We have to make an api request for them.
  // Make a request to the Spotify web api for the new artist
  //getAndDisplayRelatedArtists(d.name);
  //----------------

  if (d.children) {
    // If node has children, store the children it has in _children
    // Set the children to null
    d._children = d.children;
    d.children = null;
  } else {
    // If node doesn't have children, reset its children from the stored _children value.
    // Empty the _children value.
    d.children = d._children;
    d._children = null;
  }
  update(d);
}
*/

function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    setChildren(d);
  }
  update(d);
}

function setChildren (node){
        
        // Get related artists for this node
        // First time round, root node does have children property filled with related artists
        // Subsequent times, the clicked on node does not
        spotifyApi.getRelatedArtists(node.id).then(function(data) {
          
            if (!node.children) {
                node.children = []
            }
            data.artists.forEach(function(artist) {
                node.children.push(
                    {
                        //'artist': artist,
                        'children': null,
                        'name': artist.name,
                        //'id': artist.id
                    }
                )

            });
            update(node);
            //centerNode(node);

            console.log('setChildren ', node);
          
        });
}


/* ArtistExplorer way */
/*
function click(d) {
        d = toggleChildren(d);
}

function toggleChildren(d) {
        if (d.children) {
            d.children = null;
            //update(d);
            //centerNode(d);
        } else {
            setChildrenAndUpdateForArtist(d);
        }
        return d;
}

function setChildrenAndUpdateForArtist(node) {
        var artists;
        AE.getRelated(node.artist.id, exploredArtistIds).then(function(artists) {
            if (!node.children) {
                node.children = []
            }

            artists.forEach(function(artist) {

                node.children.push(
                    {
                        'artist': artist,
                        'children': null
                    }
                )
                exploredArtistIds.push(artist.id);

            });
            update(node);
            centerNode(node);
        });
    }
*/