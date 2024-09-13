// import { shikiToMonaco } from "@shikijs/monaco";
import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import jsonParser from "prettier/plugins/babel";
import esTree from "prettier/plugins/estree";
import prettier from "prettier/standalone";
import { debounce } from "radash";
import { useEffect, useRef, useState } from "react";
// import { createHighlighter } from "shiki";

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "json") {
      return new jsonWorker();
    }
    return new editorWorker();
  },
};
// const highlighter = await createHighlighter({
//   themes: ["catppuccin-macchiato"],
//   langs: ["json"],
// });
const formatJsonWithPrettier = async (json: string) => {
  try {
    // const formatted = JSON.stringify(JSON.parse(json), null, 2);
    const formatted = await prettier.format(json, {
      parser: "json",
      plugins: [esTree, jsonParser],
      embeddedLanguageFormatting: "auto",
    });
    return formatted.trim(); // Remove trailing newline
  } catch (error) {
    console.error("Prettier formatting failed:", error);
    return json; // Return original JSON if formatting fails
  }
};
monaco.languages.register({ id: "json" });
monaco.languages.registerDocumentFormattingEditProvider("json", {
  async provideDocumentFormattingEdits(model) {
    const text = model.getValue();
    const formatted = await formatJsonWithPrettier(text);
    return [
      {
        range: model.getFullModelRange(),
        text: formatted,
      },
    ];
  },
});
monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
  validate: true,
  allowComments: false,
  schemas: [],
  enableSchemaRequest: false,
});

// shikiToMonaco(highlighter, monaco);

export const Editor = ({
  defaultValue,
  onChange,
}: {
  defaultValue: string;
  onChange?: (value: string) => void;
}) => {
  const editorRef = useRef(null);
  const [editorInstance, setEditorInstance] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      const editor = monaco.editor.create(editorRef.current, {
        value: defaultValue,
        language: "json",
        theme: "vs-dark",
        automaticLayout: true,
        minimap: { enabled: false },
        formatOnType: true,
        formatOnPaste: true,
        autoClosingBrackets: "always",
        autoClosingQuotes: "always",
        autoClosingDelete: "always",
        autoClosingComments: "always",
        bracketPairColorization: {
          enabled: true,
          independentColorPoolPerBracketType: true,
        },
        guides: {
          bracketPairs: true,
        },
        insertSpaces: true,
        inlayHints: { enabled: "off" },
        parameterHints: { enabled: false },
        disableLayerHinting: true,
        renderWhitespace: "all",
        tabSize: 2,
        fontSize: 15,
        fontFamily: "Fira Mono",
      });

      setEditorInstance(editor);
      // Override the default JSON formatter with Prettier

      // Add event listener for content changes
      const disposable = editor.onDidChangeModelContent(() => {
        validateJson(editor.getValue());
      });

      return () => {
        disposable.dispose();
        editor.dispose();
      };
    }
  }, []);

  const formatJson = async (editor?: monaco.editor.IStandaloneCodeEditor) => {
    const getEditor = editor ?? editorInstance;
    if (getEditor) {
      const unformattedJson = getEditor.getValue();

      try {
        const formatted = await formatJsonWithPrettier(unformattedJson);

        console.log("formatted", formatted);

        // Get current cursor position
        const position = getEditor.getPosition();

        getEditor.setValue(formatted);

        // Restore cursor position
        getEditor.setPosition(position!);

        setJsonError(null);
      } catch {
        // If JSON is invalid, don't format but also don't show error
        // Error will be shown when user explicitly validates
      }
    }
  };

  const validateJson = debounce({ delay: 500 }, async (value?: string) => {
    {
      console.log("Validating JSON");

      if (editorInstance) {
        const content = value ?? editorInstance.getValue();
        console.log("content", content);

        try {
          JSON.parse(content);
          setJsonError(null);
          onChange?.(content);
        } catch (error) {
          setJsonError((error as Error)?.message ?? null);
        }
      }
    }
  });

  return (
    <>
      <div
        ref={editorRef}
        style={{ minHeight: "500px", height: "auto", border: "1px solid #ccc" }}
      />
      <div className="flex gap-3">
        <button
          onClick={() => validateJson()}
          className="mt-4 bg-blue-500 rounded text-white p-2"
        >
          Validate JSON
        </button>
        <button
          onClick={() => formatJson()}
          className="mt-4 bg-blue-500 rounded text-white p-2"
        >
          Format JSON
        </button>
      </div>
      {jsonError && (
        <div className="flex items-center mt-4 p-2 bg-red-100 text-red-700 rounded">
          <span>{jsonError}</span>
        </div>
      )}
    </>
  );
};
