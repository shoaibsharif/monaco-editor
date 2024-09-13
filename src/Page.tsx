import { useState } from "react";
import { Editor } from "./Editor";
import { sampleJson } from "./sample";

export const Page = () => {
  const [json] = useState<string>(JSON.stringify(sampleJson, null, 2));
  return (
    <div className="container mx-auto flex flex-col justify-center h-svh p-7">
      <Editor defaultValue={json} />
    </div>
  );
};
