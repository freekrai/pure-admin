module.exports = function(grunt) {
	'use strict';

	require('time-grunt')(grunt);
	require('jit-grunt')(grunt, {
		customTasksDir: 'pack/grunt'
	});

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		pureConfig: grunt.file.readJSON('config.json'),
		devPath: pureConfig.dirs.mode + '/' + pureConfig.path.dev,
		prodPath: pureConfig.dirs.mode + '/' + pureConfig.path.prod,
		deployPath: pureConfig.path.deploy,
		garbagePath: pureConfig.dirs.mode + '/' + pureConfig.path.garbage,
		releasePath: pureConfig.path.release,

		// Clean Config
		clean: {
			dev: ['<%= devPath %>/'],
			prod: ['<%= prodPath %>/'],
			deploy: ['<%= deployPath %>/'],
			garbage: ['<%= garbagePath %>/'],
			release: ['<%= releasePath %>/<%= pkg.version %>'],
			maps: [
				'<%= devPath %>/assets/css/*.map',
				'<%= devPath %>/assets/js/*.map'],
			all: [
				'<%= devPath %>/',
				'<%= prodPath %>/',
				'<%= deployPath %>/',
				'<%= garbagePath %>/',
				'<%= releasePath %>/<%= pkg.version %>'
			]
		}
	});
};