export const dockerImages = new Map([
  [
    "Python",
    {
      official: "python:latest",
      versions: ["python:3.8", "python:3.9", "python:3.10", "python:3.11"],
      variants: ["python:slim", "python:alpine"],
    },
  ],
  [
    "Node.js",
    {
      official: "node:latest",
      versions: ["node:16", "node:18", "node:20"],
      variants: ["node:slim", "node:alpine", "node:lts"],
    },
  ],
  [
    "Java",
    {
      official: "openjdk:latest",
      versions: ["openjdk:11", "openjdk:17", "openjdk:21"],
      variants: ["openjdk:slim", "amazoncorretto", "adoptopenjdk"],
    },
  ],
  [
    "Go",
    {
      official: "golang:latest",
      versions: ["golang:1.16", "golang:1.17", "golang:1.18"],
      variants: ["golang:alpine", "golang:slim"],
    },
  ],
]);
