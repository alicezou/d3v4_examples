var svg = d3.select("svg");

var width = svg.attr("width");
var height = svg.attr("height");
var margin = {top: 10, right: 10, bottom: 30, left: 10};


var url_pre = "localhost:5000/";
const linkedByIndex = {};


svg_nodes = svg.call(d3.zoom().on("zoom", zoomed)).append("g");

svg_nodes.append("defs").append("marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 20)
    .attr("refY", 0)
    .attr("markerWidth", 8)
    .attr("markerHeight", 8)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");
svg_legend = svg.call(d3.zoom().on("zoom", zoomed)).append("g");

var color = d3.scaleOrdinal(d3.schemeCategory10);


var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function (d) {
        return d.id;
    }))
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width / 2, height / 2));

d3.json("long_list.json", createGraph);

function createGraph(error, graph) {

    if (error) throw error;


    graph.links.forEach(d => {
        linkedByIndex[`${d.source},${d.target}`] = 1;
    });

    var link = svg_nodes.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke", function (d) {
            return color(d.type + 10);
        })
        .attr("marker-end", "url(#arrow)");


    var KGPLVar = svg_nodes.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.var)
        .enter().append("circle")
        .attr("r", 10)
        .attr("fill", function (d) {
            if (d.root == "true") return color(d.root);
            return color(d.type);
        })
        .on('mouseover', fade(0.1))
        .on('mouseout', fade(1))
        .on("dblclick", openLink())
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));


    var KGPLVal = svg_nodes.append("g")
        .attr("class", "nodes")
        .selectAll("rect")
        .data(graph.val)
        .enter().append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", function (d) {
            if (d.root == "true") return color(d.root);
            return color(d.type);
        })
        .on('mouseover', fade(0.1))
        .on('mouseout', fade(1))
        .on("dblclick", openLink())
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    const all_nodes = graph.var.concat(graph.val);
    var node_labels = svg_nodes.append("g").attr("class", "labels").selectAll("g")
        .data(all_nodes)
        .enter().append("g")
        .append("text")
        .attr("x", 14)
        .attr("y", ".31em")
        .style("font-family", "sans-serif")
        .style("font-size", "0.7em")
        .text(function (d) {
            return d.id;
        });


    KGPLVal.append("title")
        .text(function (d) {
            return d.id;
        });

    KGPLVar.append("title")
        .text(function (d) {
            return d.id;
        });
    var keys = graph.users;

    var user_legends = svg_legend.selectAll("legend_line")
        .data(keys)
        .enter().append("text")
        .attr("x", -width / 4)
        .attr("y", function (d, i) {
            return i * 10
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function (d) {
            return color(d[1])
        })
        .text(function (d) {
            return d[0]
        })
        .style("font-size", "0.5em")

        .call(d3.drag()
            .subject(function () {
                var t = d3.select(this);
                // console.log(this.parentNode);
                return {x: t.attr('x'), y: t.attr('y')}
            })
            .on('drag', function (d, i) {
                // console.log('dragging text');
                d3.select(this).attr('y', function () {
                    return d3.mouse(this)[1];
                });
                d3.select(this).attr('x', function () {
                    return d3.mouse(this)[0];
                });

            }));


    simulation
        .nodes(all_nodes)
        .on("tick", ticked);
    console.log(graph.links);
    simulation.force("link")
        .links(graph.links);


    function ticked() {
        link
            .attr("x1", function (d) {
                return d.source.x;
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        KGPLVar
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            });
        KGPLVal
            .attr("x", function (d) {
                return d.x - 10;
            })
            .attr("y", function (d) {
                return d.y - 10;
            });
        node_labels
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
    }


    function fade(opacity) {
        return d => {
            KGPLVal.style('stroke-opacity', function (o) {
                console.log(isConnected(d,o));
                console.log(d);
                console.log(o);

                const thisOpacity = isConnected(d.id, o.id) ? 1 : opacity;

                this.setAttribute('fill-opacity', thisOpacity);
                return thisOpacity;
            });

            KGPLVar.style('stroke-opacity', function (o) {
                const thisOpacity = isConnected(d.id, o.id) ? 1 : opacity;
                this.setAttribute('fill-opacity', thisOpacity);
                return thisOpacity;
            });

            link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity));
            link.attr('marker-end', o => (opacity === 1 || o.source === d || o.target === d ? 'url(#arrow)' : 'url(#end-arrow-fade)'));
        };
    }
}


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
    svg_nodes.attr("transform", "translate(" + d3.event.transform.x + "," + d3.event.transform.y + ")" + " scale(" + d3.event.transform.k + ")");
    svg_legend.attr("transform", "translate(" + d3.event.transform.x + "," + d3.event.transform.y + ")" + " scale(" + d3.event.transform.k + ")");
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


function isConnected(a, b) {
    return linkedByIndex[`${a},${b}`] || linkedByIndex[`${b},${a}`] || a === b;
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

