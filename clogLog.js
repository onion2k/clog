
var jsonfile = require('jsonfile');
var logpath = '.clog';

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

    delete: function(entries) {

        var _log = this.log();
        _log.log = _log.log.slice(entries, _log.log.length);
        this.write(_log);

    },


    deleteByID: function(id) {

        var _log = this.log();
        _log.log.splice((_log.log.length - id), 1);
        this.write(_log);

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
