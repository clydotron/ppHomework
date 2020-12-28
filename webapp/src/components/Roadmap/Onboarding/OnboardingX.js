


// onboarding state machine:
// states: showAddLane, showAddTask, showAddSecondTask, complete
// initial state: showAddLane
// show the AddLane dialog t seconds after the page is refreshed if:
// the number of lanes is zero, and the state is showAddLane.
// upon successfully adding a lane, if the lane count is 1 and the state is showAddTask,
// show the addTask dialog (after t seconds)
// >>> IF in the meantime the user has added a task, skip this state, and prepare for addSecondTask
// upon successfully adding a task, check to see if the total number of tasks (for that lane?) is 1, (and the # of tasks is 1)
// show the addSecondTask dialog. (upon closing that, we are done)
// >>>> make the state advance after the user closes the popup
