import { Request, Response } from "express";

class ApplicationController {

    public static getCreateNewApplication(request: Request, response: Response) {
        return response.send("Hi");
    }
}

export default ApplicationController;
