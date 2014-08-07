var menuitem = require("menuitems").Menuitem({
  id: "clickme",
  menuid: "menu_ToolsPopup",
  label: "Click Me!",
  onCommand: function() {
    console.log("clicked");
  },
  insertbefore: "menu_pageInfo"
});
