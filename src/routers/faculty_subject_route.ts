import { Request, Response } from 'express';


export class FacultyRoutes {

    public routes(app: any): void {
        app.route('/faculty')
            .get((req: Request, res: Response) => {
                res.status(200).send({
                    message: 'GET request successfulll for faculty routes!!!!'
                })
            })
    }
}