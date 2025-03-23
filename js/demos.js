// Additional interactive elements for the website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize MathJax if available
    if (typeof MathJax !== 'undefined') {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    }
    
    // Create interactive neural network demo
    createNeuralNetworkDemo();
    
    // Create interactive gradient descent demo
    createGradientDescentDemo();
    
    // Create interactive activation functions demo
    createActivationFunctionsDemo();
});

// Neural Network Interactive Demo
function createNeuralNetworkDemo() {
    const demoContainer = document.getElementById('neural-network-demo');
    if (!demoContainer) return;
    
    // Create canvas for neural network visualization
    const canvas = document.createElement('canvas');
    canvas.id = 'nn-canvas';
    canvas.width = 600;
    canvas.height = 400;
    demoContainer.appendChild(canvas);
    
    // Create controls
    const controls = document.createElement('div');
    controls.className = 'demo-controls';
    controls.innerHTML = `
        <div class="control-group">
            <label for="nn-layers">Number of hidden layers:</label>
            <input type="range" id="nn-layers" min="1" max="3" value="1" step="1">
            <span id="nn-layers-value">1</span>
        </div>
        <div class="control-group">
            <label for="nn-neurons">Neurons per hidden layer:</label>
            <input type="range" id="nn-neurons" min="2" max="8" value="4" step="1">
            <span id="nn-neurons-value">4</span>
        </div>
        <button id="nn-redraw">Redraw Network</button>
    `;
    demoContainer.appendChild(controls);
    
    // Get the canvas context
    const ctx = canvas.getContext('2d');
    
    // Initial network parameters
    let hiddenLayers = 1;
    let neuronsPerLayer = 4;
    
    // Update displayed values when sliders change
    document.getElementById('nn-layers').addEventListener('input', function() {
        hiddenLayers = parseInt(this.value);
        document.getElementById('nn-layers-value').textContent = hiddenLayers;
    });
    
    document.getElementById('nn-neurons').addEventListener('input', function() {
        neuronsPerLayer = parseInt(this.value);
        document.getElementById('nn-neurons-value').textContent = neuronsPerLayer;
    });
    
    // Redraw network when button is clicked
    document.getElementById('nn-redraw').addEventListener('click', function() {
        drawNeuralNetwork(ctx, canvas.width, canvas.height, hiddenLayers, neuronsPerLayer);
    });
    
    // Initial draw
    drawNeuralNetwork(ctx, canvas.width, canvas.height, hiddenLayers, neuronsPerLayer);
}

