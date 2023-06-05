import Handler from "./handler";
import Downloader from "./downloader";
import CsvHandler from "./handlers/csv";

import { GenericAction, ActionType } from "@byod/types";

import path from "node:path";

export default async function xtract(url: string, actions: Array<GenericAction>): Promise<void> {
  const downloader = new Downloader();

  const filepath = await downloader.download(url);

  const handler = new Handler(path.resolve(filepath, "../"));
  let handle = await handler.handle(filepath);

  if (handle instanceof CsvHandler) {
      handle = handle as CsvHandler;

      for (const action of actions) {
          switch (action.type) {
                  case ActionType.DELETE:
                    handle.deleteCol(action.argument)
                    break;
                  default:
                    throw action.type + " not implemented yet"
          }
      } 
  }
  downloader.clean();
}

