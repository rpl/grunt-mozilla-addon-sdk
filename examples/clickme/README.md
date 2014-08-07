This example shows how to build a Firefox add-on with external packages as dependencies
using grunt and grunt-mozilla-addon-sdk.

## Repository Structure

```
- package.json
- Gruntfile
- src
  - package.json
  - lib
  - packages
```

- The build process is configured by the **Gruntfile** in the root directory of the project;
- the main **package.json** is used to install all nodejs dependencies needed by the build process (e.g. grunt and grunt-mozilla-addon-sdk),
  currently it needs to be a separate files from the addon package.json because npm will not be able to find the addon-sdk dependencies 
  in the npm packages repository;
- **src** is the directory of the our Firefox add-on sources;
- **src/package.json** describe the Firefox add-on metadata, **cfx** will read this file and use its **dependencies** attribute as the list 
  of addon-sdk dependencies needed by our add-on;
- **src/packages** is the directory of the addon-sdk external packages, all the dependencies (and dependencies of the dependencies ;-))
  need to be downloaded and unpacked in this directory manually (or using git submodules or custom crafted automation), 
  because currently there isn't a repository of addon-sdk packages (and with **jpm** we will use the npm packages repository)

- the **Gruntfile** define
  - Addon-SDK version to download and where it should be unpacked (**mozilla-addon-sdk** config)
  - How to build the addon and where to put its generated xpi (**mozilla-cfx-xpi** config)
  - How to run the addon without installing it from a generated xpi (**mozilla-cfx** config)

