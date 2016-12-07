var roleRepairRoads = {

    run: function(creep) {

 	    if(creep.carry.energy == 0) {
            var nearestSource = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) &&
                        structure.store[RESOURCE_ENERGY] > 0;
                }
            });
            if(creep.withdraw(nearestSource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(nearestSource);
            }
 	    } 
        else {
            if(creep.memory.target != 0) {
                
                theTarget = Game.getObjectById(creep.memory.target);
                if((theTarget.hits >= theTarget.hitsMax) && (creep.memory.activity == 'repairing')) {
                    creep.memory.target = 0;
                    creep.memory.activity = 'nothing';
                }
                if(creep.repair(theTarget) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(theTarget);
                }
            
            } else {
                
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_ROAD) &&
                            structure.hits < Memory.roadRepair;
                    }
                });

                if(targets.length > 0) {
                    creep.memory.target = targets[0].id;
                    creep.memory.activity = 'repairing';
                }
            }
        }
	}
};

module.exports = roleRepairRoads;