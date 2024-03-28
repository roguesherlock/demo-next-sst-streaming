/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "next-sst-streaming",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const OpenAiApiKey = new sst.Secret("OpenAiApiKey");

    new sst.aws.Nextjs("MyWeb", {
      environment: {
        OPENAI_API_KEY: OpenAiApiKey.value,
      },
      openNextVersion: "v3.0.0-rc.12",
    });
  },
});
