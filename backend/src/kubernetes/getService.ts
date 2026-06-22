import * as k8s from "@kubernetes/client-node";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

export async function getService(name: string) {
  const service = await k8sApi.readNamespacedService({
    name,
    namespace: "default",
  });

  return {
    name: service.metadata?.name,
    type: service.spec?.type,
    nodePort: service.spec?.ports?.[0]?.nodePort,
    port: service.spec?.ports?.[0]?.port,
  };
}