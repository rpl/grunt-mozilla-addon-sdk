var main = require("./main");

var { Cc, Ci } = require("chrome");
var file = require("sdk/io/file");

var currDir = Cc["@mozilla.org/file/directory_service;1"]
                .getService(Ci.nsIDirectoryServiceProvider)
                .getFile("CurWorkD", {}).path;

exports["test ok"] = function(assert) {
  var rootRepositoryDir = currDir;
  // WORKAROUND: using '..' in file.join on windows doesn't work correctly
  // workaround in a cross-platform way using file.dirname
  for (let i=0; i<3; i++) {
    rootRepositoryDir = file.dirname(rootRepositoryDir);
  }

  fh = file.open(file.join(rootRepositoryDir, "tmp", "test_run.txt"), "w");
  fh.write("OK");
  fh.close();
  assert.ok(true, "it works");
};

require("sdk/test").run(exports);
