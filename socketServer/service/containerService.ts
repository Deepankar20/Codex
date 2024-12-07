import Docker from "dockerode";
import { dockerImages } from "../utils/dockerImages";

export class ContainerManager {
  private docker: Docker;
  private containerMap: Map<any, any>;

  constructor() {
    this.docker = new Docker();
    this.containerMap = new Map();
  }

  async createContainer(replId: string, image: string) {
    try {
      const container = await this.docker.createContainer({
        Image: `${dockerImages.get(image)?.official}`,
        Cmd: ["/bin/bash"],
        Tty: true,
        OpenStdin: true,
        HostConfig: {
          AutoRemove: true,
        },
      });

      await container.start();

      this.containerMap.set(replId, container.id);
      console.log(
        `Container created for replId: ${replId}, containerId: ${container.id}`
      );
      return container.id;
    } catch (error) {
      console.log("An error occured in creating container : ", error);
    }
  }

  async executeCommand(replId: string, command: string) {
    try {
      const containerId = this.containerMap.get(replId);

      const container = this.docker.getContainer(containerId);

      const exec = await container.exec({
        Cmd: command.split(""),
        AttachStderr: true,
        AttachStdout: true,
      });

      const stream = await exec.start({
        Tty: true,
        stdin: true,
      });

      return new Promise((resolve, reject) => {
        let output = "";
        let error = "";
        stream.on("data", (chunk) => {
          output += chunk.toString();
        });
        stream.on("error", (chunk) => {
          error += chunk.toString();
          reject(new Error(error));
        });

        stream.on("end", () => {
          resolve({
            stdout: output.trim(),
            stderr: error.trim(),
          });
        });
      });
    } catch (error) {
      console.log("Error Executing command : ", error);
    }
  }

  async stopContainer(replId: string) {
    try {
      const containerId = this.containerMap.get(replId);
      if (!containerId) {
        throw new Error(`No container found for replId: ${replId}`);
      }

      const container = this.docker.getContainer(containerId);
      await container.stop();
      this.containerMap.delete(replId);
      console.log(`Container stopped for replId: ${replId}`);
    } catch (error) {
      console.error("Error stopping container:", error);
      throw error;
    }
  }
}
