// This application will create the necessary visualisation for the Belly Button Diversity Dashboard. GJA

// URL
const bbBiodiversityData = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// Variable to store the fetched JSON data
let data;

// Fetch the Belly Button Biodiversity Data
d3.json(bbBiodiversityData).then(jsonData => {

  // Store the fetched data in the 'data' variable
  data = jsonData;

  // Get the ids of the individual persons
  const names = data.names;

  // Populate the dropdown menu with individual names
  const dropdown = d3.select("#selDataset");
  names.forEach(name => {
    dropdown.append("option").text(name).property("value", name);
  });

  // Initialize the plot with the first person
  updatePlots(names[0], data);
});

// Function to handle changes in the dropdown selection
const optionChanged = (selectedValue) => {
  // Update the plots when a new person is selected
  updatePlots(selectedValue, data);
};

// Event listener for changes in the dropdown menu
d3.selectAll("#selDataset").on("change", function() {
  // Get the selected person from the dropdown
  const selectedValue = this.value;

  // Update the plots with the selected person
  updatePlots(selectedValue, data);
});

// Function to update all plots based on the selected person
const updatePlots = (selectedValue, data) => {
  // Filter data for the selected individual
  const selectedData = data.samples.find(sample => sample.id === selectedValue);
  const metadata = data.metadata.find(metadata => metadata.id === +selectedValue);

  // Update the bar chart
  updateBarChart(selectedData, selectedValue);

  // Update the bubble chart
  updateBubbleChart(selectedData, selectedValue);

  // Display sample metadata
  displayMetadata(metadata);

  // Update the gauge chart
  updateGaugeChart(metadata.wfreq);
  
};

// Function to update the bar chart
const updateBarChart = (selectedData, selectedValue) => {
  // Get the top 10 OTUs
  const top10OTUs = selectedData.sample_values.slice(0, 10).reverse();
  const otuIDs = selectedData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
  const otuLabels = selectedData.otu_labels.slice(0, 10).reverse();

  // Create the horizontal bar chart trace
  const trace = {
    type: 'bar',
    orientation: 'h',
    x: top10OTUs,
    y: otuIDs,
    text: otuLabels,
  };

  // Layout for the bar chart
  const layout = {
    title: `Top 10 OTUs for ${selectedValue}`,
    xaxis: { title: 'Sample Values' },
  };

  // Create a new plot with the updated trace and layout
  Plotly.newPlot('bar', [trace], layout);
};

// Function to update the bubble chart
const updateBubbleChart = (selectedData, selectedValue) => {
  // Create the bubble chart trace
  const trace = {
    x: selectedData.otu_ids,
    y: selectedData.sample_values,
    mode: 'markers',
    marker: {
      size: selectedData.sample_values,
      color: selectedData.otu_ids,
      colorscale: 'Viridis',
      showscale: true,
    },
    text: selectedData.otu_labels,
  };

  // Layout for the bubble chart
  const layout = {
    title: `Bubble Chart for ${selectedValue}`,
    xaxis: { title: 'OTU IDs' },
    yaxis: { title: 'Sample Values' },
    height: 550,
    width: 1300,
  };

  // Create a new plot with the updated trace and layout
  Plotly.newPlot('bubble', [trace], layout);
};

// Function to display sample metadata
const displayMetadata = metadata => {
  // Select the metadata panel element
  const metadataPanel = d3.select("#sample-metadata");
  // Clear the existing content in the metadata panel
  metadataPanel.html("");

  // Iterate through key-value pairs in metadata and display
  Object.entries(metadata).forEach(([key, value]) => {
    metadataPanel.append("p").text(`${key}: ${value}`);
  });
};

//GJA