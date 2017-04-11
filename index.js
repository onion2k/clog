#!/usr/bin/env node

var program = require('commander');
var table = require('cli-table');
var dateFormat = require('dateformat');

var log = require('./includes/log');
var commands = require('./includes/commands');
var git = require('./includes/git');
var interactive = require('./includes/interactive');

var localpackagejson = require(process.cwd()+'/package.json');

program
    .version('0.0.1')
    .description('Changelog manager')
    .option('-c, --changelog [# of entries]', 'View the current changelog.')
    .option('-m, --message [msg]', 'Add an entry to the changelog.')
    .option('-g, --git', 'Automatically update the changelog from git commits.')
    .option('-w, --write', 'Write out to CHANGELOG.md.')
    .option('-r, --review [# of entries]', 'Launch the interactive shell.')
    .option('-t, --trial', 'Trial run. Changes are not written to the log.')
    .option('')
    .option('-x, --deletebyid [entry ID]', 'Delete a specific changelog entry')
    .option('-z, --deletelast [# of entries]', 'Delete the latest changelog entries');

program.on('--help', function(){
    console.log('  Interactive mode:');
    console.log('');
    console.log('    Use interactive mode to launch a shell-like tool for merging and editing changes.');
    console.log('    After using clog -i you will see a clog$ prompt. Use `help` for commands.');
    console.log('');
});

program.parse(process.argv);

if (program.git) {

     git.write(log, program);

} else if (program.review) {

    if (!log.check()) {
        console.log('Log not found. Use clog -m to add one.');
        return;
    }

    if (program.review === true) { program.review = 10; }

    console.log("Entering review mode (Latest "+program.review +" entries).")

    interactive.start(log, program.review);

} else if (program.deletebynum) {

    /**
     * Delete an entry
     */

    if (!log.check()) {
        console.log('Log not found. Use clog -m to add one.');
        return;
    }

    if (log.log().length===0) {
        console.log('No entries found. Use clog -m to add one.');
        return;
    }

    if (program.deletebynum === true) { program.deletebynum = 1; }

    if (!program.trial) {
        log.delete(program.deletebynum);
    }

    console.log(program.delete+' log entries deleted');

} else if (program.deletebyid) {

    /**
     * Delete using an ID
     */

    if (!log.check()) {
        console.log('Log not found. Use clog -m to add one.');
        return;
    }

    if (log.log().length===0) {
        console.log('No entries found. Use clog -m to add one.');
        return;
    }

    if (!program.trial) {
        log.deleteByID(program.id);
    }

    console.log('Log entry '+program.id+' deleted');

} else if (program.message) {

    /**
     * Add a new entry
     */

    if (program.args.length > 0) { program.message = program.message + ' ' + program.args.join(' '); }

    if (!program.trial) {
        log.append(program.message);
    }

    console.log('Log updated: ', program.message, (program.trial?' (Trial)':'') );

} else if (program.changelog) {

    /**
     * Output the changelog
     */

    if (!log.check()) {
        console.log('No log found. Use clog -m to add one.')
        return;
    }

    if (program.changelog === true) { program.changelog = 10; }

    let width = process.stdout.columns - 4;
    let widths = [4, width-30, 22, 3]

    var logtable = new table({
        head: ['ID', 'Message', 'Date', ''],
        colWidths: widths
    });

    var entries = log.read(10);



    for (entry in entries) {
        logtable.push(
            [entries[entry].id, entries[entry].m, dateFormat(entries[entry].d, "dd/mm/yyyy h:MM:ss"), (entries[entry].confirmed?'✓':'✗')]
        );
    }

    console.log(logtable.toString());

} else {

    /**
     * Unknown or nothing, display the help
     */

    program.help();

}