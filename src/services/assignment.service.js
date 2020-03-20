const Chore = require("../models/chore.model");
const Preference = require("../models/preference.model");
const Assignment = require("../models/assignment.model");
const Room = require("../models/room.model");
const RoomUser=require("../models/room_user.model");

const ChoreService = require("./chore.service");
const RoomUserService = require("./room_user.service");

exports.createAssignments = async function(){
    const rooms = await Room.find({});
    for(let i = 0; i < rooms.length; ++i){
        await this.createAssignmentsByRoomId(rooms[i].id);
    }
}

exports.createAssignmentsByRoomId = async function(roomId){
    //For a given room, want to create the assignments for the upcoming week(and handle housekeeping)
    //Algorithm:
        //Get all chores to be considered for the week
        //Work through the list of chores(sorted descending by time value rn, can change later)
        //Whoever in the room wants that chore the most, give it to them
        //Remove that user from the list of eligible users
        //Repeat the process until we have 0 users left in the eligible group
        //Then repopulate the eligible group with all users

    //Get the chores for that room that are "upcoming" for the week to be assigned
    const upcomingChores = await Chore.find({roomId: roomId, upcoming: true}).sort({time: -1});
    let userIds = await RoomUserService.getUserIdsByRoomId(roomId);

    //get preferences

    for(let i = 0; i < upcomingChores.length; ++i){
        //Get highest eligible bidder for chore
        const chore = upcomingChores[i];

        //if no eligible users, repopulate the set
        if(userIds.length == 0){
            userIds = await RoomUserService.getUserIdsByRoomId(roomId);
        }

        //Get the list of preferences for that chore
        const topBidder = (await Preference.find({choreId: chore.id, userId: {"$in": userIds}}).sort({"weight": -1}).limit(1))[0];
        //Top bidder gets that chore and is removed from eligible list
        let userIndex = -1;

        //Indexof doesn't work for ObjectIds, since objects
        for(let i = 0; i < userIds.length; ++i){
            if(userIds[i].toString() == topBidder.userId.toString()){
                userIndex = i;
            }
        }
        userIds.splice(userIndex,1);

        //Top bidder gets that chore assigned to them
        const assignment = new Assignment({
            choreId: chore.id,
            userId: topBidder.userId
        });
        console.log(assignment);
        await assignment.save();
    }
}