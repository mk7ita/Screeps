var roleRepairWalls = {

    run: function(creep) {

 	    if(creep.carry.energy == 0) {
            var nearestSource = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) &&
                        structure.store[RESOURCE_ENERGY] > 0;
                }
            });
            if(typeof nearestSource == 'undefined') {
                var source = creep.pos.findClosestByPath(FIND_SOURCE);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            } else {
                if(creep.withdraw(nearestSource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(nearestSource);
                }
            }
 	    } 
        else {
            if(creep.memory.target != 0) {
                
                theTarget = Game.getObjectById(creep.memory.target);
                if((theTarget.hits >= Memory.wallHits) && (creep.memory.activity == 'repairing')) {
                    creep.memory.target = 0;
                    creep.memory.activity = 'nothing';
                }
                if(theTarget.hits >= Memory.wallUpgrade) {
                    creep.memory.target = 0;  
                    creep.memory.activity = 'nothing';
                }
                if(creep.repair(theTarget) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(theTarget);
                }
            
            } else {
                
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_WALL) || (structure.structureType == STRUCTURE_RAMPART)) &&
                            structure.hits < Memory.wallRepair;
                    }
                });

                if(targets.length > 0) {
                    creep.memory.target = targets[0].id;
                    creep.memory.activity = 'repairing';
                } else {
                    var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return ((structure.structureType == STRUCTURE_WALL) || (structure.structureType == STRUCTURE_RAMPART)) &&
                                structure.hits < Memory.wallUpgrade;
                        }
                    });
                    if(targets.length > 0) {
                        creep.memory.target = targets[0].id;
                        creep.memory.activity = 'upgrading';
                    } else {
                        Memory.wallHits = Memory.wallUpgrade;
                        Memory.wallUpgrade += 10000;
                        Memory.wallRepair += 10000;
                    }
                }
            }
        }
	}
};

module.exports = roleRepairWalls;