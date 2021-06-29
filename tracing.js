"use strict";

// Create and propagate traces over HTTP
const { diag, DiagConsoleLogger, DiagLogLevel } = require("@opentelemetry/api");
const { NodeTracerProvider } = require("@opentelemetry/node");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { GrpcInstrumentation } = require("@opentelemetry/instrumentation-grpc");

// Export traces to an exporter (Zipkin)
const { Resource } = require("@opentelemetry/resources");
const { ResourceAttributes } = require("@opentelemetry/semantic-conventions");
const { SimpleSpanProcessor } = require("@opentelemetry/tracing");
const { ZipkinExporter } = require("@opentelemetry/exporter-zipkin");

const provider = new NodeTracerProvider({
  resource: new Resource({
    [ResourceAttributes.SERVICE_NAME]: "otel-js-practice",
  }),
});

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);

// Set exporter
provider.addSpanProcessor(new SimpleSpanProcessor(new ZipkinExporter({})));

provider.register();

registerInstrumentations({
  instrumentations: [new HttpInstrumentation(), new GrpcInstrumentation()],
});

console.log("tracing initialized :)");
