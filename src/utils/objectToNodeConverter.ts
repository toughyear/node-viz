import { Node, Edge } from "reactflow";
import _ from "lodash";

import { JSONObject, RootItem } from "commonTypes";

export const getNodesAndEdges = (
  data: JSONObject,
  root: string = "root"
): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  function addNodeAndEdge(id: string, value: RootItem, parentId?: string) {
    const label = _.isObject(value) ? id : `${id}: ${value}`;
    const node = {
      id,
      position: { x: 0, y: 0 },
      data: { label },
      style: {
        width: 200,
        height: 80,
      },
    };
    nodes.push(node);
    if (parentId) {
      edges.push({ id: `${parentId}-${id}`, source: parentId, target: id });
    }
  }

  function traverseNode(node: RootItem, parentId?: string) {
    _.forOwn(node, (value, key) => {
      const id = parentId ? `${parentId}.${key}` : key;
      addNodeAndEdge(id, value, parentId);
      if (_.isObject(value)) {
        traverseNode(value, id);
      }
    });
  }

  traverseNode({
    [root]: data,
  });

  // Position nodes to prevent overlap
  function preventOverlap(nodes: Node[]) {
    const nodeMap = _.keyBy(nodes, "id");
    const nodeLevels = _.groupBy(nodes, (node) => node.id.split(".").length);
    let yOffset = 0;
    _.forEach(nodeLevels, (levelNodes) => {
      const levelY = _.get(_.last(levelNodes), "position.y", 0);
      _.forEach(levelNodes, (node, idx) => {
        node.position.x = idx * 300;
        node.position.y = levelY + yOffset * 100;

        if (nodeMap[node.id]) {
          nodeMap[node.id].position = node.position;
        }
      });

      yOffset += 1;
    });
  }
  preventOverlap(nodes);

  return { nodes, edges };
};
