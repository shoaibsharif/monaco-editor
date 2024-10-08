export const sampleJson = {
  type: "team",
  test: {
    testPage: "tools/testing/run-tests.htm",
    enabled: true,
  },
  search: {
    excludeFolders: [
      ".git",
      "node_modules",
      "tools/bin",
      "tools/counts",
      "tools/policheck",
      "tools/tfs_build_extensions",
      "tools/testing/jscoverage",
      "tools/testing/qunit",
      "tools/testing/chutzpah",
      "server.net",
    ],
  },
  languages: {
    "vs.languages.typescript": {
      validationSettings: [
        {
          scope: "/",
          noImplicitAny: true,
          noLib: false,
          extraLibs: [],
          semanticValidation: true,
          syntaxValidation: true,
          codeGenTarget: "ES5",
          moduleGenTarget: "",
          lint: {
            emptyBlocksWithoutComment: "warning",
            curlyBracketsMustNotBeOmitted: "warning",
            comparisonOperatorsNotStrict: "warning",
            missingSemicolon: "warning",
            unknownTypeOfResults: "warning",
            semicolonsInsteadOfBlocks: "warning",
            functionsInsideLoops: "warning",
            functionsWithoutReturnType: "warning",
            tripleSlashReferenceAlike: "warning",
            unusedImports: "warning",
            unusedVariables: "warning",
            unusedFunctions: "warning",
            unusedMembers: "warning",
          },
        },
        {
          scope: "/client",
          baseUrl: "/client",
          moduleGenTarget: "amd",
        },
        {
          scope: "/server",
          moduleGenTarget: "commonjs",
        },
        {
          scope: "/build",
          moduleGenTarget: "commonjs",
        },
        {
          scope: "/node_modules/nake",
          moduleGenTarget: "commonjs",
        },
      ],
      allowMultipleWorkers: true,
    },
  },
};
