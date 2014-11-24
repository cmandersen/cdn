# CDN GENERATOR

Generate your own combined files for your CDN, and keep them up to date semi-automatically.

## Installing

A package.json file exists for NPM, so you can just run `npm install`.

## Running the script

I've put the script into the default function of gulp, so running the script consists of running the `gulp` command.

## What happens?

- The script clones the latest from the repositories provided
- Copies those files in the base directory for future reference (primarily use by the .map-files)
- Combines the combinable files into their respective .min-files, resulting in a example.min.js and example.min.css file.