/*eslint no-unused-vars: "warn"*/

//const { RESOURCES } = require('@asymmetrik/node-fhir-server-core').constants;
const { RESOURCES, VERSIONS } = require('@asymmetrik/node-fhir-server-core').constants;
const FHIRServer = require('@asymmetrik/node-fhir-server-core');
const { COLLECTION, CLIENT_DB } = require('../../constants');
const moment = require('moment-timezone');
const globals = require('../../globals');
const { stringQueryBuilder,
	tokenQueryBuilder,
	referenceQueryBuilder,
	addressQueryBuilder,
	nameQueryBuilder,
	dateQueryBuilder } = require('../../utils/querybuilder.util');

let getImagingStudy = (base_version) => {
	return require(FHIRServer.resolveFromVersion(base_version, RESOURCES.IMAGINGSTUDY));};

let getMeta = (base_version) => {
	return require(FHIRServer.resolveFromVersion(base_version, RESOURCES.META));};


	
/**
 *
 * @param {*} args
 * @param {*} context
 * @param {*} logger
 */

//  let buildSTu3SearchQuery=(args)=>{
// 	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

// 	// Search Result params
// 	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

// 	// Resource Specific params
// 	let accession = args['accession'];
// 	let basedon = args['basedon'];
// 	let bodysite = args['bodysite'];
// 	let _context = args['_context'];
// 	let dicom_class = args['dicom-class'];
// 	let endpoint = args['endpoint'];
// 	let identifier = args['identifier'];
// 	let modality = args['modality'];
// 	let patient = args['patient'];
// 	let performer = args['performer'];
// 	let reason = args['reason'];
// 	let series = args['series'];
// 	let started = args['started'];
// 	let study = args['study'];
// 	let uid = args['uid'];

// 	let query = {};
// 	let ors = [];
// 	if(patient){
// 		query['patient.reference'] = stringQueryBuilder(patient);
// 	}
// 	if(accession){
// 		query['accession.assigner.reference'] = stringQueryBuilder(accession);
// 	}
// 	return query;
//  }
module.exports.search = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('ImagingStudy -not suport yet >>> search');

	// Common search params
	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let accession = args['accession'];
	let basedon = args['basedon'];
	let bodysite = args['bodysite'];
	let _context = args['_context'];
	let dicom_class = args['dicom-class'];
	let endpoint = args['endpoint'];
	let identifier = args['identifier'];
	let modality = args['modality'];
	let patient = args['patient'];
	let performer = args['performer'];
	let reason = args['reason'];
	let series = args['series'];
	let started = args['started'];
	let study = args['study'];
	let uid = args['uid'];
	let query = {};
	//let ors = [];
	if(patient){
		query['patient.reference'] = stringQueryBuilder(patient);
	}
	if(accession){
		query['accession.assigner.reference'] = stringQueryBuilder(accession);
	}
	//return query;
	// TODO: Build query from Parameters
	//let query = {};
	//query = buildStu3SearchQuery(args);
	// TODO: Query database

	// let ImagingStudy = getImagingStudy(base_version);

	// // Cast all results to ImagingStudy Class
	// let imagingstudy_resource = new ImagingStudy();
	// // TODO: Set data with constructor or setter methods
	// imagingstudy_resource.id = 'test id';
// Grab an instance of our DB and collection
	// // Return Array
	//resolve([imagingstudy_resource]);
let db = globals.get(CLIENT_DB);
let collection = db.collection(`${COLLECTION.IMAGINGSTUDY}_${base_version}`);
let ImageStudy = getImagingStudy(base_version);

// Query our collection for this observation
collection.find(query, (err, data) => {
	if (err) {
		logger.error('Error with Patient.search: ', err);
		return reject(err);
	}

	// Patient is a patient cursor, pull documents out before resolving
	data.toArray().then((imagingstudys) => {
		imagingstudys.forEach(function(element, i, returnArray) {
			returnArray[i] = new ImageStudy(element);
		});
		resolve(imagingstudys);
	});
});


});

module.exports.searchById = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('ImagingStudy >>> searchById');

	let { base_version, id } = args;

	let ImagingStudy = getImagingStudy(base_version);

	// TODO: Build query from Parameters
	let db = globals.get(CLIENT_DB);
	// TODO: Query database
	//let db = globals.get(CLIENT_DB);
	let collection = db.collection(`${COLLECTION.IMAGINGSTUDY}_${base_version}`);
	// Query our collection for this observation
	collection.findOne({ id: id.toString() }, (err, imagingStudy) => {
		if (err) {
			logger.error('Error with Patient.searchById: ', err);
			return reject(err);
		}
		if (imagingStudy) {
			resolve(new ImagingStudy(imagingStudy));
		}
		resolve();
	});
	// // Cast result to ImagingStudy Class
	// let imagingstudy_resource = new ImagingStudy();
	// // TODO: Set data with constructor or setter methods
	// imagingstudy_resource.id = 'test id';

	// Return resource class
	// resolve(imagingstudy_resource);
	//resolve();
});

