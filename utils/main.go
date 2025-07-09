package utils

import (
	"crypto/rand"
	"math/big"
	"fmt"
	"strings"
	"crypto/sha512"
	"encoding/hex"
)


func Hash1(salt string) string {
	
	hasher := sha512.New()

	hasher.Write([]byte(salt))

	hashedBytes := hasher.Sum(nil)

	hashedString := hex.EncodeToString(hashedBytes)
	return hashedString
}

// password generator

type PasswordConfig struct {
	length int
	lower bool
	upper bool
	numbers bool
	symbols bool
}

const (
	lowerChars    = "abcdefghijklmnopqrstuvwxyz"
	upperChars    = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	numberChars    = "0123456789"
	symbolChars  = "!@#$%^&*()_+-=[]{}|;:'\",.<>/?~"
)

func CreateConfig(length int,lower bool,upper bool, numbers bool, symbols bool) *PasswordConfig {
	return &PasswordConfig{
		length:length,
		upper:upper,
		lower:lower,
		numbers:numbers,
		symbols:symbols,
	}
}

func GeneratePassword(config *PasswordConfig) (string,error) {
	if config.length <= 4 {
		return "",fmt.Errorf("password length must be non-negative and greater than 4")
	}

	var passwordBuilder strings.Builder

	if config.upper {
		passwordBuilder.WriteString(upperChars)
	}
	if config.lower {
		passwordBuilder.WriteString(lowerChars)
	}
	if config.numbers {
		passwordBuilder.WriteString(numberChars)
	}
	if config.symbols {
		passwordBuilder.WriteString(symbolChars)
	}

	builtString := passwordBuilder.String()
	if builtString == "" {
		return "",fmt.Errorf("no filters to generate password selected!")
	}

	passwordBytes := []byte(builtString)
	passwordLength := big.NewInt(int64(len(passwordBytes)))

	password := make([]byte,config.length)

	for i := 0; i < config.length; i++ {
		randIndex,err := rand.Int(rand.Reader,passwordLength)
		if err != nil {
			return "",fmt.Errorf("could not generate password: %w",err)
		}
	
		password[i] = passwordBytes[randIndex.Int64()]
	}

	return string(password),nil

}









