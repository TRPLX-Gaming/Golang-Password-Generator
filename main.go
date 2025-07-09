package main

import (
	"fmt"
	"net/http"
	"io/ioutil"
	crypto "pass_gen/utils"
)

func main() {

	/*
	filesDir := "./public"
	filesRoute := "/views/"

	http.HandleFunc("/hash",responder)

	fileServer := renderFrontend(filesDir,filesRoute)
	http.Handle(filesRoute,fileServer)

	fmt.Println("server on port 7000")
	http.ListenAndServe(":7000",nil)
	*/

	pConf := crypto.CreateConfig(
		10000000,
		true,
		true,
		false,
		false,
	)
	i := 0
	for i < 2 {
		fmt.Println(crypto.GeneratePassword(pConf))
		i++
	}
}

func responder(w http.ResponseWriter,r *http.Request) {
	// checking the http method
	if r.Method != "POST" {
		http.Error(w,"wrong method",http.StatusBadRequest)
		return 
	}

	// getting the string to hash
	body,err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w,err.Error(),http.StatusBadRequest)
		return
	}

	// parsing info to string
	str := string(body)
	// hashing it
	result := crypto.Hash1(str)

	// send result back
	fmt.Fprintf(w,result)

}

func renderFrontend(targetDir,route string) http.Handler {
	fileServer := http.FileServer(http.Dir(targetDir))
	return http.StripPrefix(route,fileServer)
}


