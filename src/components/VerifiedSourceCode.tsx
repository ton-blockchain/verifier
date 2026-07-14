import React, { useEffect, useMemo, useRef, useState } from "react";
import { ContractProofData } from "../lib/useLoadContractProof";
import { getValidSources, ValidSource } from "../lib/getSourcesData";
import { highlightElement } from "../lib/highlight";

interface VerifiedSourceCodeProps {
  button: React.ReactNode;
  proofData?: ContractProofData;
  domIds: {
    containerId: string;
    filesId: string;
    contentId: string;
  };
}

type DirectoryNode = {
  type: "dir";
  name: string;
  path: string;
  children: TreeNode[];
};

type FileNode = {
  type: "file";
  name: string;
  path: string;
  file: ValidSource;
};

type TreeNode = DirectoryNode | FileNode;

type InternalDirectoryNode = {
  type: "dir";
  name: string;
  path: string;
  children: Map<string, InternalTreeNode>;
};

type InternalTreeNode = InternalDirectoryNode | FileNode;

function buildTree(files: ValidSource[]): TreeNode[] {
  const root = new Map<string, InternalTreeNode>();

  files.forEach((file) => {
    const parts = file.name.split("/");
    let currentLevel = root;
    let currentPath = "";

    parts.forEach((part, index) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const isFile = index === parts.length - 1;
      if (isFile) {
        currentLevel.set(part, { type: "file", name: part, path: currentPath, file });
        return;
      }
      const existing = currentLevel.get(part);
      if (!existing || existing.type !== "dir") {
        const dir: InternalDirectoryNode = {
          type: "dir",
          name: part,
          path: currentPath,
          children: new Map(),
        };
        currentLevel.set(part, dir);
        currentLevel = dir.children;
      } else {
        currentLevel = existing.children;
      }
    });
  });

  const toArray = (map: Map<string, InternalTreeNode>): TreeNode[] =>
    Array.from(map.values())
      .map((node) =>
        node.type === "dir"
          ? ({
              type: "dir",
              name: node.name,
              path: node.path,
              children: toArray(node.children),
            } as DirectoryNode)
          : node,
      )
      .sort((a, b) => {
        if (a.type === b.type) {
          return a.name.localeCompare(b.name);
        }
        return a.type === "dir" ? -1 : 1;
      });

  return toArray(root);
}

function collectDirectoryPaths(nodes: TreeNode[]): string[] {
  const paths: string[] = [];
  nodes.forEach((node) => {
    if (node.type === "dir") {
      paths.push(node.path);
      paths.push(...collectDirectoryPaths(node.children));
    }
  });
  return paths;
}

const LANGUAGE_MAP: [RegExp, string][] = [
  [/\.fc$/, "func"],
  [/\.func$/, "func"],
  [/\.fif$/, "fift"],
  [/\.tact$/, "typescript"],
  [/\.ts$/, "typescript"],
  [/\.tsx$/, "typescript"],
  [/\.js$/, "javascript"],
  [/\.json$/, "json"],
  [/\.sh$/, "bash"],
  [/\.sol$/, "cpp"],
];

function detectLanguage(fileName: string) {
  const lower = fileName.toLowerCase();
  const entry = LANGUAGE_MAP.find(([regex]) => regex.test(lower));
  return entry ? entry[1] : undefined;
}

export function VerifiedSourceCode({ button, proofData, domIds }: VerifiedSourceCodeProps) {
  const files = useMemo(() => getValidSources(proofData?.files), [proofData]);
  const filesKey = useMemo(() => files.map((file) => file.name).join("|"), [files]);
  const tree = useMemo(() => buildTree(files), [filesKey]);
  const directoryPaths = useMemo(() => collectDirectoryPaths(tree), [tree]);

  const [activePath, setActivePath] = useState<string>(files[0]?.name ?? "");
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(directoryPaths));

  useEffect(() => {
    setActivePath(files[0]?.name ?? "");
    setExpandedPaths(new Set(directoryPaths));
  }, [filesKey, directoryPaths]);

  const activeFile = useMemo(
    () => files.find((file) => file.name === activePath),
    [files, activePath],
  );
  const activeLanguage = activeFile ? detectLanguage(activeFile.name) : undefined;
  const codeRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!codeRef.current) return;
    const element = codeRef.current;
    if (!activeFile) {
      element.textContent = "";
      return;
    }
    element.className = activeLanguage ? `language-${activeLanguage}` : "";
    element.textContent = activeFile.content;
    highlightElement(element);
  }, [activeFile, activeLanguage]);

  const toggleDirectory = (path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const renderNodes = (nodes: TreeNode[], depth = 0) =>
    nodes.map((node) => {
      if (node.type === "dir") {
        const expanded = expandedPaths.has(node.path);
        return (
          <div key={node.path}>
            <button
              type="button"
              className="contract-verifier-tree-item contract-verifier-dir"
              style={{ paddingLeft: 12 * (depth + 1) }}
              onClick={() => toggleDirectory(node.path)}>
              <span className={`contract-verifier-caret${expanded ? " open" : ""}`} />
              {node.name}
            </button>
            {expanded && node.children.length > 0 && (
              <div className="contract-verifier-tree-children">
                {renderNodes(node.children, depth + 1)}
              </div>
            )}
          </div>
        );
      }
      const isActive = node.path === activePath;
      return (
        <button
          key={node.path}
          type="button"
          className={`contract-verifier-tree-item contract-verifier-file${isActive ? " active" : ""}`}
          style={{ paddingLeft: 12 * (depth + 1) }}
          onClick={() => setActivePath(node.path)}>
          {node.name}
        </button>
      );
    });

  return (
    <div id={domIds.containerId} className="contract-verifier-container" style={{ color: "black" }}>
      <div id={domIds.filesId} className="contract-verifier-files">
        {tree.length > 0 ? (
          <div className="contract-verifier-tree">{renderNodes(tree)}</div>
        ) : (
          <div className="contract-verifier-empty">No sources available.</div>
        )}
      </div>
      <div style={{ position: "relative", overflow: "hidden", width: "100%" }}>
        <div id={domIds.contentId} className="contract-verifier-content">
          {activeFile ? (
            <>
              <div className="contract-verifier-code-copy" aria-hidden="true">
                {activeFile.content}
              </div>
              <pre>
                <code ref={codeRef}></code>
              </pre>
            </>
          ) : (
            <div className="contract-verifier-empty">Select a file to view its contents.</div>
          )}
        </div>
        {activeFile && (
          <div style={{ position: "absolute", top: -73, right: -24, zIndex: 3 }}>{button}</div>
        )}
      </div>
    </div>
  );
}
