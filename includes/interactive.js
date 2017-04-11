
var vorpal = require('vorpal')();
var highlight = 0;

var white = '\033[1;37m';
var nc = '\033[0m';

module.exports = {

    init: function(){

        var _this = this;

        vorpal
            .command('confirm', 'Take the change as is.')
            .alias('c')
            .action(function(args, callback) {
                vorpal.log('Change entry confirmed.');
                _this.entry++;
                if (_this.entry === _this.entries.length) { process.exit(); }
                vorpal.log('#'+_this.entries[_this.entry].id+': '+_this.entries[_this.entry].m);
                callback();
            });

        vorpal
            .command('edit', 'Edit the current change.')
            .alias('e')
            .action(function(args, callback) {
                const self = this;
                vorpal.ui.input(_this.entries[_this.entry].m);
                return this.prompt({
                    type: 'input',
                    name: 'msg',
                    default: '',
                    message: 'Enter your log message:',
                }, function(result){
                    if (result.msg) {
                        _this.log.edit(_this.entries[_this.entry].id, result.msg);
                        self.log('Updated change entry');
                    } else {
                        self.log('Change entry updated and confirmed.');
                    }
                    _this.entry++;
                    if (_this.entry === _this.entries.length) { process.exit(); }
                    vorpal.log('#'+_this.entries[_this.entry].id+': '+_this.entries[_this.entry].m);
                    callback();
                });
            });

        vorpal
            .command('remove', 'Remove the current change')
            .alias('r')
            .action(function(args, callback) {
                vorpal.log('Change entry removed');
                _this.entry++;
                if (_this.entry === _this.entries.length) { process.exit(); }
                vorpal.log('#'+_this.entries[_this.entry].id+': '+_this.entries[_this.entry].m);
                callback();
            });

        vorpal.on('keypress', function(e){

            var redraw = false;

            if (e.key==='up'){
                highlight--;
                redraw = true;
            }

            if (e.key==='down'){
                highlight++;
                redraw = true;
            }

            if (e.key==='space'){
                _this.entries[highlight].confirmed = true;
                redraw = true;
            }

            if (e.key==='return'){
                vorpal.ui.redraw('\n');
                vorpal.ui.delimiter('[Confirm, Edit, Remove]$');
                vorpal.log('Updating entries');
            }

            if (redraw == false) { return; }

            if (highlight < 0) { highlight = 0; }
            if (highlight > 3) { highlight = 3; }

            arr = [];

            for (entry in _this.entries) {
                commit  = (entry == highlight) ? white : nc;
                commit += (_this.entries[entry].confirmed ? 'x ' : '  ');
                commit += _this.entries[entry].m;
                arr.push(commit);
            }

            vorpal.ui.redraw('\n'+arr.join('\n')+nc);
            vorpal.ui.delimiter('Space to confirm');

        });

    },


    start: function(log, count){

        this.init();
        this.log = log;
        this.entry = 0;

        this.entries = this.log.read(count).reverse();

        vorpal
            .delimiter('[Confirm, Edit, Remove]$')
            .show();

        arr = [];

        for (entry in this.entries) {
            commit  = (entry == highlight) ? white : nc;
            commit += (this.entries[entry].confirmed ? 'x ' : '  ');
            commit += this.entries[entry].m;
            arr.push(commit);
        }

        vorpal.ui.redraw.done();
        vorpal.ui.redraw('\n'+arr.join('\n')+nc);
        vorpal.ui.delimiter('Space to confirm');

    }

};
