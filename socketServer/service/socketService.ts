import { Server, Socket } from "socket.io";
import { EVENT } from "../types/types";
import { ContainerManager } from "./containerService";

export default class SocketService {
  private _io: Server;
  private containerManager: ContainerManager;

  constructor() {
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });

    this.containerManager = new ContainerManager();
  }

  public initListeners() {
    const io = this._io;

    io.on("connect", (socket) => {
      socket.on(
        EVENT.repl_open,
        async (data: { id: string; image: string }) => {
          try {
            await this.containerManager.createContainer(data.id, data.image);
          } catch (error) {
            console.log("An error occured in socket in container creation");
          }
        }
      );

      socket.on(
        EVENT.commandExec,
        async (data: { id: string; command: string }) => {
          try {
            const output = await this.containerManager.executeCommand(
              data.id,
              data.command
            );

            socket.emit(EVENT.commandExecResponse, { id: data.id, output });
          } catch (error) {
            console.log("An error occured in command exec socket");
          }
        }
      );

      socket.on(EVENT.repl_close, async (data: { id: string }) => {
        try {
          await this.containerManager.stopContainer(data.id);
        } catch (error) {
          console.log("An Error occured in socket stopping container");
        }
      });
    });
  }

  get io() {
    return this._io;
  }
}
