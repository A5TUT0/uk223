export class Post {
  public id?: number;
  public userId: number;
  public content: string;
  public creationDate?: Date;

  constructor(
    userId: number,
    content: string,
    creationDate?: Date,
    id?: number
  ) {
    this.userId = userId;
    this.content = content;
    this.creationDate = creationDate;
    this.id = id;
  }
}
