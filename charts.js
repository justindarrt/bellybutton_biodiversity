function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  })
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;

    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    //console.log(samplesData);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = result.otu_ids;
    var otuLbls = result.otu_labels;
    var otuVals = result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var sorted_otuIds = otuIds.sort((a, b) => b.otuIds - a.otuIds);
    var top10_otuIds = sorted_otuIds.slice(0, 10);
    top10_otuIds = top10_otuIds.map(i => 'OTU ' + i);
    top10_otuIds = top10_otuIds.reverse();
    console.log(top10_otuIds)
    var sorted_otuLbls = otuLbls.sort((a, b) => b.otuIds - a.otuIds);
    var top10_otuLbls = sorted_otuLbls.slice(0, 10);
    top10_otuLbls = top10_otuLbls.reverse();
    console.log(top10_otuLbls)
    var sorted_otuVals = otuVals.sort((a, b) => b.otuIds - a.otuIds);
    var top10_otuVals = sorted_otuVals.slice(0, 10);
    top10_otuVals = top10_otuVals.reverse();
    console.log(top10_otuVals)

    var yticks = top10_otuIds;

    // 8. Create the trace for the bar chart. 
    var trace = {
      x: top10_otuVals,
      y: yticks,
      type: "bar",
      text: top10_otuLbls,
      orientation: "h"
    };
    var barData = [trace];
    // 9. Create the layout for the bar chart. 
    var layout = {
      title: "Top 10 Bacteria Cultures Found",
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, layout);

    var traceBubble = {
      x: otuIds,
      y: otuVals,
      text: otuLbls,
      mode: 'markers',
      marker: {
        colorscale: otuIds,
        color: otuIds,
        size: otuVals
      },
      type: 'scatter'
    };

    var dataBubble = [traceBubble];

    var layoutBubble = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: { title: { text: 'OTU ID' } }
    };

    Plotly.newPlot('bubble', dataBubble, layoutBubble);

    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var washFreq = result.wfreq;
    console.log(washFreq);

    var traceGauge = {
      value: washFreq,
      title: { text: "Belly Button Washing Frequency <br> Scrubs per Week" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        bar: { color: "black" },
        axis: { range: [null, 10] },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "green" }
        ]
      }
    };

    var dataGuage = [traceGauge];

    Plotly.newPlot('gauge', dataGuage);
  });
}
