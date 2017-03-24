#!/usr/bin/env node

var clogLog = require('./clogLog');
var program = require('commander');
var table = require('cli-table');
var dateFormat = require('dateformat');
var through = require('through2');
var gitRawCommits = require('git-raw-commits');
var conventionalCommitsParser = require('conventional-commits-parser');

clogLog.check();

program
    .version('0.0.1')
    .description('Changelog manager')
    .option('-i, --init', 'Start a changelog')
    .option('-g, --git', 'Update changlog from git commits')
    .option('-t, --trial', 'Trial run. Changes are not written to the log')
    .option('-c, --changelog [# of entries]', 'View changelog')
    .option('-d, --delete', 'Delete the latest changelog entry')
    .option('-m, --message [msg]', 'Add an entry to the changelog');

program.parse(process.argv);

if (program.git) {

    var i = 0;

    var options = {
        transform:
            (function() {
              through.obj(function(chunk, enc, cb) {
                console.log("custom transform called ... ");
                cb(null, chunk);
              })
            }
          )()
        }

    gitRawCommits({ since: '2017-03-23', source: true })
        .pipe(conventionalCommitsParser())
        .pipe(through({ objectMode: true }, function(chunk, enc, cb) {
            if (!program.trial) {
                clogLog.append(chunk.header.trim());
            } else {
                console.log('Log updated: ', chunk.header.trim());
            }
            cb();
        }, function() {
            console.log("updated from git, updating meta");
        }));

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

    if (log.log.length===0) {
        console.log('No entries found. Use clog -m to add one.');
        return;
    }

    if (!program.trial) {
        clogLog.delete();
    }

    console.log('Log entry deleted');

} else if (program.message) {

    if (program.args.length > 0) { program.message = program.message + ' ' + program.args.join(' '); }

    if (!program.trial) {
        clogLog.append(program.message);
    }
    console.log('Log updated: ', program.message);

} else {

    program.help();

}