function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var metadataUrl = "/metadata/" + sample;
  // Use d3 to select the panel with id of `#sample-metadata`
  var panelMetadata = d3.select("#sample-metadata");

  // Use `.html("") to clear any existing metadata
  panelMetadata.html("");

  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.
  d3.json(metadataUrl).then(function (data) {
    Object.entries(data).forEach(([key, value]) => {
      panelMetadata.append("h5").text(`${key}: ${value}`);
    });


    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    var level = (data.WFREQ * 20);
    // Trig to calc meter point
    var degrees = 180 - level,
      radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
      pathX = String(x),
      space = ' ',
      pathY = String(y),
      pathEnd = ' Z';
    var path = mainPath.concat(pathX, space, pathY, pathEnd);

    var data = [{
      type: 'scatter',
      x: [0], y: [0],
      marker: { size: 28, color: '850000' },
      showlegend: false,
      name: 'speed',
      text: level,
      hoverinfo: 'text+name'
    },
    {
      values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
      rotation: 90,
      text: ['8-9', '7-8', '6-7', '5-6',
        '4-5', '3-4', '2-3', '1-2', '0-1', ''],
      textinfo: 'text',
      textposition: 'inside',
      marker: {
        colors: ['003319', '006633', '00994C ', '00CC66', '00FF80', '33FF99', '66FFB2', '99FFCC', 'CCFFE5', 'rgb(255,255,255)']
      },
      labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1'],
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];

    var layout = {
      shapes: [{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }],
      title: '<b>Belly ButtonWashing Frequency</b> <br> Scrubs per Week',
      height: 1000,
      width: 1000,
      xaxis: {
        zeroline: false, showticklabels: false,
        showgrid: false, range: [-1, 1]
      },
      yaxis: {
        zeroline: false, showticklabels: false,
        showgrid: false, range: [-1, 1]
      }
    };

    Plotly.newPlot('gauge', data, layout);
  })
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var chartsUrl = "/samples/" + sample;
  d3.json(chartsUrl).then(function (data) {

    // @TODO: Build a Bubble Chart using the sample data
    var bubbleTrace = [{
      x: data.otu_ids,
      y: data.sample_values,
      mode: "markers",
      text: data.otu_labels,
      marker: {
        color: data.otu_id,
        size: data.sample_values
      }
    }];
    var bubbleLayout = {
      height: 600,
      width: 1500,
      colorscale: 'Jet'
    };
    Plotly.newPlot("bubble", bubbleTrace, bubbleLayout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var pieTrace = [{
      labels: data.otu_ids.slice(0, 10),
      values: data.sample_values.slice(0, 10),
      hover_text: data.otu_labels.slice(0, 10),
      type: "pie"
    }];

    Plotly.newPlot("pie", pieTrace);
  })
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