module.exports.create = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('ImagingStudy >>> create');

	let { base_version, id, resource } = args;
	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(`${COLLECTION.IMAGINGSTUDY}_${base_version}`);

	// get current record
	let ImagingStudy = getImagingStudy(base_version);
	let Meta = getMeta(base_version);

	// TODO: determine if client/server sets ID

	// Cast resource to ImagingStudy Class
	let imagingstudy_resource = new ImagingStudy(resource);
		//imagingstudy_resource.meta = new Meta();
	imagingstudy_resource.meta = new Meta({versionId: '1', lastUpdated: moment.utc().format('YYYY-MM-DDTHH:mm:ssZ')});

	// TODO: set meta info

	// TODO: save record to database
	let cleaned = JSON.parse(JSON.stringify(imagingstudy_resource.toJSON()));
	let doc = Object.assign(cleaned, { _id: id });
	// Insert/update our patient record
	collection.insertOne({ id: id }, { $set: doc }, { upsert: true }, (err2, res) => {
		if (err2) {
			logger.error('Error with Patient.create: ', err2);
			return reject(err2);
		}

		// save to history
		let history_collection = db.collection(`${COLLECTION.IMAGINGSTUDY}_${base_version}_History`);

		let history_patient = Object.assign(cleaned, { _id: id + cleaned.meta.versionId });

		// Insert our patient record to history but don't assign _id
		return history_collection.insertOne(history_patient, (err3) => {
			if (err3) {
				logger.error('Error with ImagingStudy.create: ', err3);
				return reject(err3);
			}

			return resolve({ id: res.value && res.value.id, created: res.lastErrorObject && !res.lastErrorObject.updatedExisting, resource_version: doc.meta.versionId });
		});

	});
	// Return Id
	//resolve({ id: imagingstudy_resource.id });
});

module.exports.update = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('ImagingStudy >>> update');

	let { base_version, id, resource } = args;

	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(`${COLLECTION.IMAGINGSTUDY}_${base_version}`);

	// get current record
	// Query our collection for this observation
	collection.findOne({ id: id.toString() }, (err, data) => {
		if (err) {
			logger.error('Error with ImageStudy.searchById: ', err);
			return reject(err);
		}

		//let Patient = getPatient(base_version);
		//let patient = new Patient(resource);
		let ImagingStudy = getImagingStudy(base_version);
		let imagingStudy = new ImagingStudy(resource);

		if (data && data.meta) {
			let foundImage = new ImagingStudy(data);
			let meta = foundImage.meta;
			meta.versionId = `${parseInt(foundImage.meta.versionId) + 1}`;
			imagingStudy.meta = meta;
		} else {
			let Meta = getMeta(base_version);
			imagingStudy.meta = new Meta({versionId: '1', lastUpdated: moment.utc().format('YYYY-MM-DDTHH:mm:ssZ')});
		}

		let cleaned = JSON.parse(JSON.stringify(imagingStudy));
		let doc = Object.assign(cleaned, { _id: id });

		// Insert/update our patient record
		collection.findOneAndUpdate({ id: id }, { $set: doc }, { upsert: true }, (err2, res) => {
			if (err2) {
				logger.error('Error with ImageStudy.update: ', err2);
				return reject(err2);
			}

			// save to history
			let history_collection = db.collection(`${COLLECTION.IMAGINGSTUDY}_${base_version}_History`);

			let history_patient = Object.assign(cleaned, { _id: id + cleaned.meta.versionId });

			// Insert our patient record to history but don't assign _id
			return history_collection.insertOne(history_patient, (err3) => {
				if (err3) {
					logger.error('Error with ImageStudyHistory.create: ', err3);
					return reject(err3);
				}

				return resolve({ id: doc.id, created: res.lastErrorObject && !res.lastErrorObject.updatedExisting, resource_version: doc.meta.versionId });
				//return resolve({ id: imagingStudy.id, created: false, resource_version: imagingStudy.meta.versionId });

			});

		});
	});
	// let ImagingStudy = getImagingStudy(base_version);
	// let Meta = getMeta(base_version);

	// // Cast resource to ImagingStudy Class
	// let imagingstudy_resource = new ImagingStudy(resource);
	// imagingstudy_resource.meta = new Meta();
	// TODO: set meta info, increment meta ID

	// TODO: save record to database

	// Return id, if recorded was created or updated, new meta version id
	// resolve({ id: imagingstudy_resource.id, created: false, resource_version: imagingstudy_resource.meta.versionId });
});

