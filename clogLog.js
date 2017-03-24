
process.chdir(__dirname);

var jsonfile = require('jsonfile');
var logpath = 'log.json';

module.exports = {

    log: function() {

        try {
            _log = jsonfile.readFileSync(logpath);
        } catch(e) {
            _log = false;
        }

        return _log;

    },

    check: function(){
        return this.log();
    },

    read: function(entries){

        return this.log().log.slice(0, entries);

    },

    delete: function() {

        var entries = this.log();
        entries.log.shift();
        this.write(entries);

    },

    append: function(msg) {

        if (this.check()) {
            var entries = this.log();
                entries.log.unshift({ m: msg, d: Date.now() });
        } else {
            var entries = { log: [{ m: msg, d: Date.now() }] };
        }
        this.write(entries);

    },

    write: function(entries){

        jsonfile.writeFileSync(logpath, entries);

    }

};
