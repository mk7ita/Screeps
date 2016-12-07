const GET_FROM_SOURCE = 0;
const PUT_IN_STORE = 1
const GOTO_FLAG = 2;

var roleHarvStatic2 = {

    run: function(creep) {
	    
	    if((creep.carry.energy == 0) && (creep.memory.activity != GOTO_FLAG)){
            creep.memory.activity = GET_FROM_SOURCE;
        }
        
	    if((creep.memory.activity == GET_FROM_SOURCE) && (creep.carry.energy == creep.carryCapacity)) {
            creep.memory.activity = PUT_IN_STORE;
        }
        
	    if((creep.memory.activity == GOTO_FLAG) && ((creep.pos.x == Game.flags.F_Energy_2.pos.x) && (creep.pos.y == Game.flags.F_Energy_2.pos.y))) {
            creep.memory.activity = GET_FROM_SOURCE;
        }
        
        if(creep.memory.activity == GET_FROM_SOURCE) {
            var nearestSource = creep.pos.findClosestByPath(FIND_SOURCES);
            if(creep.harvest(nearestSource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(nearestSource);
            }
        }
        
        if(creep.memory.activity == PUT_IN_STORE) {
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER);
                    }
            });
            creep.transfer(target, RESOURCE_ENERGY);
        }
        
        if(creep.memory.activity == GOTO_FLAG) {
            creep.moveTo(Game.flags.F_Energy_2.pos);
        }
	}
};

module.exports = roleHarvStatic2;