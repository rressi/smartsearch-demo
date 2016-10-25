

export class Result {

    public uuid: number;
    public actors: string[];
    public director: string;
    public distributor: string;
    public funFacts: string;
    public location: string;
    public productionCompany: string;
    public releaseYear: number;
    public title: string;
    public writer: string;

    public constructor(data: any) {

        this.uuid = data["uuid"];

        this.actors = [];
        for (let i = 1; i <= 3; i++) {
            let actor: string = data["Actor " + i.toString()]
            if (actor != null && actor.length > 0) {
                this.actors.push(actor);
            }
        }

        this.director = data["Director"];
        this.distributor = data["Distributor"];
        this.funFacts = data["Fun Facts"];
        this.location = data["Locations"];
        this.productionCompany = data["Production Company"];
        this.releaseYear = data["Release Year"];
        this.title = data["Title"];
        this.writer = data["Writer"];

    }

}
