var main = require("./main");

var { Cc, Ci } = require("chrome");
var file = require("sdk/io/file");

var currDir = Cc["@mozilla.org/file/directory_service;1"]
                .getService(Ci.nsIDirectoryServiceProvider)
                .getFile("CurWorkD", {}).path;

exports["test ok"] = function(assert) {
  /* sdk/io/file works bad with '..' symbols on windows, 
  so we go up to root folder using regex */  
  var rootRepositoryDir = currDir.replace(/(\\|\/)(?:[^\\1]+\1?){3}$/, "");
	
  fh = file.open(file.join(rootRepositoryDir, "tmp", "test_run.txt"), "w");
  fh.write("OK");
  fh.close();
  assert.ok(true, "it works");
};

require("sdk/test").run(exports);