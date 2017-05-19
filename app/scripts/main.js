'use strict';

(function ($) {

    function handleDragOver(e) {

        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';

    }

    function handleDragEnter(e) {
        $('h2').addClass('drag-over');
    }

    function handleDragLeave(e) {
        $('h2').removeClass('drag-over');
    }

    function handleFileSelect(e) {

        e.stopPropagation();
        e.preventDefault();

        $('h2').removeClass('drag-over');

        var files = e.dataTransfer.files;

        var reader = new FileReader();

        reader.onload = (function (file) {

            return function (e) {

                drawMap(JSON.parse(e.target.result));

            };

        })(files[0]);

        reader.readAsText(files[0]);

    }

    // Setup the dnd listeners.
    var dropZone = document.getElementById('map');
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('dragenter', handleDragEnter, false);
    dropZone.addEventListener('dragleave', handleDragLeave, false);
    dropZone.addEventListener('drop', handleFileSelect, false);


    /**
     * Map Drawing
     */

    var projection = d3.geo.mercator();

    var svg = d3.select("#map").append("svg");

    var path = d3.geo.path()
        .projection(projection);

    var g = svg.append("g");

    var width, height, scale0;

    function sizeMap() {
        width = $('#map').width();
        height = $('#map').height();
        scale0 = (width - 1) / 2 / Math.PI;

        svg.attr({
            width: width,
            height: height
        });

        svg.selectAll("rect")
            .attr("width", width)
            .attr("height", height);
    }

    sizeMap();

    $(window).on('resize', function () {
        sizeMap();
    });

    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height);

    function drawMap(topoData) {

        console.log(topoData);

        g.selectAll("*").remove();

        g.append("path")
            .datum({type: "Sphere"})
            .attr("class", "sphere")
            .attr("d", path);

        g.append("path")
            .datum(topojson.mesh(topoData, topoData.objects[d3.keys(topoData.objects)[0]]))
            .attr("class", "state-boundary")
            .attr("d", path);
    }

    // zoom and pan
    var zoom = d3.behavior.zoom()
        .translate([width / 2, height / 2])
        .scale(scale0)
        .on("zoom", zoomed);

    svg
        .call(zoom)
        .call(zoom.event);

    function zoomed(){
        projection
            .translate(zoom.translate())
            .scale(zoom.scale());

        g.selectAll("path")
            .attr("d", path);
    }
})(jQuery);
