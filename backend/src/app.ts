import express from "express";
import { k8sApi } from "./kubernetes/client";
import { createDeployment } from "./kubernetes/deployment";
import { listDeployments } from "./kubernetes/listDeployments";
import { deleteDeployment } from "./kubernetes/deleteDeployment";
import { getAppStatus } from "./kubernetes/getStatus";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("K8s Platform API Running");
});

app.get("/pods", async (req, res) => {
  try {
    const pods = await k8sApi.listNamespacedPod({
      namespace: "default",
    });

    res.json(
      pods.items.map((pod) => ({
        name: pod.metadata?.name,
        status: pod.status?.phase,
      }))
    );
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch pods",
    });
  }
});

app.get("/apps", async (req, res) => {
  try {
    const deployments = await listDeployments();

    res.json(deployments);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to list deployments",
    });
  }
});

app.delete("/apps/:name", async (req, res) => {
  try {
    const { name } = req.params;

    await deleteDeployment(name);

    res.json({
      message: "Deployment deleted",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete deployment",
    });
  }
});

app.get("/apps/:name/status", async (req, res) => {
  try {
    const result = await getAppStatus(req.params.name);
    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to get status",
    });
  }
});

app.post("/apps", async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const { name, image } = req.body;

    await createDeployment(name, image);

    res.status(201).json({
      message: "Deployment created",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create deployment",
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});