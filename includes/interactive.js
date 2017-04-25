
var vorpal = require('vorpal');
var highlight = 0;

var white = '\033[1;37m';
var nc = '\033[0m';

var vorpal_interactive;

var interaction_mode = true;

module.exports = {

    init: function(){

        var _this = this;

        vorpal_interactive.delimiter(':');

        vorpal_interactive.command('confirm', 'Take the change as is.')
            .alias('c')
            .action(function(args, callback) {
                vorpal_interactive.log('Change entry confirmed.');
                _this.entry++;
                if (_this.entry === _this.entries.length) { process.exit(); }
                vorpal_interactive.log('#'+_this.entries[_this.entry].id+': '+_this.entries[_this.entry].m);
                callback();
            });


        vorpal_interactive.on('keypress', function(e){

            if (!interaction_mode) { return false; }

            if (e.key==='up'){
                highlight--;
            }

            if (e.key==='down'){
                highlight++;
            }

            if (e.key==='space'){
                _this.entries[highlight].confirmed = true;
            }

            if (highlight < 0) { highlight = 0; }
            if (highlight > 3) { highlight = 3; }

            _this.redrawInteractiveUI();

        });

        vorpal_interactive.on('client_prompt_submit', function(e){

            interaction_mode = false;

            _this.log.write(_this.entries);
            process.exit();

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

        vorpal_interactive.ui.redraw(arr.join('\n')+nc);
        vorpal_interactive.ui.delimiter(':');

    },


    start: function(log, count){

        this.log = log;
        this.entry = 0;

        this.entries = this.log.read(count).reverse();

        vorpal_interactive = new vorpal();
        this.init();

        this.redrawInteractiveUI();
        vorpal_interactive.show();

    }

};
