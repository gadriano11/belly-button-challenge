// Function to update the gauge chart
const updateGaugeChart = (wfreq) => {

  // Parse washing frequency value
  const washFreq = wfreq ? parseInt(wfreq) : 0;

  // Create trace for the pie chart
  const numSegments = 10; // Number of segments (excluding the placeholder)

  // Function to generate shades of blue
  const generateBlueColor = (index) => {
    if (index === numSegments) {
      return 'rgba(255, 255, 255, 0)'; // White and not visible
    }

    const baseColor = [173, 216, 230]; // Light Blue
    const blueIntensity = Math.floor(baseColor[2] - index * (baseColor[2] / numSegments));
    return `rgb(${baseColor[0]}, ${baseColor[1]}, ${blueIntensity})`;
  };

  const colors = Array.from({ length: numSegments + 1 }, (_, i) => generateBlueColor(i));

  const trace = {
    values: Array.from({ length: numSegments + 1 }, (_, i) => (i === numSegments ? 9 : 1)),
    type: 'pie',
    showlegend: false,
    hole: 0.5,
    rotation: 90,
    text: Array.from({ length: numSegments + 1 }, (_, i) => (i === numSegments ? '' : i.toString())),
    direction: 'clockwise',
    textinfo: 'text',
    textposition: 'inside',
    marker: {
      colors: colors,
    },
    labels: Array.from({ length: numSegments + 1 }, (_, i) => (i === numSegments ? '' : i.toString())),
    hoverinfo: 'label',
  };

  // Calculate needle position
  const freqCalc = (washFreq / numSegments) * 180;
  const degrees = 180 - freqCalc;
  const radius = 0.5;
  const radians = degrees * Math.PI / 180;
  const aX = (0.01 * Math.cos((degrees - 90) * Math.PI / 180)) + 0.51;
  const aY = (0.01 * Math.sin((degrees - 90) * Math.PI / 180)) + 0.47;
  const bX = (-0.01 * Math.cos((degrees - 90) * Math.PI / 180)) + 0.51;
  const bY = (-0.01 * Math.sin((degrees - 90) * Math.PI / 180)) + 0.47;
  const cX = ((radius * Math.cos(radians)) * 0.5) + 0.51;
  const cY = ((radius * Math.sin(radians)) * 0.5) + 0.47 + 0.05;

  // Create path for the needle
  const path = `M ${aX} ${aY} L ${bX} ${bY} L ${cX} ${cY} Z`;

  // Create data array
  const data = [trace];

  // Create layout
  const layout = {
    shapes: [{
      type: 'path',
      path: path,
      fillcolor: 'red',
      line: {
        color: 'red',
      }
    }],
    title: 'Belly Button Washing Frequency <br> Scrubs per Week',
    xaxis: { visible: false },
    yaxis: { visible: false },
    width: 600,
    height: 500,
    xaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      fixedrange: true,
    },
    yaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      fixedrange: true,
    }
  };
  
  // Debugging purposes for the needle position
  //console.log('Washing Frequency:', washFreq);
  //console.log('freqCalc:', freqCalc);
  //console.log('degrees:', degrees);

  // Render plot
  Plotly.newPlot('gauge', data, layout);
};
