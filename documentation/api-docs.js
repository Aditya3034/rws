// api-docs.js
const apiDocumentation = {
  "api": {
    "name": "Educational Content API",
    "version": "1.0.0",
    "baseUrl": "/api",
    "description": "API for educational content management system with authentication, user management, and PDF document management",
    "sections": [
      {
        "name": "Authentication",
        "description": "Authentication service with user registration, login, Google authentication, email verification, and logout functionality",
        "baseUrl": "/auth",
        "endpoints": [
          {
            "path": "/signup",
            "method": "POST",
            "description": "Creates a new user account in the system with email verification",
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
            "path": "/verify-email/:verificationCode",
            "method": "GET",
            "description": "Verifies user's email using the verification code sent during signup",
            "parameters": {
              "path": {
                "verificationCode": {
                  "type": "string",
                  "description": "Email verification code",
                  "required": true
                }
              }
            },
            "responses": {
              "200": {
                "description": "Email verification successful, redirects to login page",
                "redirect": true
              },
              "400": {
                "description": "Invalid verification code",
                "content": {
                  "message": {
                    "type": "string",
                    "example": "Invalid or expired token"
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
        ]
      },
      {
        "name": "User",
        "description": "User profile management and content access endpoints",
        "baseUrl": "/users",
        "endpoints": [
          {
            "path": "/:userId",
            "method": "PUT",
            "description": "Updates a user's profile information",
            "parameters": {
              "path": {
                "userId": {
                  "type": "string",
                  "description": "User document ID",
                  "required": true
                }
              }
            },
            "requestBody": {
              "type": "application/json",
              "required": true,
              "content": {
                "username": {
                  "type": "string",
                  "description": "User's username"
                },
                "avatar": {
                  "type": "string",
                  "description": "URL to user's avatar image"
                }
                // Note: Email updates are not allowed as per code
              }
            },
            "responses": {
              "200": {
                "description": "User updated successfully",
                "content": {
                  "success": {
                    "type": "boolean",
                    "example": true
                  },
                  "message": {
                    "type": "string",
                    "example": "User updated successfully"
                  },
                  "user": {
                    "type": "object",
                    "properties": {
                      "id": {
                        "type": "string",
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
                        "example": "https://example.com/avatar.jpg"
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
            "path": "/pdfs/:standard",
            "method": "GET",
            "description": "Retrieves PDFs by educational standard with pagination and search functionality",
            "parameters": {
              "path": {
                "standard": {
                  "type": "string",
                  "description": "Educational standard (e.g., 'Grade-10')",
                  "required": true
                }
              },
              "query": {
                "query": {
                  "type": "string",
                  "description": "Search term for filtering PDFs",
                  "required": false
                },
                "pageSize": {
                  "type": "number",
                  "description": "Number of results per page",
                  "default": 10,
                  "required": false
                },
                "lastDoc": {
                  "type": "string",
                  "description": "ID of the last document from previous page for pagination",
                  "required": false
                }
              }
            },
            "responses": {
              "200": {
                "description": "List of PDFs matching the criteria",
                "content": {
                  "success": {
                    "type": "boolean",
                    "example": true
                  },
                  "data": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "id": {
                          "type": "string",
                          "example": "pdf123"
                        },
                        "title": {
                          "type": "string",
                          "example": "Algebra Fundamentals"
                        },
                        "subject": {
                          "type": "string",
                          "example": "Mathematics"
                        },
                        "standard": {
                          "type": "string",
                          "example": "Grade-10"
                        },
                        "topic": {
                          "type": "string",
                          "example": "Algebra"
                        },
                        "subtopic": {
                          "type": "string",
                          "example": "Linear Equations"
                        },
                        "description": {
                          "type": "string",
                          "example": "Basic concepts of linear equations"
                        },
                        "fileUrl": {
                          "type": "string",
                          "example": "https://firebasestorage.googleapis.com/..."
                        },
                        "uploadedAt": {
                          "type": "string",
                          "format": "date-time",
                          "example": "2025-03-01T00:00:00.000Z"
                        }
                      }
                    }
                  },
                  "lastDoc": {
                    "type": "string",
                    "description": "ID of the last document in the current result set",
                    "example": "pdf456"
                  },
                  "hasMore": {
                    "type": "boolean",
                    "description": "Indicates if more results are available",
                    "example": true
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
            "path": "/contact",
            "method": "POST",
            "description": "Submits a contact form",
            "requestBody": {
              "type": "application/json",
              "required": true,
              "content": {
                "name": {
                  "type": "string",
                  "description": "Contact person's name",
                  "required": true
                },
                "email": {
                  "type": "string",
                  "description": "Contact person's email",
                  "required": true
                },
                "phoneNumber": {
                  "type": "string",
                  "description": "Contact person's phone number",
                  "required": true
                },
                "description": {
                  "type": "string",
                  "description": "Message content",
                  "required": true
                }
              }
            },
            "responses": {
              "201": {
                "description": "Contact form submitted successfully",
                "content": {
                  "success": {
                    "type": "boolean",
                    "example": true
                  },
                  "message": {
                    "type": "string",
                    "example": "Contact form submitted successfully"
                  },
                  "contactId": {
                    "type": "string",
                    "example": "contact123"
                  }
                }
              },
              "400": {
                "description": "Validation error",
                "content": {
                  "message": {
                    "type": "string",
                    "example": "All fields are required"
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
            "path": "/:userId/notifications",
            "method": "GET",
            "description": "Retrieves notifications for a specific user",
            "parameters": {
              "path": {
                "userId": {
                  "type": "string",
                  "description": "User document ID",
                  "required": true
                }
              }
            },
            "responses": {
              "200": {
                "description": "List of user notifications",
                "content": {
                  "success": {
                    "type": "boolean",
                    "example": true
                  },
                  "notifications": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "id": {
                          "type": "string",
                          "example": "notif123"
                        },
                        "type": {
                          "type": "string",
                          "example": "NEW_PDF"
                        },
                        "title": {
                          "type": "string",
                          "example": "New Grade-10 worksheet uploaded"
                        },
                        "message": {
                          "type": "string",
                          "example": "Algebra Fundamentals has been uploaded. Check it out!"
                        },
                        "read": {
                          "type": "boolean",
                          "example": false
                        },
                        "createdAt": {
                          "type": "string",
                          "format": "date-time",
                          "example": "2025-03-01T00:00:00.000Z"
                        }
                      }
                    }
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
        ]
      },
      {
        "name": "Admin",
        "description": "Administrative endpoints for content management",
        "baseUrl": "/admin",
        "endpoints": [
          {
            "path": "/upload-pdf",
            "method": "POST",
            "description": "Uploads a new PDF document with metadata",
            "requestBody": {
              "type": "multipart/form-data",
              "required": true,
              "content": {
                "file": {
                  "type": "file",
                  "description": "PDF file to upload",
                  "required": true
                },
                "title": {
                  "type": "string",
                  "description": "Title of the PDF",
                  "required": true
                },
                "subject": {
                  "type": "string",
                  "description": "Subject category",
                  "required": true
                },
                "standard": {
                  "type": "string",
                  "description": "Educational standard (e.g., 'Grade-10')",
                  "required": true
                },
                "topic": {
                  "type": "string",
                  "description": "Topic within the subject"
                },
                "subtopic": {
                  "type": "string",
                  "description": "Subtopic within the topic"
                },
                "description": {
                  "type": "string",
                  "description": "Description of the PDF content"
                },
                "tags": {
                  "type": "string",
                  "description": "JSON string of tags array",
                  "example": "[\"algebra\", \"equations\"]"
                }
              }
            },
            "responses": {
              "201": {
                "description": "PDF uploaded successfully",
                "content": {
                  "success": {
                    "type": "boolean",
                    "example": true
                  },
                  "message": {
                    "type": "string",
                    "example": "PDF uploaded successfully"
                  },
                  "pdf": {
                    "type": "object",
                    "properties": {
                      "id": {
                        "type": "string",
                        "example": "pdf123"
                      },
                      "title": {
                        "type": "string",
                        "example": "Algebra Fundamentals"
                      },
                      "subject": {
                        "type": "string",
                        "example": "Mathematics"
                      },
                      "fileUrl": {
                        "type": "string",
                        "example": "https://firebasestorage.googleapis.com/..."
                      },
                      "uploadedAt": {
                        "type": "string",
                        "format": "date-time",
                        "example": "2025-03-01T00:00:00.000Z"
                      }
                    }
                  }
                }
              },
              "400": {
                "description": "Validation error",
                "content": {
                  "message": {
                    "type": "string",
                    "example": "Title, subject, and standard are required"
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
            "path": "/edit-pdf/:pdfId",
            "method": "PUT",
            "description": "Updates an existing PDF document and its metadata",
            "parameters": {
              "path": {
                "pdfId": {
                  "type": "string",
                  "description": "ID of the PDF document to update",
                  "required": true
                }
              }
            },
            "requestBody": {
              "type": "multipart/form-data",
              "required": true,
              "content": {
                "file": {
                  "type": "file",
                  "description": "New PDF file (optional)"
                },
                "title": {
                  "type": "string",
                  "description": "Title of the PDF"
                },
                "subject": {
                  "type": "string",
                  "description": "Subject category"
                },
                "standard": {
                  "type": "string",
                  "description": "Educational standard (e.g., 'Grade-10')"
                },
                "topic": {
                  "type": "string",
                  "description": "Topic within the subject"
                },
                "subtopic": {
                  "type": "string",
                  "description": "Subtopic within the topic"
                },
                "description": {
                  "type": "string",
                  "description": "Description of the PDF content"
                },
                "tags": {
                  "type": "string",
                  "description": "JSON string of tags array",
                  "example": "[\"algebra\", \"equations\"]"
                }
              }
            },
            "responses": {
              "200": {
                "description": "PDF updated successfully",
                "content": {
                  "success": {
                    "type": "boolean",
                    "example": true
                  },
                  "message": {
                    "type": "string",
                    "example": "PDF updated successfully"
                  },
                  "pdf": {
                    "type": "object",
                    "properties": {
                      "id": {
                        "type": "string",
                        "example": "pdf123"
                      },
                      "title": {
                        "type": "string",
                        "example": "Algebra Fundamentals"
                      },
                      "subject": {
                        "type": "string",
                        "example": "Mathematics"
                      },
                      "fileUrl": {
                        "type": "string",
                        "example": "https://firebasestorage.googleapis.com/..."
                      },
                      "updatedAt": {
                        "type": "string",
                        "format": "date-time",
                        "example": "2025-03-01T00:00:00.000Z"
                      }
                    }
                  }
                }
              },
              "404": {
                "description": "PDF not found",
                "content": {
                  "message": {
                    "type": "string",
                    "example": "PDF not found"
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
            "path": "/delete-pdf/:pdfId",
            "method": "DELETE",
            "description": "Deletes a PDF document and its associated file",
            "parameters": {
              "path": {
                "pdfId": {
                  "type": "string",
                  "description": "ID of the PDF document to delete",
                  "required": true
                }
              }
            },
            "responses": {
              "200": {
                "description": "PDF deleted successfully",
                "content": {
                  "success": {
                    "type": "boolean",
                    "example": true
                  },
                  "message": {
                    "type": "string",
                    "example": "PDF deleted successfully"
                  }
                }
              },
              "404": {
                "description": "PDF not found",
                "content": {
                  "message": {
                    "type": "string",
                    "example": "PDF not found"
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
        ]
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
      "origin": "*", // In production, origin should be set to specific client URL
      "credentials": true,
      "notes": "In production, origin should be set to specific client URL instead of wildcard"
    }
  }
};

export default apiDocumentation;