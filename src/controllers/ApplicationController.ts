import { Request, Response } from "express";

class ApplicationController {

    public static getCreateNewApplication(request: Request, response: Response) {
        return response.render("register");
    }
}

export default ApplicationController;