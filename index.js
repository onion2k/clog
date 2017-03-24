#!/usr/bin/env node

var clogLog = require('./clogLog');
var program = require('commander');
var table = require('cli-table');
var dateFormat = require('dateformat');
var through = require('through2');
var gitRawCommits = require('git-raw-commits');

clogLog.check();

program
    .version('0.0.1')
    .description('Changelog manager')
    .option('-i, --init', 'Start a changelog')
    .option('-g, --git', 'git commits to changelog')
    .option('-c, --changelog [# of entries]', 'View changelog')
    .option('-d, --delete', 'Delete the latest changelog entry')
    .option('-m, --message [msg]', 'Add an entry to the changelog');

program.parse(process.argv);

if (program.git) {

    gitRawCommits()
        .pipe(through(function(chunk, enc, cb) {
            chunk = chunk.toString();

            if (i === 0) {
                expect(chunk).to.equal('Third commit\n\n');
            } else if (i === 1) {
                expect(chunk).to.equal('Second commit\n\n');
            } else {
                expect(chunk).to.equal('First commit\n\n');
            }

            i++;
            cb();
        }, function() {
            expect(i).to.equal(3);
            done();
        }));

} else if (program.changelog) {

    if (!clogLog.check()) {
        console.log('Log not found. Use clog -i to start.');
        return;
    }

    if (log.log.length===0) {
        console.log('No entries found. Use clog -m to add one.');
        return;
    }

    if (program.changelog === true) { program.changelog = 10; }

    var logtable = new table({
        head: ['ID', 'Message', 'Date'],
        colWidths: [4, 75, 21]
    });

    var entries = log.log.slice(0, 10);

    for (entry in entries) {
        logtable.push(
            [parseInt(entry)+1, entries[entry].m, dateFormat(entries[entry].d, "dd/mm/yyyy h:MM:ss")]
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

    clogLog.delete();

    console.log('Log entry deleted');

} else if (program.message) {

    if (program.args.length > 1) { program.message = program.message + ' ' + program.args.join(' '); }

    clogLog.append(program.message);
    console.log('Log updated ', program.message);

} else {

    program.help();

}