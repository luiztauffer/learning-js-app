# Electron/Flask application
Repository containing a basic Electron/Flask application.

# Description
The backend is served by a Flask API giving access to python data analyses and figures generation.

The Flask API exposes a collection of resources, organized in three categories:
1. data
2. plots
3. analyses

The frontend is an Electron API, that is responsible for the UI and to make the requests to the Flask API though http protocol.
