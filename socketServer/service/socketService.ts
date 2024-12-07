import { Server, Socket } from "socket.io";

export default class SocketService {
  private _io: Server;

  constructor() {
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
  }

  public initListeners() {
    const io = this._io;

    //io.on(EVENT, ()=>{})
  }

  get io() {
    return this._io;
  }
}
