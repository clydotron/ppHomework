package models

import "gopkg.in/mgo.v2/bson"

type Task struct {
	ID    int    `json:"id"`
	Title string `json:"title"`
	Color string `json:"color"`
}

type Row struct {
	Tasks []Task `json:"tasks"`
}

type Lane struct {
	ID        int      `json:"id"`
	Title     string   `json:"title"`
	Color     string   `json:"color"`
	Collapsed bool     `json:"collapsed"`
	Rows      []Row    `json:"rows"`
	Tasks     [][]Task `json:"tasks"`
}

type Roadmap struct {
	Title      string `json:"title"`
	Lanes      []Lane `json:"lanes"`
	NextLaneId int    `json:"nextLaneId"`
	NextTaskId int    `json:"nextTaskId"`

	ID bson.ObjectId `json:"id" bson:"_id"`
}

type Workspace struct {
	Title      string        `json:"title"`
	Roadmap    string        `json:"roadmap"`
	TaskColors []string      `json:"taskColors"`
	LaneColors []string      `json:"laneColors"`
	ID         bson.ObjectId `json:"id" bson:"_id"`
}
