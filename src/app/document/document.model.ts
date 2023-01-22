export class Document {
    public id: string;
    public name: string;
    public description: string;
    public Url: string;
    public children: string;

    constructor(id: string, name: string, description: string, Url: string, children: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.Url = Url;
        this.children = children;
    }
}