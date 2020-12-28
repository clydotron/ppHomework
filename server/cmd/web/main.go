package main

import (
	"fmt"
	"net/http"

	"github.com/clydotron/ppHomework/pkg/controllers"
	"gopkg.in/mgo.v2"
)

type application struct {
	rmc *controllers.RoadmapController
	wsc *controllers.WorkspaceController
}

func main() {

	// add command line params: port
	// or use env vars

	dbName := "test-db"
	dbSession := getSession()
	rmc := controllers.NewRoadmapController(dbSession, dbName)
	wsc := controllers.NewWorkspaceController(dbSession, dbName)
	app := &application{rmc, wsc}

	fmt.Println("Listening on Port 4000")
	http.ListenAndServe(":4000", app.routes())

	//@todo should we close the mgo connection?
	fmt.Println("all done")
}

func getSession() *mgo.Session {

	//connect to our local mongo ---- @todo what about production?
	dbpath := "mongodb://mongodbx:27017"
	fmt.Println("connecting to:", dbpath)
	s, err := mgo.Dial(dbpath)
	//s, err := mgo.Dial("db")

	if err != nil {
		panic(err)
	}

	fmt.Println("connected to mongodb")
	return s
}
