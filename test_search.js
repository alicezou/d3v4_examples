var width = 900,
    height = 590;
    
var zoom = d3.behavior.zoom().scaleExtent([0.1,5]).on("zoom", redraw);
var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(zoom)
    .on("dblclick.zoom", null)
    .append('g');

//INPUT DATA
var links = [
    {source: 'N1', target: 'N2'},
    {source: 'N1', target: 'N3'},
    {source: 'N2', target: 'N3'},
    {source: 'N3', target: 'N4'},
];
  
var nodes = [ 
    {id: 'N1', name: 'A'},
    {id: 'N2', name: 'B'},
    {id: 'N3', name: 'C'},
    {id: 'N4', name: 'D'},
];

//CONNECTIONS
var hash_lookup = [];
nodes.forEach(function(d, i) {
  hash_lookup[d.id] = d;
});
links.forEach(function(d, i) {
  d.source = hash_lookup[d.source];
  d.target = hash_lookup[d.target];
});

//FORCE LAYOUT
var force = d3.layout.force()
    .size([width, height])
    .nodes(d3.values(nodes))
    .links(links)
    .on('tick', tick)
    .linkDistance(100)
    .gravity(.15)
    .friction(.8)
    .linkStrength(1)
    .charge(-425)
    .chargeDistance(600)
    .start();

//LINKS
var link = svg.selectAll('.link')
    .data(links)
    .enter().append('line')
    .attr('class', 'link');

//NODES
var node = svg.selectAll('.node')
    .data(force.nodes())
    .enter().append('circle')
    .attr('class', 'node')
    .attr('r', width * 0.01)

//LABELS
var text_center = false;
var nominal_text_size = 12;
var max_text_size = 22;
var nominal_base_node_size = 8;
var max_base_node_size = 36;    
var size = d3.scale.pow().exponent(1)
  .domain([1,100])
  .range([8,24]);
    
var text = svg.selectAll(".text")
    .data(nodes)
    .enter().append("text")
    .attr("dy", ".35em")
	.style("font-size", nominal_text_size + "px")

	if (text_center)
	 text.text(function(d) { return d.name; })
	.style("text-anchor", "middle");
    
	else 
	text.attr("dx", function(d) {return (size(d.size)|| nominal_base_node_size);})
    .text(function(d) { return '\u2002'+d.name; });

//ZOOM AND PAN
function redraw() {
    svg.attr("transform",
        "translate(" + d3.event.translate + ")"
        + " scale(" + d3.event.scale + ")");
    }
    
var drag = force.drag()
      .on("dragstart", function(d) {
		d3.event.sourceEvent.stopPropagation();
      });

//NODES IN SPACE
function tick(e) {

    text.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    
    node.attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; })
        .call(force.drag);

    link.attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });

};

//AUTOCOMPLETE SEARCH
var optArray = [];
for (var i = 0; i < nodes.length - 1; i++) {
    optArray.push(nodes[i].name);
}
optArray = optArray.sort();

//$(function () {
//    $("#search").autocomplete({
//        source: optArray
//    });
//});
window.searchNode = searchNode;

function searchNode() {
    var selectedVal = document.getElementById('search').value;
    if (selectedVal == 'none') {}
    else {
        var selected = node.filter(function (d, i) {
            return d.name != selectedVal;
        });
         var selectedText = text.filter(function (d, i) {
            return d.name != selectedVal;
        });
        selected.style("opacity", "0");
        selectedText.style("opacity", "0");
        var link = svg.selectAll(".link")
            link.style("opacity", "0");
        d3.selectAll(".node, .link, .text").transition()
            .duration(3000)
            .style("opacity", '1');
            
            var selectedNode = node
                .filter(function (d, i) { return d.name == selectedVal; })
                .datum();
                
            var scale = zoom.scale();
            var desiredPosition = { x: 200, y: 200 }; // constants, set to svg center point
            zoom.translate([desiredPosition.x - selectedNode.x*scale, desiredPosition.y - selectedNode.y*scale]);
            zoom.event(svg);
    }
}