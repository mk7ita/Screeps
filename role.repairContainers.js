var roleRepairContainers = {

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
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) &&
                        structure.hits < (structure.hitsMax / 2);
                }
            });
            if(targets.length > 0) {
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        }
	}
};

module.exports = roleRepairContainers;