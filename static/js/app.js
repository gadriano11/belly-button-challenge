// This application will create the necessary visualisation for the Belly Button Diversity Dashboard

// Fetch the data
const bbBiodiversityData = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// Fetches data using d3.json and logs it to the console to verify successful retrieval.
d3.json(bbBiodiversityData).then(function(data) {
    console.log(data);

    // Fetch biodiversity data using d3.json and handle it in the promise
    d3.json(bbBiodiversityData).then(data => {
        // Extract id from names in the dataset
        const names = data.names;
        
        // Populate the dropdown menu with person ids
        const dropdown = d3.select("#selDataset");
        names.forEach(name => {
            dropdown.append("option").text(name).property("value", name);
        });
        
        // Initialize the plot with the first person
        updatePlots(names[0], data);
    });
    
    // Listen for changes in the dropdown menu with id 'selDataset'
    d3.selectAll("#selDataset").on("change", function() {

        // Get the selected id from the dropdown
        const selectedValue = this.value;

        // Update the plots with the selected id
        updatePlots(selectedValue, data);
    });

    // Function to update all plots based on the selected id
    const updatePlots = (selectedValue, data) => {
        // Filter data for the selected id
        const selectedData = data.samples.find(sample => sample.id === selectedValue);
        const metadata = data.metadata.find(metadata => metadata.id === +selectedValue);
      
        // Update the barchart
        updateBarChart(selectedData, selectedValue);
      
        // Update the bubble chart
        updateBubbleChart(selectedData, selectedValue);
      
        // Display sample metadata;
        displayMetadata(metadata);
    };

    // Function to update the bar chart
    const updateBarChart = (selectedData, selectedValue) => {
        // Get the top 10 OTUs
        const top10OTUs = selectedData.sample_values.slice(0, 10).reverse();
        const otuIDs = selectedData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
        const otuLabels = selectedData.otu_labels.slice(0, 10).reverse();
      
        // Create and update the horizontal bar chart trace
        const trace = {
            type: 'bar',
            orientation: 'h',
            x: top10OTUs,
            y: otuIDs,
            text: otuLabels,
        };

        // Define the layout for the bar chart  
        const layout = {
            title: `Top 10 OTUs for ${selectedValue}`,
            xaxis: { title: 'Sample Values' },
        };

        // Create a new plot with the updated trace and layout  
        Plotly.newPlot('bar', [trace], layout, { ...layout, height: 1000, width: 1000 });
    };

    // Function to update the bubble chart
    const updateBubbleChart = (selectedData, selectedValue) => {
        // Create and update the bubble chart trace
        const trace = {
            x: selectedData.otu_ids,
            y: selectedData.sample_values,
            mode: 'markers',
            marker: {
                size: selectedData.sample_values,
                color: selectedData.otu_ids,

                // Color scale for the bubble chart
                // Show color scale
                colorscale: 'Viridis',
                showscale: true,
            },
            text: selectedData.otu_labels,
        };

        // Define the layout for the bubble chart
        const layout = {
            title: `Bubble Chart for ${selectedValue}`,
            xaxis: { title: 'OTU IDs' },
            yaxis: { title: 'Sample Values' },
        };

        // Create a new plot with the updated trace and layout  
        Plotly.newPlot('bubble', [trace], { ...layout, height: 500, width: 1200 });
    };

    // Function to display sample metadata
    const displayMetadata = metadata => {
        // Select the metadata panel element
        const metadataPanel = d3.select("#sample-metadata");

        // Clear the existing content in the metadata panel
        metadataPanel.html("");
      
        // Iterate through key-value pairs in metadata and display them
        Object.entries(metadata).forEach(([key, value]) => {
            metadataPanel.append("p").text(`${key}: ${value}`);
        });
    };
});