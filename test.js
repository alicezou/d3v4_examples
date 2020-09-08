var svg = d3.select("svg");

var width = svg.attr("width");
var height = svg.attr("height");
var url_pre = "localhost:5000/";
svg = svg.call(d3.zoom().on("zoom", zoomed)).append("g");
/*svg.append("defs").append("marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 20)
    .attr("refY", 0)
    .attr("markerWidth", 8)
    .attr("markerHeight", 8)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");*/
var color = d3.scaleOrdinal(d3.schemeCategory10);

var dummy = [0];
    var retangulo = svg.append("rect")
    		.attrs({
          "x": 480,
          "y": 141,
          "width": 40,
          "height": 30
        })
    		.style("fill", "blue");
svg.append("g").append("rect")
    .attrs({
        "x": 480,
        "y": 141,
        "width": 40,
        "height": 30
    })
    .style("fill", "blue");

/*
var legend_line = svg.append("g").attr("class", "legend_line").selectAll("legend_line")
    .enter().append("circle")
    .data(dummy)
    .attr("cx", -100)
    .attr("cy", 100)
    .attr("r", 20)
    .style("fill", color(1));
*/


function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

function zoomed() {
    svg.attr("transform", "translate(" + d3.event.transform.x + "," + d3.event.transform.y + ")" + " scale(" + d3.event.transform.k + ")");
}

function openLink() {
    return function (d) {
        var url = "";
        if (d.id != "") {
            url = url_pre.concat(d.id)
        } else {
            console.log("ERROR: No url")
        }
        window.open(url)
    }
}


/*
var data = {
    "val": [
        {
            "id": "val/0",
            "type": 1,
            "creater":"UserA"
        },
        {
            "id": "val/1",
            "type": 1,
            "creater":"UserA"
        }],
    "var": [{
        "id": "var/0",
        "type": 2,
        "creater":"UserB"
    }],
    "links": [
        {
            "source": "var/0",
            "target": "val/1",
            "type": 1
        }]
};*/

// createGraph(false, data);

