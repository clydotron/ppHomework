package controllers

import (
	"net/http"

	"gopkg.in/mgo.v2/bson"
)

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	(*w).Header().Set("Access-Control-Allow-Credentials", "true")
}

func extractId(w http.ResponseWriter, r *http.Request) (bson.ObjectId, bool) {
	id := r.URL.Query().Get(":id")
	if id == "" {
		http.NotFound(w, r)
		return "", false
	}

	if !bson.IsObjectIdHex(id) {
		w.WriteHeader(http.StatusNotFound)
		return "", false
	}

	return bson.ObjectIdHex(id), true
}

// func corsHandler(h http.Handler) http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		w.Header().Set("Access-Control-Allow-Origin", "*")
// 		if r.Method == "OPTIONS" {

// 			w.Header().Set("Access-Control-Allow-Headers", "Authorization") // You can add more headers here if needed

// 		} else {
// 			h.ServeHTTP(w, r)
// 		}
// 	}
// }
