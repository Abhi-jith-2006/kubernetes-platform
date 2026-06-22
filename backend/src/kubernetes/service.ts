import * as k8s from "@kubernetes/client-node";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

export async function createService(name: string) {
  await k8sApi.createNamespacedService({
    namespace: "default",
    body: {
      metadata: {
        name,
      },
      spec: {
        selector: {
          app: name,
        },
        ports: [
          {
            port: 80,
            targetPort: 80,
          },
        ],
        type: "NodePort",
      },
    },
  });
}