const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const asyncHandler = require('./lib/async-handler');
const mongoClient = require('./lib/mongo');
const globals = require('./globals');

const {
	fhirServerConfig,
	mongoConfig
} = require('./config');

const {
	CLIENT,
	CLIENT_DB
} = require('./constants');

let main = async function () {

	console.log(mongoConfig.connection);
	console.log(mongoConfig.options);

	// Connect to mongo and pass any options here
	let [ mongoErr, client ] = await asyncHandler(
		mongoClient(mongoConfig.connection, mongoConfig.options)
	);

	if (mongoErr) {
		console.error(mongoErr.message);
		console.error(mongoConfig.connection);
		process.exit(1);
	}

	// Save the client in another module so I can use it in my services
	globals.set(CLIENT, client);
	globals.set(CLIENT_DB, client.db(mongoConfig.db_name));


	// Start our FHIR server
	let server = FHIRServer.initialize(fhirServerConfig);
	server.listen(fhirServerConfig.server.port, () => server.logger.verbose('Server is up and running!'));
};

main();