module.exports.remove = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('ImagingStudy >>> remove');
	let { base_version, id } = args;

	// Grab an instance of our DB and collection
	let db = globals.get(CLIENT_DB);
	let collection = db.collection(`${COLLECTION.IMAGINGSTUDY}_${base_version}`);
		// Delete our patient record
		collection.deleteOne({ id: id }, (err, _) => {
			if (err) {
				logger.error('Error with ImageStudy.remove');
				return reject({
					// Must be 405 (Method Not Allowed) or 409 (Conflict)
					// 405 if you do not want to allow the delete
					// 409 if you can't delete because of referential
					// integrity or some other reason
					code: 409,
					message: err.message
				});
			}
	
			// delete history as well.  You can chose to save history.  Up to you
			let history_collection = db.collection(`${COLLECTION.IMAGINGSTUDY}_${base_version}_History`);
			return history_collection.deleteMany({ id: id }, (err2) => {
				if (err2) {
					logger.error('Error with Patient.remove');
					return reject({
						// Must be 405 (Method Not Allowed) or 409 (Conflict)
						// 405 if you do not want to allow the delete
						// 409 if you can't delete because of referential
						// integrity or some other reason
						code: 409,
						message: err2.message
					});
				}
	
				return resolve({ deleted: _.result && _.result.n });
			});
	
		});
	// Delete our patient record
	//let { id } = args;

	// TODO: delete record in database (soft/hard)

	// Return number of records deleted
	//resolve({ deleted: 0 });
});

module.exports.searchByVersionId = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('ImagingStudy >>> searchByVersionId');

	let { base_version, id, version_id } = args;

	let ImagingStudy = getImagingStudy(base_version);
	let db = globals.get(CLIENT_DB);
	let history_collection = db.collection(`${COLLECTION.IMAGINGSTUDY}_${base_version}_History`);
	// Query our collection for this observation
	history_collection.findOne({ id: id.toString(), 'meta.versionId': `${version_id}` }, (err, patient) => {
		if (err) {
			logger.error('Error with Imagestudy.searchByVersionId: ', err);
			return reject(err);
		}

		if (patient) {
			resolve(new ImagingStudy(patient));
		}

		resolve();

	});
	// TODO: Build query from Parameters

	// TODO: Query database

	// Cast result to ImagingStudy Class
	// let imagingstudy_resource = new ImagingStudy();

	// // Return resource class
	// resolve(imagingstudy_resource);
});

module.exports.history = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('ImagingStudy-->notsupportyet >>> history');

	// Common search params
	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let accession = args['accession'];
	let basedon = args['basedon'];
	let bodysite = args['bodysite'];
	let _context = args['_context'];
	let dicom_class = args['dicom-class'];
	let endpoint = args['endpoint'];
	let identifier = args['identifier'];
	let modality = args['modality'];
	let patient = args['patient'];
	let performer = args['performer'];
	let reason = args['reason'];
	let series = args['series'];
	let started = args['started'];
	let study = args['study'];
	let uid = args['uid'];

	// TODO: Build query from Parameters

	// TODO: Query database
	

	// let ImagingStudy = getImagingStudy(base_version);

	// Cast all results to ImagingStudy Class
	let imagingstudy_resource = new ImagingStudy();

	// Return Array
	resolve([imagingstudy_resource]);



});

module.exports.historyById = (args, context, logger) => new Promise((resolve, reject) => {
	logger.info('ImagingStudy---not support yet >>> historyById');

	// Common search params
	let { base_version, _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

	// Search Result params
	let { _INCLUDE, _REVINCLUDE, _SORT, _COUNT, _SUMMARY, _ELEMENTS, _CONTAINED, _CONTAINEDTYPED } = args;

	// Resource Specific params
	let accession = args['accession'];
	let basedon = args['basedon'];
	let bodysite = args['bodysite'];
	let _context = args['_context'];
	let dicom_class = args['dicom-class'];
	let endpoint = args['endpoint'];
	let identifier = args['identifier'];
	let modality = args['modality'];
	let patient = args['patient'];
	let performer = args['performer'];
	let reason = args['reason'];
	let series = args['series'];
	let started = args['started'];
	let study = args['study'];
	let uid = args['uid'];

	// TODO: Build query from Parameters

	// TODO: Query database

	let ImagingStudy = getImagingStudy(base_version);

	// Cast all results to ImagingStudy Class
	let imagingstudy_resource = new ImagingStudy();

	// Return Array
	resolve([imagingstudy_resource]);
});

