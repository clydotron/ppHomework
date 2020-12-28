
db.roadmaps.insert({
    "title": "roadmap D",
	"lanes": [],
	"nextLaneId": 1,
	"nextTaskId": 11
});

const roadmapId = db.roadmaps.find()[0]._id.valueOf();

db.workspaces.insert({
    _id: ObjectId("536f710fc55b2acc61000bc9"),
    "title": "workspace D",
	"roadmap": roadmapId
});