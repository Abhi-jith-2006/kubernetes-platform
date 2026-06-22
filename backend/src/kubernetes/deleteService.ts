import * as k8s from "@kubernetes/client-node";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

export async function deleteService(name: string) {
  await k8sApi.deleteNamespacedService({
    name,
    namespace: "default",
  });
}