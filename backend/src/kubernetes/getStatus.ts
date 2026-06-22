import * as k8s from "@kubernetes/client-node";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

export async function getAppStatus(name: string) {
  const pods = await k8sApi.listNamespacedPod({
    namespace: "default",
    labelSelector: `app=${name}`,
  });

  return {
    name,
    pods: pods.items.length,
    status:
      pods.items.length > 0
        ? pods.items[0].status?.phase
        : "Not Found",
  };
}
