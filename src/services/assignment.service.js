const Chore = require("../models/chore.model");
const Preference = require("../models/preference.model");
const Assignment = require("../models/assignment.model");
const Room = require("../models/room.model");
const RoomUser = require("../models/room_user.model");

exports.createAssignments = async function() {
  const rooms = await Room.find({});
  for (let i = 0; i < rooms.length; ++i) {
    await this.createAssignmentsByRoomId(rooms[i].id);
  }
};

exports.createAssignmentsByRoomId = async function(roomId) {
  //For a given room, want to create the assignments for the upcoming week(and handle housekeeping)
  //Algorithm:
  //Get all chores to be considered for the week
  //Work through the list of chores(sorted descending by time value rn, can change later)
  //Whoever in the room wants that chore the most, give it to them
  //Remove that user from the list of eligible users
  //Repeat the process until we have 0 users left in the eligible group
  //Then repopulate the eligible group with all users

  //Get the chores for that room that are "upcoming" for the week to be assigned
  const upcomingChores = await Chore.find({
    roomId: roomId,
    upcoming: true
  }).sort({ time: -1 });

  //Users in that room
  let userIds = await RoomUser.getUserIdsByRoomId(roomId);

  //Get highest eligible bidder for chore
  for (let i = 0; i < upcomingChores.length; ++i) {
    const chore = upcomingChores[i];

    //if no eligible users, repopulate the set
    if (userIds.length == 0) {
      userIds = await RoomUser.getUserIdsByRoomId(roomId);
    }

    //Get the highest eligible preference for the chore
    const preferences = await Preference.find({
      choreId: chore.id,
      userId: { $in: userIds }
    }).sort({ weight: -1 });
    const topBidder = preferences[0];

    //Top bidder gets that chore and is removed from eligible list
    let userIndex = -1;
    for (let i = 0; i < userIds.length; ++i) {
      if (userIds[i].toString() == topBidder.userId.toString()) {
        userIndex = i;
      }
    }
    userIds.splice(userIndex, 1);

    //Top bidder gets that chore assigned to them
    const assignment = new Assignment({
      choreId: chore.id,
      userId: topBidder.userId,
      active: true,
      successful: false
    });
    await assignment.save();

    //Housekeeping for chore
    //Chore is considered "active/inprogress" since it has an active assignment
    chore.active = true;
    //If chore is recurring, make it upcoming up for next week
    //Else, then retire chore for the list of considered chores for next week's chore list
    if (chore.recurring == true) {
      chore.upcoming = true;
    } else {
      chore.upcoming = false;
    }
    await chore.save();
  }
};

exports.retireAssignments = async function() {
  const roomIds = await Room.find({}).distinct("_id");
  for (let i = 0; i < roomIds.length; ++i) {
    await this.retireAssignmentsByRoomId(roomIds[i]);
  }
};

exports.retireAssignmentsByRoomId = async function(roomId) {
  //Want to convert all assignments and chores in this room to have "Active" == False
  const chores = await Chore.find({ roomId: roomId, active: true });
  for (let i = 0; i < chores.length; ++i) {
    chores[i].active = false;
    await chores[i].save();

    const assignment = await Assignment.findOne({
      choreId: chores[i].id,
      active: true
    });
    assignment.active = false;
    await assignment.save();
  }
};
