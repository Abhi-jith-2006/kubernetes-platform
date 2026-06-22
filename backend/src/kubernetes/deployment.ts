import * as k8s from "@kubernetes/client-node";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const appsApi = kc.makeApiClient(k8s.AppsV1Api);

export async function createDeployment(
  name: string,
  image: string
) {
  const deployment = {
    metadata: {
      name,
    },
    spec: {
      replicas: 1,
      selector: {
        matchLabels: {
          app: name,
        },
      },
      template: {
        metadata: {
          labels: {
            app: name,
          },
        },
        spec: {
          containers: [
            {
              name,
              image,
            },
          ],
        },
      },
    },
  };

  return appsApi.createNamespacedDeployment({
    namespace: "default",
    body: deployment,
  });
}
