#!/usr/bin/env node
//must be set as first thing....it seems that some dependency changes the directory
const procesCwd = process.cwd();

const SupportMetamodelGeneratorAbl = require("./app/abl/support-metamodelgenerator-abl");
const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");

const path = require("path");

const optionDefinitions = [
  {
    name: "profiles",
    alias: "p",
    type: String,
    typeLabel: "{underline file}",
    description: "Path to profiles.json"
  },
  {
    name: "metamodel",
    alias: "m",
    type: String,
    typeLabel: "{underline file}",
    description: "Path to metamodel to create/update."
  },
  {
    name: "mandatory-profiles",
    type: String,
    multiple: true,
    typeLabel: "{underline Authorities profile name} {underline Executives profile name} {underline Auditors profile name}",
    description: "Path to metamodel to create/update.",
    defaultValue: ["Authorities", "Executives", "Auditors"]
  },
  {
    name: "help",
    alias: "h",
    type: Boolean,
    description: "Displays this usage guide."
  },
];
const sections = [
  {
    header: "metamodel-generatorg01",
    content: `Genarate metamodel from provided profiles.json and already exiting metamodel. If metamodel file  exists, it is updated.
    It generates metamodel in version 1.0.0 only but it is able aso to maintain version 0.1.0
    `
  },
  {
    header: "Synopsis",
    content: [
      "$ metamodel-generatorg01 -p profiles.json -m metamodel-1.0.json",
      "$ metamodel-generatorg0 -h",
    ]
  },
  {
    header: "Options",
    optionList: optionDefinitions
  }
];
const usage = commandLineUsage(sections);
const options = commandLineArgs(optionDefinitions);

if (options.help || !options.profiles || !options.metamodel) {
  console.log(usage);
  process.exit();
};

let dtoIn = {
  profilesFile: path.resolve(procesCwd, options.profiles),
  metamodel: path.resolve(procesCwd, options.metamodel),
  mandatoryProfiles: options["mandatory-profiles"]
}


SupportMetamodelGeneratorAbl.createMetaModel(dtoIn);
