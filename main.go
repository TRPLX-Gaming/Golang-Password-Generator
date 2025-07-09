package main

import (
	"os"
	"fmt"
	"embed"
	"net/http"
	"io/ioutil"
	"path/filepath"
	"encoding/json"
	crypto "pass_gen/utils"
)

var embedded embed.FS

func main() {

	
	filesDir := "./public"

	// api for hashing
	http.HandleFunc("/hash",hasher)

	// api for password generation
	http.HandleFunc("/generate-password",passwordGenerator)

	// rendering frontend in all undefined server routes
	fileServer := http.FileServer(http.Dir(filesDir))

	http.HandleFunc("/",func(w http.ResponseWriter, r *http.Request) {
		targetPath := filepath.Join(filesDir,r.URL.Path)
		_,err := os.Stat(targetPath)

		if os.IsNotExist(err) || r.URL.Path == "/" {
			http.ServeFile(w,r,filepath.Join(filesDir,"index.html"))
			return
		}
		fileServer.ServeHTTP(w,r)
	})

	fmt.Println("server on port 7000")
	http.ListenAndServe(":7000",nil)
	
}

// hashing func

func hasher(w http.ResponseWriter,r *http.Request) {
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

// password generation

type Config struct {
	Length int `json:"length"`
	Lower bool `json:"lower"`
	Upper bool `json:"upper"`
	Numbers bool `json:"numbers"`
	Symbols bool `json:"symbols"`
}

func passwordGenerator(w http.ResponseWriter,r *http.Request) {
	if r.Method != "POST" {
		http.Error(w,"wrong method",http.StatusBadRequest)
		return 
	}

	var config Config
	err := json.NewDecoder(r.Body).Decode(&config)
	if err != nil {
		fmt.Println(err)
		http.Error(w,err.Error(),http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	pConfig := crypto.CreateConfig(
		config.Length,
		config.Lower,
		config.Upper,
		config.Numbers,
		config.Symbols,
	)

	/*
	fmt.Println(r.Body)
	fmt.Println(config)
	fmt.Println(pConfig)
	*/

	generatedPassword,err := crypto.GeneratePassword(pConfig)
	if err != nil {
		fmt.Println(err)
		http.Error(w,err.Error(),http.StatusBadRequest)
		return
	}

	fmt.Fprintf(w,generatedPassword)

}
