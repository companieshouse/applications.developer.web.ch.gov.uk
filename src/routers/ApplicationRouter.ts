import ApplicationController from "../controllers/ApplicationController";
import express from "express";

class ApplicationRouter {

    public static create() {

        // eslint-disable-next-line new-cap
        const router = express.Router();

        router.get("/", ApplicationController.getCreateNewApplication);

        return router;
    }
}

export default ApplicationRouter;
