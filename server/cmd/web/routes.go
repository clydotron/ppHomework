package main

import (
	"fmt"
	"net/http"

	"github.com/bmizerany/pat"
	"github.com/justinas/alice"
)

func corsHandlerX(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		if r.Method == "OPTIONS" {
			fmt.Println("options")
			w.Header().Set("Access-Control-Allow-Headers", "Authorization") // You can add more headers here if needed

		} else {
			fmt.Println("method:", w.Header())
			h.ServeHTTP(w, r)
		}
	})
}
func (app *application) logRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Printf("%s - %s %s %s", r.RemoteAddr, r.Proto, r.Method, r.URL.RequestURI())

		next.ServeHTTP(w, r)
	})
}
func (app *application) routes() http.Handler {

	mwx := alice.New(app.logRequest, corsHandlerX)

	mux := pat.New()
	//mux.Get("/", http.HandlerFunc(app.home))
	mux.Get("/api/v2/workspace/default", http.HandlerFunc(app.wsc.GetDefaultWorkspace))
	mux.Get("/api/v2/workspace/:id", http.HandlerFunc(app.wsc.GetWorkspace))
	mux.Post("/api/v2/workspace", http.HandlerFunc(app.wsc.CreateWorkspace))
	mux.Patch("/api/v2/workspace/:id", http.HandlerFunc(app.wsc.UpdateWorkspace))
	mux.Options("/api/v2/workspace/", http.HandlerFunc(app.wsc.Options))
	//mux.Patch()

	mux.Get("/api/v2/roadmap/:id", mwx.ThenFunc(app.rmc.GetRoadmap))
	mux.Post("/api/v2/roadmap", mwx.ThenFunc(app.rmc.CreateRoadmap))
	mux.Patch("/api/v2/roadmap/:id", mwx.ThenFunc(app.rmc.UpdateRoadmap))
	mux.Options("/api/v2/roadmap/", http.HandlerFunc(app.rmc.Options))
	//delete not exposed.
	return mux
}
