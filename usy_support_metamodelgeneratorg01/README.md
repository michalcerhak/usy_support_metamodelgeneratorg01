This tool generates and updates metamodel for uuBt. It has been tested only with uuAwsc. 

# Features
- generate metamodel schemaVersion 1.0.0 from profiles.json
- update existing metamodel schemaVersion 1.0.0 or 0.1.0 from profiles.json, it odes not change anything else than useCaseProfileMap section

# How to install and update ?

 - Linux/Mac
   1. `npm install --registry "https://repo.plus4u.net/repository/npm/" -g $(npm v --registry http://registry.npmjs.com usy_support_metamodelgeneratorg01  dist.tarball)`
 - Windows
   1. `npm v --registry http://registry.npmjs.com usy_support_metamodelgeneratorg01  dist.tarball`
   2. `npm install --registry "https://repo.plus4u.net/repository/npm/" -g <urin from previous command>`

# How to use ?

Read help : `metamodel-generatorg01 --help`

## First generation
1. Generates new metamodel from profile.json
   `metamodel-generatorg01 -p profiles.json -m metamodel-1.0.json`
2. Fill required information into generated metamodel.
   - code, name, desc   
   - defaultPermissionMatrix
3. Your metamodel is ready.

## Update command profiles
1. Updates existing metamodel from profile.json
   `metamodel-generatorg01 -p profiles.json -m metamodel-1.0.json`

## Add new profile in to profiles.json
1. Add profile to metamodel (sections profileList and defaultPermissionMatrix)
2. Updates existing metamodel from profile.json
   `metamodel-generatorg01 -p profiles.json -m metamodel-1.0.json`


# Changelog
## 0.2.0
- generate metamodel schemaVersion 1.0.0
- update metamodel schemaVersion 1.0.0 and 0.1.0
- works with profiles.json from old and new appserver

## 0.1.3
- generate metamodel schemaVersion 0.1.0
- update metamodel schemaVersion 0.1.0