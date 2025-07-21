const fs = require('fs');
const path = require('path');

// Read the flow metadata file
const flowPath = path.join(__dirname, 'AddIPOTargetFlow');
console.log('Analyzing Salesforce Flow for auto-layout compatibility...\n');

try {
    const flowContent = fs.readFileSync(flowPath, 'utf8');
    console.log('Flow XML Content:');
    console.log('================');
    console.log(flowContent);
    
    // Analyze for common auto-layout issues
    console.log('\n\nAuto-Layout Analysis:');
    console.log('====================');
    
    // Check for Step elements (deprecated)
    if (flowContent.includes('<steps>') || flowContent.includes('<actionType>step</actionType>')) {
        console.log('❌ ISSUE: Deprecated Step elements found');
    }
    
    // Check for elements without connectors
    const elementTypes = [
        'recordLookups', 'assignments', 'decisions', 'loops', 
        'screens', 'actionCalls', 'subflows', 'waits'
    ];
    
    elementTypes.forEach(elementType => {
        const regex = new RegExp(`<${elementType}>`, 'g');
        const matches = flowContent.match(regex);
        if (matches) {
            console.log(`📋 Found ${matches.length} ${elementType} element(s)`);
        }
    });
    
    // Check for connector issues
    if (flowContent.includes('<connector>')) {
        const connectorCount = (flowContent.match(/<connector>/g) || []).length;
        console.log(`🔗 Found ${connectorCount} connector(s)`);
    }
    
    // Check for processType
    const processTypeMatch = flowContent.match(/<processType>([^<]+)<\/processType>/);
    if (processTypeMatch) {
        console.log(`📝 Process Type: ${processTypeMatch[1]}`);
    }
    
} catch (error) {
    console.error('Error reading flow file:', error.message);
}