const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const traceMiddleware = require('./middlewares/trace.middleware');
const errorMiddleware = require('./middlewares/error.middleware');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

// Swagger Documentation
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Global Trace ID Middleware
app.use(traceMiddleware);

// Mount all routes
app.use('/', routes);

// Global Error Handler
app.use(errorMiddleware);

module.exports = app;
