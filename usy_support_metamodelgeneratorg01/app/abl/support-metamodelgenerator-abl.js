"use strict";
const fs = require("fs");
const path = require("path");
const MANDATORY_PROFILES = ["Authorities", "Executives", "Auditors"];
const IGNORED_PROFILES = ["AwidOwner", "Public"];

class SupportMetamodelgeneratorAbl {

  async createMetaModel(dtoIn) {
    let fileReadoptions = {encoding: "utf8", flag: "r"}
    const profiles = JSON.parse(fs.readFileSync(dtoIn.profilesFile, fileReadoptions));
    const template = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../", "resources/template.json"), fileReadoptions));
    let existingMetamodel;
    if (fs.existsSync(dtoIn.metamodel)) {
      existingMetamodel = JSON.parse(fs.readFileSync(dtoIn.metamodel, fileReadoptions));
    }
    let res = template;

    if (existingMetamodel) {
      this._fillHeader(res, existingMetamodel);
    }

    let profileList = profiles["*"].profileList;
    profileList = profileList.filter(p => !IGNORED_PROFILES.includes(p));
    if (existingMetamodel) {
      if (!this._checkArrayEquals(profileList, existingMetamodel.profileList.map(p => p.code))) {
        console.log("Profiles are not same !!!");
        console.log(`profiles.json : ${profileList.join(", ")}`)
        console.log(`metamodel.json: ${existingMetamodel.profileList.map(p => p.code).join(", ")}`)
        return;
      }
    }
    let profilesUcMap = profiles["*"].useCaseMap;

    if (dtoIn.mandatoryProfiles.some(i => !(profileList.indexOf(i) > -1))) {
      throw "Missing mandatory profile. You must have at least these 3 profiles in your profiles.json : Authorities, Executives, Auditors. If you have these profiles with different name, please use --mandatory-profiles attribute to map it.";
    }

    if (existingMetamodel) {
      res.profileList = existingMetamodel.profileList;
      res.defaultPermissionMatrix = existingMetamodel.defaultPermissionMatrix;
    } else {
      res.profileList = [];
      dtoIn.mandatoryProfiles.forEach(p => res.profileList.push({code: p, name: p, desc: p, disableImplicitPermissions: false, enabledExplicitTypeList: ["uu-businessterritory-maing01/uuRoleGroupIfc"]}));
      profileList.forEach(p => {
        if (dtoIn.mandatoryProfiles.indexOf(p) < 0) {
          res.profileList.push({code: p, name: p, desc: p})
        }
      });
    }

    let profilesIndex = new Map();
    res.profileList.forEach((p, i) => profilesIndex.set(p.code, i));

    Object.keys(profilesUcMap).forEach(uc => {
      let ucProfiles = profilesUcMap[uc];
      if(!ucProfiles.sysStateList || ucProfiles.sysStateList.includes("active")) {
        let profiles = ucProfiles.profileList || ucProfiles;
        let key = res.schemaVersion == "0.1.0"?uc:`${res.code}/${uc}`;
        res.useCaseProfileMap[key] = this._getProfilesMatrix(profiles, profilesIndex)
      }
    });

    fs.writeFileSync(dtoIn.metamodel, JSON.stringify(res, null, 2))
  }

  _getProfilesMatrix(profiles, profilesIndexMap) {
    let res = new Array(32).fill(0);
    profiles.forEach(p => {
      if (!IGNORED_PROFILES.includes(p)) {
        if (!profilesIndexMap.has(p)) {
          throw `Unknown profile ${p}`;
        }
        res[profilesIndexMap.get(p)] = 1
      }
    });

    let parts = [];
    let i, j, temparray, chunk = 8;
    for (i = 0, j = res.length; i < j; i += chunk) {
      temparray = res.slice(i, i + chunk);
      parts.push(temparray.join(""))
    }
    return parts.join("-");
  }

  _fillHeader(res, existingMetamodel) {
    res.code = existingMetamodel.code;
    res.name = existingMetamodel.name;
    res.version = existingMetamodel.version;
    res.desc = `${existingMetamodel.code} - metamodel`;
    res.schemaVersion = `${existingMetamodel.schemaVersion}`;
    if (res.defaultCategory) {
      res.defaultCategory = `${existingMetamodel.defaultCategory}`
    }
    res.stateList = existingMetamodel.stateList;
    if (res.ancestorPathMap) {
      res.ancestorPathMap = existingMetamodel.ancestorPathMap;
    }
    if (res.ancestorPathList) {
      res.ancestorPathList = res.ancestorPathList;
    }
    res.ancestorMap = existingMetamodel.ancestorMap;
    res.synchronizeUuCmdMap = existingMetamodel.synchronizeUuCmdMap;
    res.routeMap = existingMetamodel.routeMap;
    if (res.typeMap) {
      res.typeMap = existingMetamodel.typeMap;
    }
  }

  _checkArrayEquals(a, b) {
    let array1 = a.slice().sort();
    let array2 = b.slice().sort();
    return (array1.length == array2.length) && array1.every(function (element, index) {
      return element === array2[index];
    });
  }
}

module.exports = new SupportMetamodelgeneratorAbl();
