var roleEnergyCargo = require('role.energyCargo');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairWalls = require('role.repairWalls');
var roleHarvStatic1 = require('role.harvStatic1');
var roleHarvStatic2 = require('role.harvStatic2');
var roleRepairRoads = require('role.repairRoads');
var roleRepairContainers = require('role.repairContainers');

const c_EnergyCargo = 2;
const c_Upgrader = 2;
const c_Builder = 3;
const c_HarvStatic1 = 1;
const c_HarvStatic2 = 1;
const c_RepairRoads = 1;
const c_RepairContainers = 1;
const c_RepairWalls = 0;

const GET_FROM_SOURCE = 0;
const PUT_IN_STORE = 1
const GOTO_FLAG = 2;

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var harvStatic1 = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvStatic1');
    console.log('Harvesters South: ' + harvStatic1.length);

    if(harvStatic1.length < c_HarvStatic1) {
        var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,CARRY,MOVE], undefined, {role: 'harvStatic1', activity: GOTO_FLAG, container: false});
        console.log('Spawning new Harvesters South: ' + newName);
    }

    var harvStatic2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvStatic2');
    console.log('Harvesters North: ' + harvStatic2.length);

    if(harvStatic2.length < c_HarvStatic2){
        var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,CARRY,MOVE], undefined, {role: 'harvStatic2', activity: GOTO_FLAG});
        console.log('Spawning new Harvesters North: ' + newName);
    }
/*
    if((harvStatic2.length == c_HarvStatic2) && (harvStatic2[0].ticksToLive < 250)){
        var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvStatic2', activity: GOTO_FLAG});
        console.log('Spawning new Harvesters North: ' + newName);
    }
*/
    var energyCargo = _.filter(Game.creeps, (creep) => creep.memory.role == 'energyCargo');
    console.log('EnergyCargo: ' + energyCargo.length);

    if(energyCargo.length < c_EnergyCargo) {
        var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,CARRY,MOVE], undefined, {role: 'energyCargo'});
        console.log('Spawning new Energy Cargo: ' + newName);
    }

    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    console.log('Upgraders: ' + upgraders.length);

    if(upgraders.length < c_Upgrader) {
        var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,CARRY,MOVE], undefined, {role: 'upgrader'});
        console.log('Spawning new upgrader: ' + newName);
    }

    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    console.log('Builders: ' + builders.length);

    if(builders.length < c_Builder) {
        var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,CARRY,MOVE], undefined, {role: 'builder'});
        console.log('Spawning new builder: ' + newName);
    }

    var repairRoads = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairRoads');
    console.log('Repair North Roads: ' + repairRoads.length);

    if(repairRoads.length < c_RepairRoads) {
        var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'repairRoads', activity: 'nothing', target: 0});
        console.log('Spawning new Roads repairer: ' + newName);
    }

    var repairContainers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairContainers');
    console.log('Repair Containers: ' + repairContainers.length);

    if(repairContainers.length < c_RepairContainers) {
        var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'repairContainers', activity: 'nothing', target: 0});
        console.log('Spawning new Containers repairer: ' + newName);
    }

    var repairWalls = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairWalls');
    console.log('Repair Walls: ' + repairWalls.length);

    if(repairWalls.length < c_RepairWalls) {
        var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'repairWalls', activity: 'nothing', target: 0});
        console.log('Spawning new Walls repairer: ' + newName);
    }

    var tower = Game.getObjectById('58440172b1b310b373dd1ec5');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType == STRUCTURE_ROAD) &&
                        structure.hits < Memory.roadRepair) ||
                        (((structure.structureType == STRUCTURE_WALL) ||
                        (structure.structureType == STRUCTURE_RAMPART)) &&
                            structure.hits < Memory.wallRepair) ||
                        ((structure.structureType == STRUCTURE_CONTAINER) &&
                        structure.hits < (structure.hitsMax / 2));
                }
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'energyCargo') {
            roleEnergyCargo.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'repairRoads') {
            roleRepairRoads.run(creep);
        }
        if(creep.memory.role == 'repairContainers') {
            roleRepairContainers.run(creep);
        }
        if(creep.memory.role == 'repairWalls') {
            roleRepairWalls.run(creep);
        }
        if(creep.memory.role == 'harvStatic1') {
            roleHarvStatic1.run(creep);
        }
        if(creep.memory.role == 'harvStatic2') {
            roleHarvStatic2.run(creep);
        }
    }
}