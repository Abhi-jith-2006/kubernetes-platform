import * as k8s from "@kubernetes/client-node";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const appsApi = kc.makeApiClient(k8s.AppsV1Api);

export async function listDeployments() {
  const response = await appsApi.listNamespacedDeployment({
    namespace: "default",
  });

  return response.items.map((deployment) => ({
    name: deployment.metadata?.name,
    replicas: deployment.spec?.replicas,
  }));
}