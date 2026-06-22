import * as k8s from "@kubernetes/client-node";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const appsApi = kc.makeApiClient(k8s.AppsV1Api);

export async function deleteDeployment(name: string) {
  await appsApi.deleteNamespacedDeployment({
    name,
    namespace: "default",
  });
}