// Function to draw a neural network on canvas
function drawNeuralNetwork(ctx, width, height, hiddenLayers, neuronsPerLayer) {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Colors
    const inputColor = '#4472C4';
    const hiddenColor = '#ED7D31';
    const outputColor = '#70AD47';
    
    // Network structure
    const layers = [3, ...Array(hiddenLayers).fill(neuronsPerLayer), 2];
    const layerCount = layers.length;
    
    // Spacing
    const horizontalSpacing = width / (layerCount + 1);
    const maxNeurons = Math.max(...layers);
    const verticalSpacing = height / (maxNeurons + 1);
    const neuronRadius = 15;
    
    // Draw neurons and connections
    for (let i = 0; i < layerCount; i++) {
        const neuronCount = layers[i];
        const layerX = horizontalSpacing * (i + 1);
        const startY = (height - (neuronCount - 1) * verticalSpacing) / 2;
        
        // Determine color based on layer type
        let color;
        if (i === 0) color = inputColor;
        else if (i === layerCount - 1) color = outputColor;
        else color = hiddenColor;
        
        // Draw layer label
        ctx.fillStyle = '#333';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        let layerName;
        if (i === 0) layerName = 'Input Layer';
        else if (i === layerCount - 1) layerName = 'Output Layer';
        else layerName = `Hidden Layer ${i}`;
        ctx.fillText(layerName, layerX, 20);
        
        // Draw neurons
        for (let j = 0; j < neuronCount; j++) {
            const y = startY + j * verticalSpacing;
            
            // Draw neuron
            ctx.beginPath();
            ctx.arc(layerX, y, neuronRadius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Draw connections to next layer
            if (i < layerCount - 1) {
                const nextLayerNeurons = layers[i + 1];
                const nextLayerX = horizontalSpacing * (i + 2);
                const nextLayerStartY = (height - (nextLayerNeurons - 1) * verticalSpacing) / 2;
                
                for (let k = 0; k < nextLayerNeurons; k++) {
                    const nextY = nextLayerStartY + k * verticalSpacing;
                    
                    ctx.beginPath();
                    ctx.moveTo(layerX + neuronRadius, y);
                    ctx.lineTo(nextLayerX - neuronRadius, nextY);
                    ctx.strokeStyle = 'rgba(150, 150, 150, 0.4)';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }
}

// Gradient Descent Interactive Demo
function createGradientDescentDemo() {
    const demoContainer = document.getElementById('gradient-descent-demo');
    if (!demoContainer) return;
    
    // Create canvas for gradient descent visualization
    const canvas = document.createElement('canvas');
    canvas.id = 'gd-canvas';
    canvas.width = 600;
    canvas.height = 400;
    demoContainer.appendChild(canvas);
    
    // Create controls
    const controls = document.createElement('div');
    controls.className = 'demo-controls';
    controls.innerHTML = `
        <div class="control-group">
            <label for="gd-learning-rate">Learning Rate:</label>
            <input type="range" id="gd-learning-rate" min="0.01" max="0.5" value="0.1" step="0.01">
            <span id="gd-learning-rate-value">0.1</span>
        </div>
        <div class="control-group">
            <label for="gd-iterations">Iterations:</label>
            <input type="range" id="gd-iterations" min="5" max="50" value="20" step="5">
            <span id="gd-iterations-value">20</span>
        </div>
        <button id="gd-start">Start Descent</button>
        <button id="gd-reset">Reset</button>
    `;
    demoContainer.appendChild(controls);
    
    // Get the canvas context
    const ctx = canvas.getContext('2d');
    
    // Initial parameters
    let learningRate = 0.1;
    let iterations = 20;
    let animationId = null;
    let currentIteration = 0;
    let path = [];
    
    // Update displayed values when sliders change
    document.getElementById('gd-learning-rate').addEventListener('input', function() {
        learningRate = parseFloat(this.value);
        document.getElementById('gd-learning-rate-value').textContent = learningRate.toFixed(2);
    });
    
    document.getElementById('gd-iterations').addEventListener('input', function() {
        iterations = parseInt(this.value);
        document.getElementById('gd-iterations-value').textContent = iterations;
    });
    
    // Start gradient descent animation
    document.getElementById('gd-start').addEventListener('click', function() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        
        // Reset
        currentIteration = 0;
        path = [{x: 250, y: 50}]; // Starting point
        
        // Start animation
        animateGradientDescent();
    });
    
    // Reset button
    document.getElementById('gd-reset').addEventListener('click', function() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        
        // Reset and redraw
        currentIteration = 0;
        path = [];
        drawContourPlot(ctx, canvas.width, canvas.height);
    });
    
    // Function to animate gradient descent
    function animateGradientDescent() {
        if (currentIteration >= iterations) {
            return;
        }
        
        // Calculate next point using gradient descent
        const currentPoint = path[path.length - 1];
        const gradient = calculateGradient(currentPoint.x, currentPoint.y);
        
        const nextPoint = {
            x: currentPoint.x - learningRate * gradient.dx,
            y: currentPoint.y - learningRate * gradient.dy
        };
        
        path.push(nextPoint);
        currentIteration++;
        
        // Redraw
        drawContourPlot(ctx, canvas.width, canvas.height);
        drawPath(ctx, path);
        
        // Continue animation
        animationId = requestAnimationFrame(animateGradientDescent);
    }
    
    // Initial draw
    drawContourPlot(ctx, canvas.width, canvas.height);
}

// Function to draw contour plot
function drawContourPlot(ctx, width, height) {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw contour lines
    for (let i = 0; i < width; i += 5) {
        for (let j = 0; j < height; j += 5) {
            const value = calculateLoss(i, j);
            const color = getColorForValue(value);
            
            ctx.fillStyle = color;
            ctx.fillRect(i, j, 5, 5);
        }
    }
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(width/2, 0);
    ctx.lineTo(width/2, height);
    ctx.moveTo(0, height/2);
    ctx.lineTo(width, height/2);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw minimum point
    ctx.beginPath();
    ctx.arc(width/2, height/2, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
}

// Function to draw gradient descent path
function drawPath(ctx, path) {
    if (path.length < 2) return;
    
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    
    for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
    }
    
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw points
    for (let i = 0; i < path.length; i++) {
        ctx.beginPath();
        ctx.arc(path[i].x, path[i].y, 3, 0, Math.PI * 2);
        ctx.fillStyle = i === 0 ? 'green' : (i === path.length - 1 ? 'red' : 'blue');
        ctx.fill();
    }
}

// Simple loss function for visualization
function calculateLoss(x, y) {
    const centerX = 300;
    const centerY = 200;
    const dx = (x - centerX) / 100;
    const dy = (y - centerY) / 100;
    return dx * dx + dy * dy;
}

// Calculate gradient of the loss function
function calculateGradient(x, y) {
    const centerX = 300;
    const centerY = 200;
    const dx = 2 * (x - centerX) / 100;
    const dy = 2 * (y - centerY) / 100;
    return { dx, dy };
}

// Get color based on value for contour plot
function getColorForValue(value) {
    // Simple color mapping from blue (low) to red (high)
    const r = Math.min(255, Math.floor(value * 255));
    const b = Math.min(255, Math.floor(255 - value * 255));
    return `rgb(${r}, 50, ${b})`;
}

// Activation Functions Interactive Demo
function createActivationFunctionsDemo() {
    const demoContainer = document.getElementById('activation-functions-demo');
    if (!demoContainer) return;
    
    // Create canvas for activation functions visualization
    const canvas = document.createElement('canvas');
    canvas.id = 'af-canvas';
    canvas.width = 600;
    canvas.height = 300;
    demoContainer.appendChild(canvas);
    
    // Create controls
    const controls = document.createElement('div');
    controls.className = 'demo-controls';
    controls.innerHTML = `
        <div class="control-group">
            <label>Activation Function:</label>
            <select id="af-function">
                <option value="sigmoid">Sigmoid</option>
                <option value="relu">ReLU</option>
                <option value="tanh">Tanh</option>
                <option value="leaky_relu">Leaky ReLU</option>
            </select>
        </div>
        <div class="control-group">
            <label>Show Derivative:</label>
            <input type="checkbox" id="af-derivative">
        </div>
    `;
    demoContainer.appendChild(controls);
    
    // Get the canvas context
    const ctx = canvas.getContext('2d');
    
    // Initial parameters
    let activationFunction = 'sigmoid';
    let showDerivative = false;
    
    // Update when function changes
    document.getElementById('af-function').addEventListener('change', function() {
        activationFunction = this.value;
        drawActivationFunction(ctx, canvas.width, canvas.height, activationFunction, showDerivative);
    });
    
    // Update when derivative checkbox changes
    document.getElementById('af-derivative').addEventListener('change', function() {
        showDerivative = this.checked;
        drawActivationFunction(ctx, canvas.width, canvas.height, activationFunction, showDerivative);
    });
    
    // Initial draw
    drawActivationFunction(ctx, canvas.width, canvas.height, activationFunction, showDerivative);
}

// Function to draw activation function
function drawActivationFunction(ctx, width, height, functionName, showDerivative) {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set up coordinate system
    const originX = width / 2;
    const originY = height / 2;
    const scale = 50; // pixels per unit
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw grid
    ctx.beginPath();
    for (let x = originX % scale; x < width; x += scale) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
    }
    for (let y = originY % scale; y < height; y += scale) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
    }
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw function
    ctx.beginPath();
    for (let x = -originX; x <= width - originX; x++) {
        const input = x / scale;
        const output = calculateActivation(input, functionName);
        const canvasX = originX + x;
        const canvasY = originY - output * scale;
        
        if (x === -originX) {
            ctx.moveTo(canvasX, canvasY);
        } else {
            ctx.lineTo(canvasX, canvasY);
        }
    }
    ctx.strokeStyle = '#4472C4';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw derivative if requested
    if (showDerivative) {
        ctx.beginPath();
        for (let x = -originX; x <= width - originX; x++) {
            const input = x / scale;
            const output = calculateActivationDerivative(input, functionName);
            const canvasX = originX + x;
            const canvasY = originY - output * scale;
            
            if (x === -originX) {
                ctx.moveTo(canvasX, canvasY);
            } else {
                ctx.lineTo(canvasX, canvasY);
            }
        }
        ctx.strokeStyle = '#ED7D31';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Add legend
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.fillText('Function', width - 100, 20);
        ctx.fillText('Derivative', width - 100, 40);
        
        ctx.beginPath();
        ctx.moveTo(width - 120, 16);
        ctx.lineTo(width - 105, 16);
        ctx.strokeStyle = '#4472C4';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(width - 120, 36);
        ctx.lineTo(width - 105, 36);
        ctx.strokeStyle = '#ED7D31';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    // Add labels
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('x', width - 10, originY + 15);
    ctx.fillText('y', originX - 15, 15);
    
    // Add function name
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(getFunctionDisplayName(functionName), 20, 30);
}

// Calculate activation function value
function calculateActivation(x, functionName) {
    switch (functionName) {
        case 'sigmoid':
            return 1 / (1 + Math.exp(-x));
        case 'relu':
            return Math.max(0, x);
        case 'tanh':
            return Math.tanh(x);
        case 'leaky_relu':
            return x > 0 ? x : 0.1 * x;
        default:
            return 0;
    }
}

// Calculate activation function derivative
function calculateActivationDerivative(x, functionName) {
    switch (functionName) {
        case 'sigmoid':
            const sigmoid = 1 / (1 + Math.exp(-x));
            return sigmoid * (1 - sigmoid);
        case 'relu':
            return x > 0 ? 1 : 0;
        case 'tanh':
            return 1 - Math.tanh(x) * Math.tanh(x);
        case 'leaky_relu':
            return x > 0 ? 1 : 0.1;
        default:
            return 0;
    }
}

// Get display name for function
function getFunctionDisplayName(functionName) {
    switch (functionName) {
        case 'sigmoid':
            return 'Sigmoid: σ(x) = 1/(1+e^(-x))';
        case 'relu':
            return 'ReLU: f(x) = max(0, x)';
        case 'tanh':
            return 'Tanh: tanh(x) = (e^x - e^(-x))/(e^x + e^(-x))';
        case 'leaky_relu':
            return 'Leaky ReLU: f(x) = max(0.1x, x)';
        default:
            return '';
    }
}
