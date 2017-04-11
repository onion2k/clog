
var util = require('util');
var gitCommits = require('git-commits');

module.exports = {

    write: function(log, program){

        gitCommits(process.cwd() + '/.git', {
            limit: 2
        }).on('data', function(commit) {
            var change = util.format('%s (%s)', commit.title.trim(), commit.hash.substring(0,6) );
            if (!program.trial) {
                log.append(change);
            } else {
                console.log('Log updated: ', change);
            }
        }).on('error', function(err) {
            throw err;
        });

    }

};
