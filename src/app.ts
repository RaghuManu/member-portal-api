import express from "express";
import * as bodyParser from "body-parser";
import mongoose from "mongoose";
import memberRouter from "./routers/user_route";
import subjectRouter from "./routers/subjects_route";
import scholorshipRouter from "./routers/scholorship_route";
import projectRouter from "./routers/projects_route";
import marksDetailsRouter from "./routers/marks_details_route";
import academicConfigRouter from "./routers/academic_config_route";
import { FacultyRoutes } from "./routers/faculty_subject_route";
import extraActivitiesRouter from "./routers/extra_activities_route";
import mongooseConnection from "./config/mongo.config";
import initialize from "./shared/superuser";
import {dbValueInitializer} from "./shared/db_values";
const boom = require("express-boom");
const cors = require("cors");

let client: any;
class App {
  public app: express.Application;
  constructor() {
    this.app = express();
    this.config();
    //actual routes
    this.app.use("/api/member", memberRouter);
    this.app.use("/api/subject", subjectRouter);
    this.app.use("/api/marksdetails", marksDetailsRouter);
    this.app.use("/api/academicConfig", academicConfigRouter);
    this.app.use("/api/extraActivities", extraActivitiesRouter);
    this.app.use("/api/scholorship", scholorshipRouter);
    this.app.use("/api/project", projectRouter);
    //mongodb set up
    mongooseConnection;
    initialize();
    dbValueInitializer.branchInitialize();
    dbValueInitializer.designationInitialize();
    dbValueInitializer.semInitialize();
  }
  private config(): void {
    this.app.use(cors());
    //support application/json type post data
    this.app.use(bodyParser.json());

    // support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.app.use(boom());
  }
}

export default new App().app;

export const mongooseclient = client;
