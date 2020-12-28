package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/clydotron/ppHomework/pkg/models"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

var (
	dbName = "test-db"
)

// RoadmapController
type RoadmapController struct {
	session *mgo.Session
	dbName  string
}

func NewRoadmapController(s *mgo.Session, dbName string) *RoadmapController {
	return &RoadmapController{s, dbName}
}

func (rmc *RoadmapController) GetRoadmap(w http.ResponseWriter, r *http.Request) {

	oid, bOk := extractId(w, r)
	if !bOk {
		return
	}

	enableCors(&w)

	rm := models.Roadmap{}

	if err := rmc.session.DB(dbName).C("roadmaps").FindId(oid).One(&rm); err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	rmj, _ := json.Marshal(rm)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "%s\n", rmj)

}

func (rmc *RoadmapController) CreateRoadmap(w http.ResponseWriter, r *http.Request) {
	//decode the inc
	//fmt.Println(r.Body)
	enableCors(&w)

	rm := models.Roadmap{}
	json.NewDecoder(r.Body).Decode(&rm)

	rm.ID = bson.NewObjectId()

	rmc.session.DB(dbName).C("roadmaps").Insert(rm)

	rmj, _ := json.Marshal(rm)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	fmt.Fprintf(w, "%s\n", rmj)
}

func (rmc *RoadmapController) UpdateRoadmap(w http.ResponseWriter, r *http.Request) {

	oid, bOk := extractId(w, r)
	if !bOk {
		return
	}
	enableCors(&w)

	rm := models.Roadmap{}
	json.NewDecoder(r.Body).Decode(&rm)
	rm.ID = oid
	//fmt.Println(rm)

	err := rmc.session.DB(dbName).C("roadmaps").UpdateId(oid, &rm)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	rmj, _ := json.Marshal(rm)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "%s\n", rmj)
}

func (rmc *RoadmapController) DeleteRoadmap(w http.ResponseWriter, r *http.Request) {

	id := r.URL.Query().Get(":id")
	if id == "" {
		http.NotFound(w, r)
		return
	}

	if !bson.IsObjectIdHex(id) {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	oid := bson.ObjectIdHex(id)

	if err := rmc.session.DB(dbName).C("roadmaps").RemoveId(oid); err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Deleted Roadmap: %s\n", oid)
}

func (rmc *RoadmapController) Options(w http.ResponseWriter, r *http.Request) {
	fmt.Println("roadmap_options")

	//enableCors(&w)
	w.Header().Set("Access-Control-Allow-Origin", "*") //http://localhost:3000")
	w.Header().Add("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PATCH")
	w.Header().Add("Access-Control-Allow-Headers", "Content-Type, x-requested-with")

	fmt.Fprintln(w, "options")
}

/*
	roadmap := &models.Roadmap{
		Name: "roadmap 1",
		Lanes: []models.Lane{
			models.Lane{
				Title:  "lane 1",
				Color: "orange",
				Rows: []models.Row{
					models.Row{
						Tasks: []models.Task{
							models.Task{Name: "task 1", Color: "0xff7755"},
							models.Task{"task 2", "purple"},
						},
					},
					models.Row{
						Tasks: []models.Task{
							models.Task{"task 5", "0x556699"},
							models.Task{"task 6", "purple"},
						},
					},
				},
			},
			models.Lane{
				Name:  "lane 2",
				Color: "0xcc4477",
				Rows: []models.Row{
					models.Row{
						Tasks: []models.Task{
							models.Task{"task 3", "green"},
							models.Task{"task 4", "purple"},
						},
					},
				},
			},
		},
	}
	json.NewEncoder(w).Encode(roadmap)
*/
