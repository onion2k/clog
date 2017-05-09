# Clog

Clog is a basic utility to manage a changelog.

There are a few different ways to use it. You can update the log directly, you can remove log messages, and you can pull commit messages in from a git repo. Plus you can write them out to a markdown CHANGELOG file.

## Installation

Clone the repo and run `npm install`. One day this might be npm-able.

## Usage

Use `clog` to view the help.

## Quickstart

The main commands to use are `clog -c` to view the current log, and `clog -m` to add a new entry. When you want to move your entries out to a CHANGELOG.md file you can use `clog -e`.