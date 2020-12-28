package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/clydotron/ppHomework/pkg/models"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type WorkspaceController struct {
	session      *mgo.Session
	databaseName string
}

func NewWorkspaceController(s *mgo.Session, dbName string) *WorkspaceController {
	return &WorkspaceController{s, dbName}
}

func (wsc *WorkspaceController) GetDefaultWorkspace(w http.ResponseWriter, r *http.Request) {
	//check
	enableCors(&w)

	count, err := wsc.session.DB(dbName).C("workspaces").Count()
	if err != nil {
		//do something
	}
	//fmt.Println("workspaces:", count)
	if count > 0 {
		// get the first
		ws := models.Workspace{}

		if err := wsc.session.DB(dbName).C("workspaces").Find(bson.M{}).One(&ws); err != nil {
			w.WriteHeader(http.StatusNotFound)
			return
		}

		wsj, _ := json.Marshal(ws)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, "%s\n", wsj)
		return
	}
	fmt.Println("nada")

}

func (wsc *WorkspaceController) GetWorkspace(w http.ResponseWriter, r *http.Request) {

	enableCors(&w)

	oid, bOk := extractId(w, r)
	if !bOk {
		return
	}

	ws := models.Workspace{}

	if err := wsc.session.DB(dbName).C("workspaces").FindId(oid).One(&ws); err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	wsj, _ := json.Marshal(ws)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "%s\n", wsj)
}

func (wsc *WorkspaceController) CreateWorkspace(w http.ResponseWriter, r *http.Request) {

	enableCors(&w)
	//fmt.Println("createWorkspace")

	ws := models.Workspace{}
	json.NewDecoder(r.Body).Decode(&ws)

	ws.ID = bson.NewObjectId()

	wsc.session.DB(dbName).C("workspaces").Insert(ws)

	wsj, _ := json.Marshal(ws)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	fmt.Fprintf(w, "%s\n", wsj)
}

func (wsc *WorkspaceController) UpdateWorkspace(w http.ResponseWriter, r *http.Request) {

	enableCors(&w)

	oid, ok := extractId(w, r)
	if !ok {
		return
	}

	ws := models.Workspace{}
	json.NewDecoder(r.Body).Decode(&ws)

	fmt.Println("Update Workspace:", ws)

	ws.ID = oid
	fmt.Println(ws)

	err := wsc.session.DB(wsc.databaseName).C("workspaces").UpdateId(oid, &ws)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	wsj, _ := json.Marshal(ws)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "%s\n", wsj)
}

func (wsc *WorkspaceController) Options(w http.ResponseWriter, r *http.Request) {
	fmt.Println("workspace_options:", r)

	//enableCors(&w)
	w.Header().Set("Access-Control-Allow-Origin", "*") //http://localhost:3000")
	w.Header().Add("Access-Control-Allow-Methods", "POST, OPTIONS, GET, DELETE, PATCH")
	w.Header().Add("Access-Control-Allow-Headers", "Content-Type, x-requested-with")
}

/*
curl -i -X OPTIONS -H "Origin: http://localhost:3000" \
    -H 'Access-Control-Request-Method: POST' \
    -H 'Access-Control-Request-Headers: Content-Type, Authorization' \
    "http://localhost:4000/api/v2/workspace/1"
*/
