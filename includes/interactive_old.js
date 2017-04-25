
var vorpal = require('vorpal');
var highlight = 0;

var white = '\033[1;37m';
var nc = '\033[0m';

var vorpal_cli, vorpal_interactive;

module.exports = {

    init: function(){

        var _this = this;

        vorpal_cli.command('confirm', 'Take the change as is.')
            .alias('c')
            .action(function(args, callback) {
                vorpal_cli.log('Change entry confirmed.');
                _this.entry++;
                if (_this.entry === _this.entries.length) { process.exit(); }
                vorpal_cli.log('#'+_this.entries[_this.entry].id+': '+_this.entries[_this.entry].m);
                callback();
            });

        vorpal_cli.command('edit', 'Edit the current change.')
            .alias('e')
            .action(function(args, callback) {
                const self = this;
                vorpal_cli.ui.input(_this.entries[_this.entry].m);
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
                    vorpal_cli.log('#'+_this.entries[_this.entry].id+': '+_this.entries[_this.entry].m);
                    callback();
                });
            });

        vorpal_cli.command('remove', 'Remove the current change')
            .alias('r')
            .action(function(args, callback) {
                vorpal_cli.log('Change entry removed');
                _this.entry++;
                if (_this.entry === _this.entries.length) { process.exit(); }
                vorpal_cli.log('#'+_this.entries[_this.entry].id+': '+_this.entries[_this.entry].m);
                callback();
            });

        vorpal_cli.command('interactive', 'Confirm and edit changes')
            .alias('i')
            .action(function(args, callback) {
                vorpal_cli.hide();
                vorpal_interactive.show();
                _this.redrawInteractiveUI();
                callback();
            });

        vorpal_interactive.on('keypress', function(e){

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
                vorpal_interactive.hide();
                vorpal_cli.show();
                vorpal_cli.ui.delimiter('Type `help` for a list of commands');
                return;
            }

            if (redraw === false) { return; }

            if (highlight < 0) { highlight = 0; }
            if (highlight > 3) { highlight = 3; }

            _this.redrawInteractiveUI();

        });

    },

    redrawInteractiveUI: function(){

        arr = [];

        for (entry in this.entries) {
            commit  = (entry == highlight) ? white : nc;
            commit += (this.entries[entry].confirmed ? '✓ ' : '  ');
            commit += this.entries[entry].m;
            arr.push(commit);
        }

        vorpal_interactive.ui.redraw('\n'+arr.join('\n')+nc+'\n');
        vorpal_interactive.ui.delimiter('Up/Down to select. Space to confirm. Return to exit.');

    },


    start: function(log, count){

        this.log = log;
        this.entry = 0;

        this.entries = this.log.read(count).reverse();

        vorpal_cli = new vorpal();
        vorpal_cli.delimiter('Type `help` for a list of commands');
        vorpal_cli.show();

        vorpal_interactive = new vorpal();

        this.init();

        // arr = [];

        // for (entry in this.entries) {
        //     commit  = (entry == highlight) ? white : nc;
        //     commit += (this.entries[entry].confirmed ? '✓ ' : '  ');
        //     commit += this.entries[entry].m;
        //     arr.push(commit);
        // }

        // vorpal_interactive.ui.redraw('\n'+arr.join('\n')+nc+'\n');
        // vorpal_interactive.ui.delimiter('Up/Down to select. Space to confirm. Return to exit.');

    }

};
