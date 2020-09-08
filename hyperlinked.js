// http://jsfiddle.net/Bull/4btFx/1/
var data = {
    "nodes": [{
        "name": "Action 4",
        "type": 5,
        "slug": "",
        "value": 265000
    }, {
        "name": "Action 5",
        "type": 6,
        "slug": "",
        "value": 23000
    }, {
        "name": "Action 3",
        "type": 4,
        "slug": "",
        "value": 115000
    }, {
        "name": "Yahoo",
        "type": 1,
        "slug": "www.yahoo.com",
        "entity": "company"
    }, {
        "name": "Google",
        "type": 1,
        "slug": "www.google.com",
        "entity": "company"
    }, {
        "name": "Action 1",
        "type": 2,
        "slug": "",
    }, {
        "name": "Action 2",
        "type": 3,
        "slug": "",
    }, {
        "name": "Bing",
        "type": 1,
        "slug": "www.bing.com",
        "entity": "company"
    }, {
        "name": "Yandex",
        "type": 1,
        "slug": "www.yandex.com)",
        "entity": "company"
    }],
        "links": [{
        "source": 0,
        "target": 3,
        "value": 10
    }, {
        "source": 4,
        "target": 3,
        "value": 1
    }, {
        "source": 1,
        "target": 7,
        "value": 10
    }, {
        "source": 2,
        "target": 4,
        "value": 10
    }, {
        "source": 4,
        "target": 7,
        "value": 1
    }, {
        "source": 4,
        "target": 5,
        "value": 10
    }, {
        "source": 4,
        "target": 6,
        "value": 10
    }, {
        "source": 8,
        "target": 4,
        "value": 1
    }]
}



var w = $(document).width(),
    h = $(document).height(),
    radius = d3.scale.log().domain([0, 312000]).range(["10", "50"]);

var vis = d3.select("body").append("svg:svg")
    .attr("width", w)
    .attr("height", h);

vis.append("defs").append("marker")
    .attr("id", "arrowhead")
    .attr("refX", 17 + 3) /*must be smarter way to calculate shift*/
.attr("refY", 2)
    .attr("markerWidth", 6)
    .attr("markerHeight", 4)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M 0,0 V 4 L6,2 Z"); //this is actual shape for arrowhead

//d3.json(data, function(json) {
var force = self.force = d3.layout.force()
    .nodes(data.nodes)
    .links(data.links)
    .distance(100)
    .charge(-1000)
    .size([w, h])
    .start();



var link = vis.selectAll("line.link")
    .data(data.links)
    .enter().append("svg:line")
    .attr("class", function (d) {
    return "link" + d.value + "";
})
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
})
    .attr("marker-end", function (d) {
    if (d.value == 1) {
        return "url(#arrowhead)"
    } else {
        return " "
    };
});


function openLink() {
    return function (d) {
        var url = "";
        if (d.slug != "") {
            url = d.slug
        } //else if(d.type == 2) {
        //url = "clients/" + d.slug
        //} else if(d.type == 3) {
        //url = "agencies/" + d.slug
        //}
        window.open("//" + url)
    }
}




var node = vis.selectAll("g.node")
    .data(data.nodes)
    .enter().append("svg:g")
    .attr("class", function (d) {
        if (d.entity === "company") {
           return "company node";
        } else {
           return "circle node";
        }
    })
    .call(force.drag);

d3.selectAll(".company").append("rect")
    .attr("width", 20)
    .attr("height", 20)
    .attr("class", function (d) {
    return "node type" + d.type
});

d3.selectAll(".circle").append("circle")
    .attr("class", function (d) {
    return "node type" + d.type
})
    .attr("r", function (d) {
    return radius(d.value) || 10
})
//.style("fill", function(d) { return fill(d.type); })
.call(force.drag);

node.append("svg:image")
    .attr("class", "circle")
    .attr("xlink:href", function (d) {
    return d.img_href
})
    .attr("x", "-16px")
    .attr("y", "-16px")
    .attr("width", "32px")
    .attr("height", "32px")
    .on("click", openLink());

node.append("svg:text")
    .attr("class", "nodetext")
    .attr("dx", 0)
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .text(function (d) {
    return d.name
});

force.on("tick", function () {
    link.attr("x1", function (d) {
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

    node.attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
    });
});
//});