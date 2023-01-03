package main

import (
	"fmt"
	"net/http"
)

func main() {
	PORT := fmt.Sprint(3000)
	fileServer := http.FileServer(http.Dir("client"))
	http.Handle("/", fileServer)
	fmt.Println("Server started on " + PORT)
	http.ListenAndServe(":"+PORT, nil)
}
