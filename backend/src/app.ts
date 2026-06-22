import express from "express";
import { k8sApi } from "./kubernetes/client";
import { createDeployment } from "./kubernetes/deployment";
import { createService } from "./kubernetes/service";
import { listDeployments } from "./kubernetes/listDeployments";
import { deleteDeployment } from "./kubernetes/deleteDeployment";
import { getAppStatus } from "./kubernetes/getStatus";
import { deleteService } from "./kubernetes/deleteService";
import { getService } from "./kubernetes/getService";

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

app.get("/apps/:name/service", async (req, res) => {
  try {
    const service = await getService(req.params.name);
    res.json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to get service",
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
    await deleteService(name);

    res.json({
      message: "Application deleted",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete application",
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
    const { name, image } = req.body;

    await createDeployment(name, image);
    await createService(name);

    res.status(201).json({
      message: "Deployment and Service created",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create application",
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});