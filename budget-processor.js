#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

// Budget processing function
function processBudget(buildingBlocks, config) {
    const processed = {
        project_name: config?.nombreProyecto || 'Proyecto Sin Nombre',
        generated_at: new Date().toISOString(),
        categories: {},
        totals: { basic: 0, standard: 0, enterprise: 0 },
        config: config || {}
    };

    // Process each category if building blocks exist
    if (buildingBlocks?.categories) {
        for (const [categoryId, category] of Object.entries(buildingBlocks.categories)) {
            const categoryData = {
                name: category.name || categoryId,
                items: 0,
                hours: { basic: 0, standard: 0, enterprise: 0 },
                costs: { basic: 0, standard: 0, enterprise: 0 }
            };
            
            // Process building blocks in category
            if (category.building_blocks) {
                for (const [blockId, block] of Object.entries(category.building_blocks)) {
                    if (block.hours) {
                        // Get configuration values
                        const efficiency = (100 - (config?.eficienciaIA || 35)) / 100;
                        const markup = (100 + (config?.markup || 40)) / 100;
                        const aiRate = config?.tarifaIA || 300;
                        
                        // Calculate hours with AI efficiency
                        const basicHours = (block.hours.facil || 0) * efficiency;
                        const standardHours = (block.hours.intermedio || 0) * efficiency;
                        const enterpriseHours = (block.hours.complejo || 0) * efficiency;
                        
                        // Calculate costs
                        const basicCost = basicHours * aiRate * markup;
                        const standardCost = standardHours * aiRate * markup;
                        const enterpriseCost = enterpriseHours * aiRate * markup;
                        
                        // Add to category totals
                        categoryData.hours.basic += basicHours;
                        categoryData.hours.standard += standardHours;
                        categoryData.hours.enterprise += enterpriseHours;
                        
                        categoryData.costs.basic += basicCost;
                        categoryData.costs.standard += standardCost;
                        categoryData.costs.enterprise += enterpriseCost;
                        
                        categoryData.items++;
                    }
                }
            }
            
            // Add category to processed data
            processed.categories[category.name || categoryId] = categoryData;
            
            // Add to overall totals
            processed.totals.basic += categoryData.costs.basic;
            processed.totals.standard += categoryData.costs.standard;
            processed.totals.enterprise += categoryData.costs.enterprise;
        }
    }

    // Apply project factors
    const pmFactor = (config?.factorPM || 18) / 100;
    const testingFactor = (config?.factorTesting || 12) / 100;
    const contingencyFactor = (config?.factorContingencia || 20) / 100;
    const totalFactor = pmFactor + testingFactor + contingencyFactor;

    processed.totals.basic *= (1 + totalFactor);
    processed.totals.standard *= (1 + totalFactor);
    processed.totals.enterprise *= (1 + totalFactor);

    return processed;
}

// Generate files
function generateFiles(processed) {
    const markdown = `# Cotización ${processed.project_name}

*Generado el ${processed.generated_at}*

## Resumen Ejecutivo

| Nivel | Costo Total | Descripción |
|-------|-------------|-------------|
| Básico | $${Math.round(processed.totals.basic).toLocaleString()} MXN | Implementación MVP |
| Estándar | $${Math.round(processed.totals.standard).toLocaleString()} MXN | Producción estable |
| Enterprise | $${Math.round(processed.totals.enterprise).toLocaleString()} MXN | Escalamiento masivo |

## Categorías

${Object.entries(processed.categories).map(([name, data]) => 
    `### ${name}
- Items: ${data.items}
- Horas (Básico/Estándar/Enterprise): ${data.hours.basic.toFixed(1)}/${data.hours.standard.toFixed(1)}/${data.hours.enterprise.toFixed(1)}
- Costos: $${Math.round(data.costs.basic).toLocaleString()}/$${Math.round(data.costs.standard).toLocaleString()}/$${Math.round(data.costs.enterprise).toLocaleString()} MXN`
).join('\n\n')}

## Configuración
- Eficiencia IA: ${processed.config.eficienciaIA || 35}%
- Markup: ${processed.config.markup || 40}%
- Tarifa IA: $${processed.config.tarifaIA || 300} MXN/hora
- Factor PM: ${processed.config.factorPM || 18}%
- Factor Testing: ${processed.config.factorTesting || 12}%
- Factor Contingencia: ${processed.config.factorContingencia || 20}%`;

    const csv = `Categoría,Items,Horas Básico,Costo Básico,Horas Estándar,Costo Estándar,Horas Enterprise,Costo Enterprise
${Object.entries(processed.categories).map(([name, data]) => 
    `${name},${data.items},${data.hours.basic.toFixed(1)},${Math.round(data.costs.basic)},${data.hours.standard.toFixed(1)},${Math.round(data.costs.standard)},${data.hours.enterprise.toFixed(1)},${Math.round(data.costs.enterprise)}`
).join('\n')}
TOTAL,-,-,${Math.round(processed.totals.basic)},-,${Math.round(processed.totals.standard)},-,${Math.round(processed.totals.enterprise)}`;

    return {
        markdown,
        csv,
        processed,
        filename: `cotizacion_${processed.project_name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}`
    };
}

// Create HTTP server
const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/budget-quote') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const processed = processBudget(data.building_blocks, data.config);
                const files = generateFiles(processed);

                const response = {
                    status: 'success',
                    message: 'Budget processed successfully',
                    data: files,
                    timestamp: new Date().toISOString()
                };

                res.setHeader('Content-Type', 'application/json');
                res.writeHead(200);
                res.end(JSON.stringify(response, null, 2));

                console.log(`✅ Budget processed for project: ${processed.project_name}`);

            } catch (error) {
                console.error('❌ Error processing budget:', error);
                const errorResponse = {
                    status: 'error',
                    message: error.message,
                    timestamp: new Date().toISOString()
                };

                res.setHeader('Content-Type', 'application/json');
                res.writeHead(400);
                res.end(JSON.stringify(errorResponse, null, 2));
            }
        });
    } else if (req.method === 'GET' && req.url === '/') {
        // Health check
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200);
        res.end(JSON.stringify({
            status: 'running',
            message: 'Budget Processor API is running',
            endpoints: ['/budget-quote (POST)'],
            timestamp: new Date().toISOString()
        }, null, 2));
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`🚀 Budget Processor API running on http://localhost:${PORT}`);
    console.log(`📋 POST /budget-quote - Process budget data`);
    console.log(`🩺 GET / - Health check`);
});

// Handle shutdown gracefully
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down Budget Processor API...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});