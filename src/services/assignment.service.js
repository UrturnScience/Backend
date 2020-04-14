const Chore = require("../models/chore.model");
const Preference = require("../models/preference.model");
const Assignment = require("../models/assignment.model");
const Room = require("../models/room.model");
const RoomUser = require("../models/room_user.model");

const PreferenceService = require("./preference.service");
const UtilityService = require("./utility_functions.service");

exports.createAssignments = async function () {
  const rooms = await Room.find({});
  for (let i = 0; i < rooms.length; ++i) {
    await this.createAssignmentsByRoomId(rooms[i].id);
  }
};

exports.createAssignmentsByRoomId = async function (roomId) {
  //For a given room, want to create the assignments for the upcoming week(and handle housekeeping)
  //Algorithm:
  //Simulate a draft between users given their preferences
  //Will utilize a snake draft(with the initial list scrambled each time)
  //Following the drafting order, the drafter will get their highest choice of upcoming chores

  //Get the chores for that room that are "upcoming" for the week to be assigned
  const upcomingChores = await Chore.find({
    roomId: roomId,
    upcoming: true,
  });

  //Keep track of chosen chores, keep them as the toString version of the objectids
  const chosenChoreIds = new Set();

  //Users in that room
  const userIds = await RoomUser.getUserIdsByRoomId(roomId);

  //Creates a shuffled array of userIds from a copy
  const draftingOrder = await UtilityService.getDraftingOrder(
    userIds,
    upcomingChores.length
  );

  //Working through the drafting order, select the highest rated chore upcoming for the user
  for (let i = 0; i < draftingOrder.length; ++i) {
    //The user to draft for the round
    const userId = draftingOrder[i];

    //Get the drafter's preferences in order of their preferences
    const userPreferences = await PreferenceService.getUpcomingPreferences(
      userId
    );

    //Get highest available chore
    const chosenChoreId = await UtilityService.findHighestUpcomingChore(
      userPreferences,
      chosenChoreIds
    );

    //Create assignment for that chore
    const assignment = new Assignment({
      choreId: chosenChoreId,
      userId: userId,
      active: true,
      successful: false,
    });
    await assignment.save();

    //Add the chosen chore to the list of chosen chores
    chosenChoreIds.add(chosenChoreId.toString());
  }

  //Housekeeping for chores
  for (let i = 0; i < upcomingChores.length; ++i) {
    const chore = upcomingChores[i];
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

  //Fix the preference ordering since some chores were removed from the upcoming preference list
  await PreferenceService.fixPreferencesByRoomId(roomId);
};

exports.retireAssignments = async function () {
  const roomIds = await Room.find({}).distinct("_id");
  for (let i = 0; i < roomIds.length; ++i) {
    await this.retireAssignmentsByRoomId(roomIds[i]);
  }
};

exports.retireAssignmentsByRoomId = async function (roomId) {
  //Want to convert all assignments and chores in this room to have "Active" == False
  const chores = await Chore.find({ roomId: roomId, active: true });
  for (let i = 0; i < chores.length; ++i) {
    chores[i].active = false;
    await chores[i].save();

    const assignment = await Assignment.findOne({
      choreId: chores[i].id,
      active: true,
    });
    assignment.active = false;
    await assignment.save();
  }
};
