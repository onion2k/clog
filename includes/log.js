
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

        let check = this.log();

        if (!check) {
            return false;
        }

        if (check.log.length===0) {
            return false;
        }

        return true;

    },

    getid: function(){

        if (this.check()) {
            var entries = this.log();
            entries.meta.id++;
            jsonfile.writeFileSync(logpath, entries);
            return entries.meta.id;
        } else {
            var entries = { meta: { id: 1 }, log: [] };
            jsonfile.writeFileSync(logpath, entries);
            return 1;
        }

    },

    read: function(entries){
        return this.log().log.slice(0, entries||10);
    },

    delete: function(entries) {

        var _log = this.log();
        _log.log = _log.log.slice(entries, _log.log.length);
        this.write(_log);

    },

    deleteByID: function(id) {

        var _log = this.log();

        var i = _log.log.findIndex(function(o){ return o.id == id});
        _log.log.splice(i, 1);
        this.write(_log);

    },

    edit: function(id, msg) {

        var _log = this.log();

        var i = _log.log.findIndex(function(o){ return o.id == id});
        _log.log[i].m = msg;
        _log.log[i].confirmed = false;
        this.write(_log);

    },

    entry: function(msg) {

        var id = this.getid();
        return {  'id': id, 'm': msg, 'd': Date.now(), 'confirmed': false, 'written': false };

    },

    append: function(msg) {

        var entries = this.log();
        entries.log.unshift(this.entry(msg));

        this.write(entries);

    },

    write: function(entries){

        jsonfile.writeFileSync(logpath, entries);

    }

};
