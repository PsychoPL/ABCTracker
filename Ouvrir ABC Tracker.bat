@echo off
rem Ouvre ABC Tracker dans une fenetre d application (sans barre d adresse) avec Microsoft Edge.
set "F=%~dp0index.html"
set "F=%F:\=/%"
start "" msedge --app="file:///%F%" --window-size=1280,860
