import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main";
 
export default defineConfig({
  branch,
  clientId: "add0a4bc-85f4-4a29-979a-30759d55d92c", // Get this from tina.io
  token: "1e443c97da9635351e0683e097f3f4b0134bd838", // Get this from tina.io
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
          },
          {
            type: "string",
            name: "comments",
            label: "comments",
            required: true,
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
