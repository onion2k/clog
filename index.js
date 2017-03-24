#!/usr/bin/env node

var clogLog = require('./clogLog');
var util = require('util');
var program = require('commander');
var table = require('cli-table');
var dateFormat = require('dateformat');
var gitCommits = require('git-commits');

clogLog.check();

program
    .version('0.0.1')
    .description('Changelog manager')
    .option('-c, --changelog [# of entries]', 'View changelog')
    .option('-m, --message [msg]', 'Add an entry to the changelog')
    .option('-d, --delete [# of entries]', 'Delete the latest changelog entries')
    .option('-g, --git', 'Update changelog from git commits')
    .option('-t, --trial', 'Trial run. Changes are not written to the log')
    .option('-i, --id [entry ID]', 'Delete a specific changelog entry');

program.parse(process.argv);

if (program.git) {

    gitCommits(process.cwd() + '/.git', {
        limit: 2
    }).on('data', function(commit) {
        var change = util.format('%s (%s)', commit.title.trim(), commit.hash.substring(0,6) );
        if (!program.trial) {
            clogLog.append(change);
        } else {
            console.log('Log updated: ', change);
        }
    }).on('error', function(err) {
        throw err;
    });

} else if (program.changelog) {

    if (!clogLog.check()) {
        console.log('Log not found. Use clog -i to start.');
        return;
    }

    if (clogLog.log().log.length===0) {
        console.log('No entries found. Use clog -m to add one.');
        return;
    }

    if (program.changelog === true) { program.changelog = 10; }

    var logtable = new table({
        head: ['ID', 'Message', 'Date'],
        colWidths: [4, 75, 21]
    });

    var entries = clogLog.read(10);

    for (entry in entries) {
        logtable.push(
            [parseInt(entries.length)-entry, entries[entry].m, dateFormat(entries[entry].d, "dd/mm/yyyy h:MM:ss")]
        );
    }

    console.log(logtable.toString());

} else if (program.delete) {

    if (!clogLog.check()) {
        console.log('Log not found. Use clog -i to start.');
        return;
    }

    if (clogLog.log().length===0) {
        console.log('No entries found. Use clog -m to add one.');
        return;
    }

    if (program.delete === true) { program.delete = 1; }

    if (!program.trial) {
        clogLog.delete(program.delete);
    }

    console.log(program.delete+' log entries deleted');

} else if (program.id) {

    if (!clogLog.check()) {
        console.log('Log not found. Use clog -i to start.');
        return;
    }

    if (clogLog.log().length===0) {
        console.log('No entries found. Use clog -m to add one.');
        return;
    }

    if (!program.trial) {
        clogLog.deleteByID(program.id);
    }

    console.log('Log entry '+program.id+' deleted');

} else if (program.message) {

    if (program.args.length > 0) { program.message = program.message + ' ' + program.args.join(' '); }

    if (!program.trial) {
        clogLog.append(program.message);
    }
    console.log('Log updated: ', program.message);

} else {

    program.help();

}