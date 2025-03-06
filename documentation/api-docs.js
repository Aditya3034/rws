// API Documentation
const apiDocumentation = {
    "api": {
      "name": "Authentication API",
      "version": "1.0.0",
      "baseUrl": "/api/auth",
      "description": "Authentication service with user registration, login, Google authentication, and logout functionality",
      "endpoints": [
        {
          "path": "/signup",
          "method": "POST",
          "description": "Creates a new user account in the system",
          "requestBody": {
            "type": "application/json",
            "required": true,
            "content": {
              "username": {
                "type": "string",
                "description": "Unique username for the account",
                "required": true
              },
              "email": {
                "type": "string",
                "description": "User's email address (must be unique)",
                "required": true
              },
              "password": {
                "type": "string",
                "description": "User's password (will be hashed)",
                "required": true
              }
            }
          },
          "responses": {
            "201": {
              "description": "User created successfully",
              "content": {
                "message": {
                  "type": "string",
                  "example": "User created successfully"
                }
              }
            },
            "400": {
              "description": "Validation error",
              "content": {
                "message": {
                  "type": "string",
                  "example": "Email already in use"
                }
              }
            },
            "500": {
              "description": "Server error",
              "content": {
                "message": {
                  "type": "string",
                  "example": "Internal server error"
                }
              }
            }
          }
        },
        {
          "path": "/signin",
          "method": "POST",
          "description": "Authenticates a user and returns user details with JWT token in cookies",
          "requestBody": {
            "type": "application/json",
            "required": true,
            "content": {
              "email": {
                "type": "string",
                "description": "User's email address",
                "required": true
              },
              "password": {
                "type": "string",
                "description": "User's password",
                "required": true
              }
            }
          },
          "responses": {
            "200": {
              "description": "Authentication successful",
              "cookies": {
                "access_token": {
                  "type": "string",
                  "description": "JWT token (httpOnly)",
                  "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                }
              },
              "content": {
                "user": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "string",
                      "description": "User document ID",
                      "example": "a1b2c3d4e5f6"
                    },
                    "username": {
                      "type": "string",
                      "example": "johndoe"
                    },
                    "email": {
                      "type": "string",
                      "example": "johndoe@example.com"
                    },
                    "avatar": {
                      "type": "string",
                      "example": ""
                    },
                    "createdAt": {
                      "type": "string",
                      "format": "date-time",
                      "example": "2025-03-01T00:00:00.000Z"
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Authentication failed",
              "content": {
                "message": {
                  "type": "string",
                  "example": "Invalid password"
                }
              }
            },
            "404": {
              "description": "User not found",
              "content": {
                "message": {
                  "type": "string",
                  "example": "User not found"
                }
              }
            },
            "500": {
              "description": "Server error",
              "content": {
                "message": {
                  "type": "string",
                  "example": "Internal server error"
                }
              }
            }
          }
        },
        {
          "path": "/google",
          "method": "POST",
          "description": "Signs in or registers a user using Google authentication",
          "requestBody": {
            "type": "application/json",
            "required": true,
            "content": {
              "email": {
                "type": "string",
                "description": "User's email from Google authentication",
                "required": true,
                "example": "johndoe@gmail.com"
              },
              "displayName": {
                "type": "string",
                "description": "User's display name from Google authentication",
                "required": true,
                "example": "John Doe"
              },
              "photoURL": {
                "type": "string",
                "description": "User's profile photo URL from Google authentication",
                "example": "https://example.com/photo.jpg"
              },
              "uid": {
                "type": "string",
                "description": "Firebase Auth UID",
                "required": true,
                "example": "a1b2c3d4e5f6"
              }
            }
          },
          "responses": {
            "200": {
              "description": "Authentication successful",
              "cookies": {
                "access_token": {
                  "type": "string",
                  "description": "JWT token (httpOnly)",
                  "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                }
              },
              "content": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string",
                    "description": "User document ID",
                    "example": "a1b2c3d4e5f6"
                  },
                  "username": {
                    "type": "string",
                    "example": "johndoe1234"
                  },
                  "email": {
                    "type": "string",
                    "example": "johndoe@gmail.com"
                  },
                  "avatar": {
                    "type": "string",
                    "example": "https://example.com/photo.jpg"
                  },
                  "createdAt": {
                    "type": "string",
                    "format": "date-time",
                    "example": "2025-03-01T00:00:00.000Z"
                  }
                }
              }
            },
            "400": {
              "description": "Missing or invalid request body",
              "content": {
                "message": {
                  "type": "string",
                  "example": "Email, displayName, and UID are required"
                }
              }
            },
            "500": {
              "description": "Server error",
              "content": {
                "message": {
                  "type": "string",
                  "example": "Internal server error"
                }
              }
            }
          }
        },                
        {
          "path": "/signout",
          "method": "GET",
          "description": "Logs out a user by clearing the authentication cookie",
          "responses": {
            "200": {
              "description": "User logged out successfully",
              "content": {
                "type": "string",
                "example": "User has been logged out"
              },
              "cookies": {
                "access_token": {
                  "action": "clear",
                  "description": "Removes the authentication cookie"
                }
              }
            },
            "500": {
              "description": "Server error",
              "content": {
                "message": {
                  "type": "string",
                  "example": "Internal server error"
                }
              }
            }
          }
        }
      ],
      "security": {
        "type": "cookie",
        "name": "access_token",
        "description": "JWT token stored in HTTP-only cookie set during signin or Google authentication"
      },
      "errorHandling": {
        "middleware": "errorMiddleware",
        "errorFormat": {
          "message": {
            "type": "string",
            "description": "Human-readable error message"
          },
          "statusCode": {
            "type": "number",
            "description": "HTTP status code"
          }
        }
      },
      "cors": {
        "enabled": true,
        "origin": "*",
        "credentials": true,
        "notes": "In production, origin should be set to specific client URL instead of wildcard"
      }
    }
  };
  

export default apiDocumentation;
