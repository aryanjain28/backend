const { readFileSync } = require("fs");
const { Client } = require("ssh2");

class SFTP {
  constructor() {
    this.client = new Client();
    this.sftp = null;

    this.client.on("connect", () => {
      console.log("SSH Connection Connected.: ");
    });

    this.client.on("close", () => {
      console.log("SSH Connection Closed.");
    });

    this.client.on("end", () => {
      console.log("SSH Connection Ended.");
    });

    this.client.on("error", (err) => {
      console.log("SSH Connection Error.", err);
    });

    this.client
      .on("ready", () => {
        this.client.sftp((err, sftp) => {
          if (err) {
            console.log("SFTP :: Errror in connection", err);
          } else {
            console.log("SFTP Connection established.");
            this.sftp = sftp;
          }
        });
      })
      .connect({
        host: process.env.SFTP_SERVER_HOST,
        port: process.env.SFTP_SERVER_PORT,
        username: process.env.SFTP_SERVER_USERNAME,
        password: process.env.SFTP_SERVER_PASSWORD,
        privateKey: readFileSync(process.env.SFTP_SERVER_PRIVATE_KEY_PATH),
      });
  }

  getCwd(path = "/") {
    return new Promise((resolve, reject) => {
      this.sftp.realpath(path, (err, absPath) => {
        if (err) {
          console.log("Error occured while getting cwd. Err :: ", err);
          reject(err);
        } else {
          resolve(absPath);
        }
      });
    });
  }

  getDirList(path = "/") {
    return new Promise((resolve, reject) => {
      this.sftp.readdir(path, (err, list) => {
        if (err) {
          console.log("Error occured while getting dirlist. Err :: ", err);
          reject(err);
        } else {
          resolve(list);
        }
      });
    });
  }
}

const sftp = new SFTP();
module.exports = sftp;
