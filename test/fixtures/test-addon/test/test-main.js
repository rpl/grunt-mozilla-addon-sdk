var main = require("./main");

var { Cc, Ci } = require("chrome");
var file = require("sdk/io/file");

var currDir = Cc["@mozilla.org/file/directory_service;1"]
                .getService(Ci.nsIDirectoryServiceProvider)
                .getFile("CurWorkD", {}).path;

exports["test ok"] = function(assert) {
  fh = file.open(file.join(currDir, "..", "..", "..",
                           "tmp", "test_run.txt"), "w");
  fh.write("OK");
  fh.close();
  assert.ok(true, "it works");
};

require("sdk/test").run(exports);
