import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main";
 
export default defineConfig({
  branch,
  clientId: process.env.TINA_CLIENTID, // Get this from tina.io
  token: process.env.TINA_TOKEN, // Get this from tina.io
  build: {
    outputFolder: "admin",
    publicFolder: "static",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "static",
    },
  },
  schema: {
    collections: [
      {
        label: "Pages",
        name: "pages",
        path: "content",
        fields: [
          {
            type: "rich-text",
            name: "body",
            label: "Body of Document",
            description: "This is the markdown body",
            isBody: true,
          },
        ],
      },
      {
        label: "Post",
        name: "post",
        path: "content/post",
        fields: [
          {
            type: "rich-text",
            name: "body",
            label: "Body of Document",
            description: "This is the markdown body",
            isBody: true,
          },
          {
            type: "string",
            name: "title",
            label: "Title",
            required: true,
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
            required: true,
          },
          {
            type: "image",
            name: "image",
            label: "image",
            required: true,

          },
          {
            type: "string",
            name: "comments",
            label: "comments",
            required: true,
          },
          {
            type: "boolean",
            name: "draft",
            label: "draft",
          },
          {
            type: "string",
            name: "tags",
            label: "tags",
            list: true,
            ui: {
              component: "tags",
            },
          },
        ],
      },
    ],
  },
});
