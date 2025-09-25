// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";

// src/visual-edits/component-tagger-plugin.js
import { parse } from "file:///home/project/node_modules/@babel/parser/lib/index.js";
import MagicString from "file:///home/project/node_modules/magic-string/dist/magic-string.es.mjs";
import { walk } from "file:///home/project/node_modules/estree-walker/dist/esm/estree-walker.js";
import path from "path";
var threeFiberElems = [
  "object3D",
  "audioListener",
  "positionalAudio",
  "mesh",
  "batchedMesh",
  "instancedMesh",
  "scene",
  "sprite",
  "lOD",
  "skinnedMesh",
  "skeleton",
  "bone",
  "lineSegments",
  "lineLoop",
  "points",
  "group",
  "camera",
  "perspectiveCamera",
  "orthographicCamera",
  "cubeCamera",
  "arrayCamera",
  "instancedBufferGeometry",
  "bufferGeometry",
  "boxBufferGeometry",
  "circleBufferGeometry",
  "coneBufferGeometry",
  "cylinderBufferGeometry",
  "dodecahedronBufferGeometry",
  "extrudeBufferGeometry",
  "icosahedronBufferGeometry",
  "latheBufferGeometry",
  "octahedronBufferGeometry",
  "planeBufferGeometry",
  "polyhedronBufferGeometry",
  "ringBufferGeometry",
  "shapeBufferGeometry",
  "sphereBufferGeometry",
  "tetrahedronBufferGeometry",
  "torusBufferGeometry",
  "torusKnotBufferGeometry",
  "tubeBufferGeometry",
  "wireframeGeometry",
  "tetrahedronGeometry",
  "octahedronGeometry",
  "icosahedronGeometry",
  "dodecahedronGeometry",
  "polyhedronGeometry",
  "tubeGeometry",
  "torusKnotGeometry",
  "torusGeometry",
  "sphereGeometry",
  "ringGeometry",
  "planeGeometry",
  "latheGeometry",
  "shapeGeometry",
  "extrudeGeometry",
  "edgesGeometry",
  "coneGeometry",
  "cylinderGeometry",
  "circleGeometry",
  "boxGeometry",
  "capsuleGeometry",
  "material",
  "shadowMaterial",
  "spriteMaterial",
  "rawShaderMaterial",
  "shaderMaterial",
  "pointsMaterial",
  "meshPhysicalMaterial",
  "meshStandardMaterial",
  "meshPhongMaterial",
  "meshToonMaterial",
  "meshNormalMaterial",
  "meshLambertMaterial",
  "meshDepthMaterial",
  "meshDistanceMaterial",
  "meshBasicMaterial",
  "meshMatcapMaterial",
  "lineDashedMaterial",
  "lineBasicMaterial",
  "primitive",
  "light",
  "spotLightShadow",
  "spotLight",
  "pointLight",
  "rectAreaLight",
  "hemisphereLight",
  "directionalLightShadow",
  "directionalLight",
  "ambientLight",
  "lightShadow",
  "ambientLightProbe",
  "hemisphereLightProbe",
  "lightProbe",
  "spotLightHelper",
  "skeletonHelper",
  "pointLightHelper",
  "hemisphereLightHelper",
  "gridHelper",
  "polarGridHelper",
  "directionalLightHelper",
  "cameraHelper",
  "boxHelper",
  "box3Helper",
  "planeHelper",
  "arrowHelper",
  "axesHelper",
  "texture",
  "videoTexture",
  "dataTexture",
  "dataTexture3D",
  "compressedTexture",
  "cubeTexture",
  "canvasTexture",
  "depthTexture",
  "raycaster",
  "vector2",
  "vector3",
  "vector4",
  "euler",
  "matrix3",
  "matrix4",
  "quaternion",
  "bufferAttribute",
  "float16BufferAttribute",
  "float32BufferAttribute",
  "float64BufferAttribute",
  "int8BufferAttribute",
  "int16BufferAttribute",
  "int32BufferAttribute",
  "uint8BufferAttribute",
  "uint16BufferAttribute",
  "uint32BufferAttribute",
  "instancedBufferAttribute",
  "color",
  "fog",
  "fogExp2",
  "shape",
  "colorShiftMaterial"
];
var dreiElems = [
  "AsciiRenderer",
  "Billboard",
  "Clone",
  "ComputedAttribute",
  "Decal",
  "Edges",
  "Effects",
  "GradientTexture",
  "MarchingCubes",
  "Outlines",
  "PositionalAudio",
  "Sampler",
  "ScreenSizer",
  "ScreenSpace",
  "Splat",
  "Svg",
  "Text",
  "Text3D",
  "Trail",
  "CubeCamera",
  "OrthographicCamera",
  "PerspectiveCamera",
  "CameraControls",
  "FaceControls",
  "KeyboardControls",
  "MotionPathControls",
  "PresentationControls",
  "ScrollControls",
  "DragControls",
  "GizmoHelper",
  "Grid",
  "Helper",
  "PivotControls",
  "TransformControls",
  "CubeTexture",
  "Fbx",
  "Gltf",
  "Ktx2",
  "Loader",
  "Progress",
  "ScreenVideoTexture",
  "Texture",
  "TrailTexture",
  "VideoTexture",
  "WebcamVideoTexture",
  "CycleRaycast",
  "DetectGPU",
  "Example",
  "FaceLandmarker",
  "Fbo",
  "Html",
  "Select",
  "SpriteAnimator",
  "StatsGl",
  "Stats",
  "Trail",
  "Wireframe",
  "CurveModifier",
  "AdaptiveDpr",
  "AdaptiveEvents",
  "BakeShadows",
  "Bvh",
  "Detailed",
  "Instances",
  "Merged",
  "meshBounds",
  "PerformanceMonitor",
  "Points",
  "Preload",
  "Segments",
  "Fisheye",
  "Hud",
  "Mask",
  "MeshPortalMaterial",
  "RenderCubeTexture",
  "RenderTexture",
  "View",
  "MeshDiscardMaterial",
  "MeshDistortMaterial",
  "MeshReflectorMaterial",
  "MeshRefractionMaterial",
  "MeshTransmissionMaterial",
  "MeshWobbleMaterial",
  "PointMaterial",
  "shaderMaterial",
  "SoftShadows",
  "CatmullRomLine",
  "CubicBezierLine",
  "Facemesh",
  "Line",
  "Mesh",
  "QuadraticBezierLine",
  "RoundedBox",
  "ScreenQuad",
  "AccumulativeShadows",
  "Backdrop",
  "BBAnchor",
  "Bounds",
  "CameraShake",
  "Caustics",
  "Center",
  "Cloud",
  "ContactShadows",
  "Environment",
  "Float",
  "Lightformer",
  "MatcapTexture",
  "NormalTexture",
  "RandomizedLight",
  "Resize",
  "ShadowAlpha",
  "Shadow",
  "Sky",
  "Sparkles",
  "SpotLightShadow",
  "SpotLight",
  "Stage",
  "Stars",
  "OrbitControls"
];
var shouldTag = (name) => !threeFiberElems.includes(name) && !dreiElems.includes(name);
var isNextImageAlias = (aliases, name) => aliases.has(name);
var extractLiteralValue = (node) => {
  if (!node) return void 0;
  switch (node.type) {
    case "StringLiteral":
      return node.value;
    case "NumericLiteral":
      return node.value;
    case "BooleanLiteral":
      return node.value;
    case "ObjectExpression":
      const obj = {};
      for (const prop of node.properties) {
        if (prop.type === "ObjectProperty" && !prop.computed) {
          const key = prop.key.type === "Identifier" ? prop.key.name : prop.key.value;
          obj[key] = extractLiteralValue(prop.value);
        }
      }
      return obj;
    case "ArrayExpression":
      return node.elements.map((el) => extractLiteralValue(el));
    default:
      return void 0;
  }
};
var findVariableDeclarations = (ast) => {
  const variables = /* @__PURE__ */ new Map();
  walk(ast, {
    enter(node) {
      if (node.type === "VariableDeclaration") {
        for (const declarator of node.declarations) {
          if (declarator.id.type === "Identifier" && declarator.init) {
            const varName = declarator.id.name;
            const value = extractLiteralValue(declarator.init);
            variables.set(varName, {
              name: varName,
              type: Array.isArray(value) ? "array" : typeof value === "object" ? "object" : "primitive",
              value,
              arrayItems: Array.isArray(value) ? value : void 0,
              loc: declarator.loc?.start
            });
          }
        }
      }
    }
  });
  return variables;
};
var findMapContext = (node, variables) => {
  let current = node;
  let depth = 0;
  const maxDepth = 10;
  while (current && depth < maxDepth) {
    if (current.type === "CallExpression" && current.callee?.type === "MemberExpression" && current.callee?.property?.name === "map") {
      const arrayName = current.callee.object?.name;
      const mapCallback = current.arguments?.[0];
      if (arrayName && mapCallback?.type === "ArrowFunctionExpression") {
        const itemParam = mapCallback.params?.[0];
        const indexParam = mapCallback.params?.[1];
        if (itemParam?.type === "Identifier") {
          const varInfo = variables.get(arrayName);
          return {
            arrayName,
            itemVarName: itemParam.name,
            arrayItems: varInfo?.arrayItems,
            arrayLoc: varInfo?.loc,
            indexVarName: indexParam?.type === "Identifier" ? indexParam.name : void 0
          };
        }
      }
    }
    current = current.parent;
    depth++;
  }
  return null;
};
var getSemanticName = (node, mapContext, imageAliases) => {
  const getName = () => {
    if (node.name.type === "JSXIdentifier") return node.name.name;
    if (node.name.type === "JSXMemberExpression")
      return `${node.name.object.name}.${node.name.property.name}`;
    return null;
  };
  const tagName = getName();
  if (!tagName) return null;
  if (isNextImageAlias(imageAliases, tagName)) {
    return "img";
  }
  return tagName;
};
function transformSource(src, filename) {
  if (/node_modules/.test(filename)) {
    return { code: src };
  }
  try {
    const ast = parse(src, {
      sourceType: "module",
      plugins: ["jsx", "typescript"]
    });
    const ms = new MagicString(src);
    const rel = path.relative(process.cwd(), filename);
    let mutated = false;
    walk(ast, {
      enter(node, parent) {
        if (parent && !Object.prototype.hasOwnProperty.call(node, "parent")) {
          Object.defineProperty(node, "parent", { value: parent, enumerable: false });
        }
      }
    });
    const variables = findVariableDeclarations(ast);
    const imageAliases = /* @__PURE__ */ new Set();
    walk(ast, {
      enter(node) {
        if (node.type === "ImportDeclaration" && node.source.value === "next/image") {
          for (const spec of node.specifiers) {
            imageAliases.add(spec.local.name);
          }
        }
      }
    });
    walk(ast, {
      enter(node) {
        if (node.type !== "JSXOpeningElement") return;
        const mapContext = findMapContext(node, variables);
        const semanticName = getSemanticName(node, mapContext, imageAliases);
        if (!semanticName || ["Fragment", "React.Fragment"].includes(semanticName) || !isNextImageAlias(imageAliases, semanticName.split("-")[0]) && !shouldTag(semanticName)) return;
        const { line, column } = node.loc.start;
        let orchidsId = `${rel}:${line}:${column}`;
        if (mapContext) {
          orchidsId += `@${mapContext.arrayName}`;
        }
        node.attributes?.forEach((attr) => {
          if (attr.type === "JSXAttribute" && attr.value?.type === "JSXExpressionContainer" && attr.value.expression?.type === "Identifier") {
            const refName = attr.value.expression.name;
            const varInfo = variables.get(refName);
            if (varInfo) {
              orchidsId += `@${refName}`;
            }
          }
        });
        if (mapContext?.indexVarName) {
          ms.appendLeft(node.name.end, ` data-map-index={${mapContext.indexVarName}}`);
        }
        ms.appendLeft(node.name.end, ` data-orchids-id="${orchidsId}" data-orchids-name="${semanticName}"`);
        mutated = true;
      }
    });
    if (mutated) {
      return {
        code: ms.toString(),
        map: ms.generateMap({ hires: true })
      };
    }
    return { code: src };
  } catch (err) {
    console.error("[componentTagger] Parse error:", err);
    return { code: src };
  }
}
function componentTaggerPlugin() {
  return {
    name: "component-tagger",
    enforce: "pre",
    transform(src, id) {
      if (id.endsWith(".jsx") || id.endsWith(".tsx")) {
        return transformSource(src, id);
      }
    }
  };
}

// vite.config.ts
var logErrorsPlugin = () => ({
  name: "log-errors-plugin",
  // Inject a small client-side script that mirrors Vite overlay errors to console
  transformIndexHtml() {
    return {
      tags: [
        {
          tag: "script",
          injectTo: "head",
          children: `(() => {
            try {
              const logOverlay = () => {
                const el = document.querySelector('vite-error-overlay');
                if (!el) return;
                const root = (el.shadowRoot || el);
                let text = '';
                try { text = root.textContent || ''; } catch (_) {}
                if (text && text.trim()) {
                  const msg = text.trim();
                  // Use console.error to surface clearly in DevTools
                  console.error('[Vite Overlay]', msg);
                  // Also mirror to parent iframe with structured payload
                  try {
                    if (window.parent && window.parent !== window) {
                      window.parent.postMessage({
                        type: 'ERROR_CAPTURED',
                        error: {
                          message: msg,
                          stack: undefined,
                          filename: undefined,
                          lineno: undefined,
                          colno: undefined,
                          source: 'vite.overlay',
                        },
                        timestamp: Date.now(),
                      }, '*');
                    }
                  } catch (_) {}
                }
              };

              const obs = new MutationObserver(() => logOverlay());
              obs.observe(document.documentElement, { childList: true, subtree: true });

              window.addEventListener('DOMContentLoaded', logOverlay);
              // Attempt immediately as overlay may already exist
              logOverlay();
            } catch (e) {
              console.warn('[Vite Overlay logger failed]', e);
            }
          })();`
        }
      ]
    };
  }
});
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3e3,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false
      }
    }
  },
  plugins: [
    react(),
    logErrorsPlugin(),
    mode === "development" && componentTaggerPlugin()
  ].filter(Boolean),
  base: "./",
  optimizeDeps: {
    exclude: ["lucide-react"]
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL3Zpc3VhbC1lZGl0cy9jb21wb25lbnQtdGFnZ2VyLXBsdWdpbi5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL3Byb2plY3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvcHJvamVjdC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcbmltcG9ydCB7IGNvbXBvbmVudFRhZ2dlclBsdWdpbiB9IGZyb20gXCIuL3NyYy92aXN1YWwtZWRpdHMvY29tcG9uZW50LXRhZ2dlci1wbHVnaW4uanNcIjtcblxuLy8gTWluaW1hbCBwbHVnaW4gdG8gbG9nIGJ1aWxkLXRpbWUgYW5kIGRldi10aW1lIGVycm9ycyB0byBjb25zb2xlXG5jb25zdCBsb2dFcnJvcnNQbHVnaW4gPSAoKSA9PiAoe1xuICBuYW1lOiBcImxvZy1lcnJvcnMtcGx1Z2luXCIsXG4gIC8vIEluamVjdCBhIHNtYWxsIGNsaWVudC1zaWRlIHNjcmlwdCB0aGF0IG1pcnJvcnMgVml0ZSBvdmVybGF5IGVycm9ycyB0byBjb25zb2xlXG4gIHRyYW5zZm9ybUluZGV4SHRtbCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdGFnczogW1xuICAgICAgICB7XG4gICAgICAgICAgdGFnOiBcInNjcmlwdFwiLFxuICAgICAgICAgIGluamVjdFRvOiBcImhlYWRcIixcbiAgICAgICAgICBjaGlsZHJlbjogYCgoKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBjb25zdCBsb2dPdmVybGF5ID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcigndml0ZS1lcnJvci1vdmVybGF5Jyk7XG4gICAgICAgICAgICAgICAgaWYgKCFlbCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJvb3QgPSAoZWwuc2hhZG93Um9vdCB8fCBlbCk7XG4gICAgICAgICAgICAgICAgbGV0IHRleHQgPSAnJztcbiAgICAgICAgICAgICAgICB0cnkgeyB0ZXh0ID0gcm9vdC50ZXh0Q29udGVudCB8fCAnJzsgfSBjYXRjaCAoXykge31cbiAgICAgICAgICAgICAgICBpZiAodGV4dCAmJiB0ZXh0LnRyaW0oKSkge1xuICAgICAgICAgICAgICAgICAgY29uc3QgbXNnID0gdGV4dC50cmltKCk7XG4gICAgICAgICAgICAgICAgICAvLyBVc2UgY29uc29sZS5lcnJvciB0byBzdXJmYWNlIGNsZWFybHkgaW4gRGV2VG9vbHNcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tWaXRlIE92ZXJsYXldJywgbXNnKTtcbiAgICAgICAgICAgICAgICAgIC8vIEFsc28gbWlycm9yIHRvIHBhcmVudCBpZnJhbWUgd2l0aCBzdHJ1Y3R1cmVkIHBheWxvYWRcbiAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh3aW5kb3cucGFyZW50ICYmIHdpbmRvdy5wYXJlbnQgIT09IHdpbmRvdykge1xuICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5wYXJlbnQucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ0VSUk9SX0NBUFRVUkVEJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG1zZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2s6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZW5vOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG5vOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogJ3ZpdGUub3ZlcmxheScsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgICAgICAgICAgIH0sICcqJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKF8pIHt9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgIGNvbnN0IG9icyA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IGxvZ092ZXJsYXkoKSk7XG4gICAgICAgICAgICAgIG9icy5vYnNlcnZlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgeyBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUgfSk7XG5cbiAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBsb2dPdmVybGF5KTtcbiAgICAgICAgICAgICAgLy8gQXR0ZW1wdCBpbW1lZGlhdGVseSBhcyBvdmVybGF5IG1heSBhbHJlYWR5IGV4aXN0XG4gICAgICAgICAgICAgIGxvZ092ZXJsYXkoKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdbVml0ZSBPdmVybGF5IGxvZ2dlciBmYWlsZWRdJywgZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkoKTtgXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9O1xuICB9LFxufSk7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiBcIjo6XCIsXG4gICAgcG9ydDogMzAwMCxcbiAgICBwcm94eToge1xuICAgICAgJy9hcGknOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCcsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgbG9nRXJyb3JzUGx1Z2luKCksXG4gICAgbW9kZSA9PT0gJ2RldmVsb3BtZW50JyAmJiBjb21wb25lbnRUYWdnZXJQbHVnaW4oKSxcbiAgXS5maWx0ZXIoQm9vbGVhbiksXG4gIGJhc2U6ICcuLycsXG4gIG9wdGltaXplRGVwczoge1xuICAgIGV4Y2x1ZGU6IFsnbHVjaWRlLXJlYWN0J10sXG4gIH0sXG59KSk7IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3NyYy92aXN1YWwtZWRpdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3Byb2plY3Qvc3JjL3Zpc3VhbC1lZGl0cy9jb21wb25lbnQtdGFnZ2VyLXBsdWdpbi5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9wcm9qZWN0L3NyYy92aXN1YWwtZWRpdHMvY29tcG9uZW50LXRhZ2dlci1wbHVnaW4uanNcIjtpbXBvcnQgeyBwYXJzZSB9IGZyb20gJ0BiYWJlbC9wYXJzZXInO1xuaW1wb3J0IE1hZ2ljU3RyaW5nIGZyb20gJ21hZ2ljLXN0cmluZyc7XG5pbXBvcnQgeyB3YWxrIH0gZnJvbSAnZXN0cmVlLXdhbGtlcic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuLyogXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwIEJsYWNrbGlzdHMgKi9cbmNvbnN0IHRocmVlRmliZXJFbGVtcyA9IFtcbiAgICBcIm9iamVjdDNEXCIsXG4gICAgXCJhdWRpb0xpc3RlbmVyXCIsXG4gICAgXCJwb3NpdGlvbmFsQXVkaW9cIixcbiAgICBcIm1lc2hcIixcbiAgICBcImJhdGNoZWRNZXNoXCIsXG4gICAgXCJpbnN0YW5jZWRNZXNoXCIsXG4gICAgXCJzY2VuZVwiLFxuICAgIFwic3ByaXRlXCIsXG4gICAgXCJsT0RcIixcbiAgICBcInNraW5uZWRNZXNoXCIsXG4gICAgXCJza2VsZXRvblwiLFxuICAgIFwiYm9uZVwiLFxuICAgIFwibGluZVNlZ21lbnRzXCIsXG4gICAgXCJsaW5lTG9vcFwiLFxuICAgIFwicG9pbnRzXCIsXG4gICAgXCJncm91cFwiLFxuICAgIFwiY2FtZXJhXCIsXG4gICAgXCJwZXJzcGVjdGl2ZUNhbWVyYVwiLFxuICAgIFwib3J0aG9ncmFwaGljQ2FtZXJhXCIsXG4gICAgXCJjdWJlQ2FtZXJhXCIsXG4gICAgXCJhcnJheUNhbWVyYVwiLFxuICAgIFwiaW5zdGFuY2VkQnVmZmVyR2VvbWV0cnlcIixcbiAgICBcImJ1ZmZlckdlb21ldHJ5XCIsXG4gICAgXCJib3hCdWZmZXJHZW9tZXRyeVwiLFxuICAgIFwiY2lyY2xlQnVmZmVyR2VvbWV0cnlcIixcbiAgICBcImNvbmVCdWZmZXJHZW9tZXRyeVwiLFxuICAgIFwiY3lsaW5kZXJCdWZmZXJHZW9tZXRyeVwiLFxuICAgIFwiZG9kZWNhaGVkcm9uQnVmZmVyR2VvbWV0cnlcIixcbiAgICBcImV4dHJ1ZGVCdWZmZXJHZW9tZXRyeVwiLFxuICAgIFwiaWNvc2FoZWRyb25CdWZmZXJHZW9tZXRyeVwiLFxuICAgIFwibGF0aGVCdWZmZXJHZW9tZXRyeVwiLFxuICAgIFwib2N0YWhlZHJvbkJ1ZmZlckdlb21ldHJ5XCIsXG4gICAgXCJwbGFuZUJ1ZmZlckdlb21ldHJ5XCIsXG4gICAgXCJwb2x5aGVkcm9uQnVmZmVyR2VvbWV0cnlcIixcbiAgICBcInJpbmdCdWZmZXJHZW9tZXRyeVwiLFxuICAgIFwic2hhcGVCdWZmZXJHZW9tZXRyeVwiLFxuICAgIFwic3BoZXJlQnVmZmVyR2VvbWV0cnlcIixcbiAgICBcInRldHJhaGVkcm9uQnVmZmVyR2VvbWV0cnlcIixcbiAgICBcInRvcnVzQnVmZmVyR2VvbWV0cnlcIixcbiAgICBcInRvcnVzS25vdEJ1ZmZlckdlb21ldHJ5XCIsXG4gICAgXCJ0dWJlQnVmZmVyR2VvbWV0cnlcIixcbiAgICBcIndpcmVmcmFtZUdlb21ldHJ5XCIsXG4gICAgXCJ0ZXRyYWhlZHJvbkdlb21ldHJ5XCIsXG4gICAgXCJvY3RhaGVkcm9uR2VvbWV0cnlcIixcbiAgICBcImljb3NhaGVkcm9uR2VvbWV0cnlcIixcbiAgICBcImRvZGVjYWhlZHJvbkdlb21ldHJ5XCIsXG4gICAgXCJwb2x5aGVkcm9uR2VvbWV0cnlcIixcbiAgICBcInR1YmVHZW9tZXRyeVwiLFxuICAgIFwidG9ydXNLbm90R2VvbWV0cnlcIixcbiAgICBcInRvcnVzR2VvbWV0cnlcIixcbiAgICBcInNwaGVyZUdlb21ldHJ5XCIsXG4gICAgXCJyaW5nR2VvbWV0cnlcIixcbiAgICBcInBsYW5lR2VvbWV0cnlcIixcbiAgICBcImxhdGhlR2VvbWV0cnlcIixcbiAgICBcInNoYXBlR2VvbWV0cnlcIixcbiAgICBcImV4dHJ1ZGVHZW9tZXRyeVwiLFxuICAgIFwiZWRnZXNHZW9tZXRyeVwiLFxuICAgIFwiY29uZUdlb21ldHJ5XCIsXG4gICAgXCJjeWxpbmRlckdlb21ldHJ5XCIsXG4gICAgXCJjaXJjbGVHZW9tZXRyeVwiLFxuICAgIFwiYm94R2VvbWV0cnlcIixcbiAgICBcImNhcHN1bGVHZW9tZXRyeVwiLFxuICAgIFwibWF0ZXJpYWxcIixcbiAgICBcInNoYWRvd01hdGVyaWFsXCIsXG4gICAgXCJzcHJpdGVNYXRlcmlhbFwiLFxuICAgIFwicmF3U2hhZGVyTWF0ZXJpYWxcIixcbiAgICBcInNoYWRlck1hdGVyaWFsXCIsXG4gICAgXCJwb2ludHNNYXRlcmlhbFwiLFxuICAgIFwibWVzaFBoeXNpY2FsTWF0ZXJpYWxcIixcbiAgICBcIm1lc2hTdGFuZGFyZE1hdGVyaWFsXCIsXG4gICAgXCJtZXNoUGhvbmdNYXRlcmlhbFwiLFxuICAgIFwibWVzaFRvb25NYXRlcmlhbFwiLFxuICAgIFwibWVzaE5vcm1hbE1hdGVyaWFsXCIsXG4gICAgXCJtZXNoTGFtYmVydE1hdGVyaWFsXCIsXG4gICAgXCJtZXNoRGVwdGhNYXRlcmlhbFwiLFxuICAgIFwibWVzaERpc3RhbmNlTWF0ZXJpYWxcIixcbiAgICBcIm1lc2hCYXNpY01hdGVyaWFsXCIsXG4gICAgXCJtZXNoTWF0Y2FwTWF0ZXJpYWxcIixcbiAgICBcImxpbmVEYXNoZWRNYXRlcmlhbFwiLFxuICAgIFwibGluZUJhc2ljTWF0ZXJpYWxcIixcbiAgICBcInByaW1pdGl2ZVwiLFxuICAgIFwibGlnaHRcIixcbiAgICBcInNwb3RMaWdodFNoYWRvd1wiLFxuICAgIFwic3BvdExpZ2h0XCIsXG4gICAgXCJwb2ludExpZ2h0XCIsXG4gICAgXCJyZWN0QXJlYUxpZ2h0XCIsXG4gICAgXCJoZW1pc3BoZXJlTGlnaHRcIixcbiAgICBcImRpcmVjdGlvbmFsTGlnaHRTaGFkb3dcIixcbiAgICBcImRpcmVjdGlvbmFsTGlnaHRcIixcbiAgICBcImFtYmllbnRMaWdodFwiLFxuICAgIFwibGlnaHRTaGFkb3dcIixcbiAgICBcImFtYmllbnRMaWdodFByb2JlXCIsXG4gICAgXCJoZW1pc3BoZXJlTGlnaHRQcm9iZVwiLFxuICAgIFwibGlnaHRQcm9iZVwiLFxuICAgIFwic3BvdExpZ2h0SGVscGVyXCIsXG4gICAgXCJza2VsZXRvbkhlbHBlclwiLFxuICAgIFwicG9pbnRMaWdodEhlbHBlclwiLFxuICAgIFwiaGVtaXNwaGVyZUxpZ2h0SGVscGVyXCIsXG4gICAgXCJncmlkSGVscGVyXCIsXG4gICAgXCJwb2xhckdyaWRIZWxwZXJcIixcbiAgICBcImRpcmVjdGlvbmFsTGlnaHRIZWxwZXJcIixcbiAgICBcImNhbWVyYUhlbHBlclwiLFxuICAgIFwiYm94SGVscGVyXCIsXG4gICAgXCJib3gzSGVscGVyXCIsXG4gICAgXCJwbGFuZUhlbHBlclwiLFxuICAgIFwiYXJyb3dIZWxwZXJcIixcbiAgICBcImF4ZXNIZWxwZXJcIixcbiAgICBcInRleHR1cmVcIixcbiAgICBcInZpZGVvVGV4dHVyZVwiLFxuICAgIFwiZGF0YVRleHR1cmVcIixcbiAgICBcImRhdGFUZXh0dXJlM0RcIixcbiAgICBcImNvbXByZXNzZWRUZXh0dXJlXCIsXG4gICAgXCJjdWJlVGV4dHVyZVwiLFxuICAgIFwiY2FudmFzVGV4dHVyZVwiLFxuICAgIFwiZGVwdGhUZXh0dXJlXCIsXG4gICAgXCJyYXljYXN0ZXJcIixcbiAgICBcInZlY3RvcjJcIixcbiAgICBcInZlY3RvcjNcIixcbiAgICBcInZlY3RvcjRcIixcbiAgICBcImV1bGVyXCIsXG4gICAgXCJtYXRyaXgzXCIsXG4gICAgXCJtYXRyaXg0XCIsXG4gICAgXCJxdWF0ZXJuaW9uXCIsXG4gICAgXCJidWZmZXJBdHRyaWJ1dGVcIixcbiAgICBcImZsb2F0MTZCdWZmZXJBdHRyaWJ1dGVcIixcbiAgICBcImZsb2F0MzJCdWZmZXJBdHRyaWJ1dGVcIixcbiAgICBcImZsb2F0NjRCdWZmZXJBdHRyaWJ1dGVcIixcbiAgICBcImludDhCdWZmZXJBdHRyaWJ1dGVcIixcbiAgICBcImludDE2QnVmZmVyQXR0cmlidXRlXCIsXG4gICAgXCJpbnQzMkJ1ZmZlckF0dHJpYnV0ZVwiLFxuICAgIFwidWludDhCdWZmZXJBdHRyaWJ1dGVcIixcbiAgICBcInVpbnQxNkJ1ZmZlckF0dHJpYnV0ZVwiLFxuICAgIFwidWludDMyQnVmZmVyQXR0cmlidXRlXCIsXG4gICAgXCJpbnN0YW5jZWRCdWZmZXJBdHRyaWJ1dGVcIixcbiAgICBcImNvbG9yXCIsXG4gICAgXCJmb2dcIixcbiAgICBcImZvZ0V4cDJcIixcbiAgICBcInNoYXBlXCIsXG4gICAgXCJjb2xvclNoaWZ0TWF0ZXJpYWxcIlxuXTtcblxuY29uc3QgZHJlaUVsZW1zID0gW1xuICAgIFwiQXNjaWlSZW5kZXJlclwiLFxuICAgIFwiQmlsbGJvYXJkXCIsXG4gICAgXCJDbG9uZVwiLFxuICAgIFwiQ29tcHV0ZWRBdHRyaWJ1dGVcIixcbiAgICBcIkRlY2FsXCIsXG4gICAgXCJFZGdlc1wiLFxuICAgIFwiRWZmZWN0c1wiLFxuICAgIFwiR3JhZGllbnRUZXh0dXJlXCIsXG4gICAgXCJNYXJjaGluZ0N1YmVzXCIsXG4gICAgXCJPdXRsaW5lc1wiLFxuICAgIFwiUG9zaXRpb25hbEF1ZGlvXCIsXG4gICAgXCJTYW1wbGVyXCIsXG4gICAgXCJTY3JlZW5TaXplclwiLFxuICAgIFwiU2NyZWVuU3BhY2VcIixcbiAgICBcIlNwbGF0XCIsXG4gICAgXCJTdmdcIixcbiAgICBcIlRleHRcIixcbiAgICBcIlRleHQzRFwiLFxuICAgIFwiVHJhaWxcIixcbiAgICBcIkN1YmVDYW1lcmFcIixcbiAgICBcIk9ydGhvZ3JhcGhpY0NhbWVyYVwiLFxuICAgIFwiUGVyc3BlY3RpdmVDYW1lcmFcIixcbiAgICBcIkNhbWVyYUNvbnRyb2xzXCIsXG4gICAgXCJGYWNlQ29udHJvbHNcIixcbiAgICBcIktleWJvYXJkQ29udHJvbHNcIixcbiAgICBcIk1vdGlvblBhdGhDb250cm9sc1wiLFxuICAgIFwiUHJlc2VudGF0aW9uQ29udHJvbHNcIixcbiAgICBcIlNjcm9sbENvbnRyb2xzXCIsXG4gICAgXCJEcmFnQ29udHJvbHNcIixcbiAgICBcIkdpem1vSGVscGVyXCIsXG4gICAgXCJHcmlkXCIsXG4gICAgXCJIZWxwZXJcIixcbiAgICBcIlBpdm90Q29udHJvbHNcIixcbiAgICBcIlRyYW5zZm9ybUNvbnRyb2xzXCIsXG4gICAgXCJDdWJlVGV4dHVyZVwiLFxuICAgIFwiRmJ4XCIsXG4gICAgXCJHbHRmXCIsXG4gICAgXCJLdHgyXCIsXG4gICAgXCJMb2FkZXJcIixcbiAgICBcIlByb2dyZXNzXCIsXG4gICAgXCJTY3JlZW5WaWRlb1RleHR1cmVcIixcbiAgICBcIlRleHR1cmVcIixcbiAgICBcIlRyYWlsVGV4dHVyZVwiLFxuICAgIFwiVmlkZW9UZXh0dXJlXCIsXG4gICAgXCJXZWJjYW1WaWRlb1RleHR1cmVcIixcbiAgICBcIkN5Y2xlUmF5Y2FzdFwiLFxuICAgIFwiRGV0ZWN0R1BVXCIsXG4gICAgXCJFeGFtcGxlXCIsXG4gICAgXCJGYWNlTGFuZG1hcmtlclwiLFxuICAgIFwiRmJvXCIsXG4gICAgXCJIdG1sXCIsXG4gICAgXCJTZWxlY3RcIixcbiAgICBcIlNwcml0ZUFuaW1hdG9yXCIsXG4gICAgXCJTdGF0c0dsXCIsXG4gICAgXCJTdGF0c1wiLFxuICAgIFwiVHJhaWxcIixcbiAgICBcIldpcmVmcmFtZVwiLFxuICAgIFwiQ3VydmVNb2RpZmllclwiLFxuICAgIFwiQWRhcHRpdmVEcHJcIixcbiAgICBcIkFkYXB0aXZlRXZlbnRzXCIsXG4gICAgXCJCYWtlU2hhZG93c1wiLFxuICAgIFwiQnZoXCIsXG4gICAgXCJEZXRhaWxlZFwiLFxuICAgIFwiSW5zdGFuY2VzXCIsXG4gICAgXCJNZXJnZWRcIixcbiAgICBcIm1lc2hCb3VuZHNcIixcbiAgICBcIlBlcmZvcm1hbmNlTW9uaXRvclwiLFxuICAgIFwiUG9pbnRzXCIsXG4gICAgXCJQcmVsb2FkXCIsXG4gICAgXCJTZWdtZW50c1wiLFxuICAgIFwiRmlzaGV5ZVwiLFxuICAgIFwiSHVkXCIsXG4gICAgXCJNYXNrXCIsXG4gICAgXCJNZXNoUG9ydGFsTWF0ZXJpYWxcIixcbiAgICBcIlJlbmRlckN1YmVUZXh0dXJlXCIsXG4gICAgXCJSZW5kZXJUZXh0dXJlXCIsXG4gICAgXCJWaWV3XCIsXG4gICAgXCJNZXNoRGlzY2FyZE1hdGVyaWFsXCIsXG4gICAgXCJNZXNoRGlzdG9ydE1hdGVyaWFsXCIsXG4gICAgXCJNZXNoUmVmbGVjdG9yTWF0ZXJpYWxcIixcbiAgICBcIk1lc2hSZWZyYWN0aW9uTWF0ZXJpYWxcIixcbiAgICBcIk1lc2hUcmFuc21pc3Npb25NYXRlcmlhbFwiLFxuICAgIFwiTWVzaFdvYmJsZU1hdGVyaWFsXCIsXG4gICAgXCJQb2ludE1hdGVyaWFsXCIsXG4gICAgXCJzaGFkZXJNYXRlcmlhbFwiLFxuICAgIFwiU29mdFNoYWRvd3NcIixcbiAgICBcIkNhdG11bGxSb21MaW5lXCIsXG4gICAgXCJDdWJpY0JlemllckxpbmVcIixcbiAgICBcIkZhY2VtZXNoXCIsXG4gICAgXCJMaW5lXCIsXG4gICAgXCJNZXNoXCIsXG4gICAgXCJRdWFkcmF0aWNCZXppZXJMaW5lXCIsXG4gICAgXCJSb3VuZGVkQm94XCIsXG4gICAgXCJTY3JlZW5RdWFkXCIsXG4gICAgXCJBY2N1bXVsYXRpdmVTaGFkb3dzXCIsXG4gICAgXCJCYWNrZHJvcFwiLFxuICAgIFwiQkJBbmNob3JcIixcbiAgICBcIkJvdW5kc1wiLFxuICAgIFwiQ2FtZXJhU2hha2VcIixcbiAgICBcIkNhdXN0aWNzXCIsXG4gICAgXCJDZW50ZXJcIixcbiAgICBcIkNsb3VkXCIsXG4gICAgXCJDb250YWN0U2hhZG93c1wiLFxuICAgIFwiRW52aXJvbm1lbnRcIixcbiAgICBcIkZsb2F0XCIsXG4gICAgXCJMaWdodGZvcm1lclwiLFxuICAgIFwiTWF0Y2FwVGV4dHVyZVwiLFxuICAgIFwiTm9ybWFsVGV4dHVyZVwiLFxuICAgIFwiUmFuZG9taXplZExpZ2h0XCIsXG4gICAgXCJSZXNpemVcIixcbiAgICBcIlNoYWRvd0FscGhhXCIsXG4gICAgXCJTaGFkb3dcIixcbiAgICBcIlNreVwiLFxuICAgIFwiU3BhcmtsZXNcIixcbiAgICBcIlNwb3RMaWdodFNoYWRvd1wiLFxuICAgIFwiU3BvdExpZ2h0XCIsXG4gICAgXCJTdGFnZVwiLFxuICAgIFwiU3RhcnNcIixcbiAgICBcIk9yYml0Q29udHJvbHNcIlxuXTtcblxuY29uc3Qgc2hvdWxkVGFnID0gKG5hbWUpID0+ICF0aHJlZUZpYmVyRWxlbXMuaW5jbHVkZXMobmFtZSkgJiYgIWRyZWlFbGVtcy5pbmNsdWRlcyhuYW1lKTtcblxuLy8gXHUyNzk1IENvbGxlY3QgYWxpYXNlcyBvZiB0aGUgTmV4dC5qcyA8SW1hZ2U+IGNvbXBvbmVudCBzbyB3ZSBjYW4gcmVsaWFibHkgdGFnIGl0IGV2ZW4gaWYgaXQgd2FzIHJlbmFtZWQuXG5jb25zdCBpc05leHRJbWFnZUFsaWFzID0gKGFsaWFzZXMsIG5hbWUpID0+IGFsaWFzZXMuaGFzKG5hbWUpO1xuXG5jb25zdCBleHRyYWN0TGl0ZXJhbFZhbHVlID0gKG5vZGUpID0+IHtcbiAgICBpZiAoIW5vZGUpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgc3dpdGNoIChub2RlLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnU3RyaW5nTGl0ZXJhbCc6XG4gICAgICAgICAgICByZXR1cm4gbm9kZS52YWx1ZTtcbiAgICAgICAgY2FzZSAnTnVtZXJpY0xpdGVyYWwnOlxuICAgICAgICAgICAgcmV0dXJuIG5vZGUudmFsdWU7XG4gICAgICAgIGNhc2UgJ0Jvb2xlYW5MaXRlcmFsJzpcbiAgICAgICAgICAgIHJldHVybiBub2RlLnZhbHVlO1xuICAgICAgICBjYXNlICdPYmplY3RFeHByZXNzaW9uJzpcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IHt9O1xuICAgICAgICAgICAgZm9yIChjb25zdCBwcm9wIG9mIG5vZGUucHJvcGVydGllcykge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wLnR5cGUgPT09ICdPYmplY3RQcm9wZXJ0eScgJiYgIXByb3AuY29tcHV0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gcHJvcC5rZXkudHlwZSA9PT0gJ0lkZW50aWZpZXInID8gcHJvcC5rZXkubmFtZSA6IHByb3Aua2V5LnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBvYmpba2V5XSA9IGV4dHJhY3RMaXRlcmFsVmFsdWUocHJvcC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgY2FzZSAnQXJyYXlFeHByZXNzaW9uJzpcbiAgICAgICAgICAgIHJldHVybiBub2RlLmVsZW1lbnRzLm1hcCgoZWwpID0+IGV4dHJhY3RMaXRlcmFsVmFsdWUoZWwpKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxufTtcblxuY29uc3QgZmluZFZhcmlhYmxlRGVjbGFyYXRpb25zID0gKGFzdCkgPT4ge1xuICAgIGNvbnN0IHZhcmlhYmxlcyA9IG5ldyBNYXAoKTtcbiAgICB3YWxrKGFzdCwge1xuICAgICAgICBlbnRlcihub2RlKSB7XG4gICAgICAgICAgICAvLyBIYW5kbGUgY29uc3QvbGV0L3ZhciBkZWNsYXJhdGlvbnNcbiAgICAgICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdWYXJpYWJsZURlY2xhcmF0aW9uJykge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgZGVjbGFyYXRvciBvZiBub2RlLmRlY2xhcmF0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGVjbGFyYXRvci5pZC50eXBlID09PSAnSWRlbnRpZmllcicgJiYgZGVjbGFyYXRvci5pbml0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2YXJOYW1lID0gZGVjbGFyYXRvci5pZC5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBleHRyYWN0TGl0ZXJhbFZhbHVlKGRlY2xhcmF0b3IuaW5pdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXJpYWJsZXMuc2V0KHZhck5hbWUsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB2YXJOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IEFycmF5LmlzQXJyYXkodmFsdWUpID8gJ2FycmF5JyA6IHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgPyAnb2JqZWN0JyA6ICdwcmltaXRpdmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5SXRlbXM6IEFycmF5LmlzQXJyYXkodmFsdWUpID8gdmFsdWUgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jOiBkZWNsYXJhdG9yLmxvYz8uc3RhcnRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHZhcmlhYmxlcztcbn07XG5cbmNvbnN0IGZpbmRNYXBDb250ZXh0ID0gKG5vZGUsIHZhcmlhYmxlcykgPT4ge1xuICAgIC8vIFdhbGsgdXAgdGhlIHRyZWUgdG8gZmluZCBpZiB0aGlzIEpTWCBlbGVtZW50IGlzIGluc2lkZSBhIG1hcCBjYWxsXG4gICAgbGV0IGN1cnJlbnQgPSBub2RlO1xuICAgIGxldCBkZXB0aCA9IDA7XG4gICAgY29uc3QgbWF4RGVwdGggPSAxMDsgLy8gUHJldmVudCBpbmZpbml0ZSBsb29wc1xuICAgIFxuICAgIHdoaWxlIChjdXJyZW50ICYmIGRlcHRoIDwgbWF4RGVwdGgpIHtcbiAgICAgICAgaWYgKGN1cnJlbnQudHlwZSA9PT0gJ0NhbGxFeHByZXNzaW9uJyAmJlxuICAgICAgICAgICAgY3VycmVudC5jYWxsZWU/LnR5cGUgPT09ICdNZW1iZXJFeHByZXNzaW9uJyAmJlxuICAgICAgICAgICAgY3VycmVudC5jYWxsZWU/LnByb3BlcnR5Py5uYW1lID09PSAnbWFwJykge1xuICAgICAgICAgICAgLy8gRm91bmQgYSAubWFwKCkgY2FsbCwgY2hlY2sgaWYgaXQncyBvbiBhIGtub3duIGFycmF5XG4gICAgICAgICAgICBjb25zdCBhcnJheU5hbWUgPSBjdXJyZW50LmNhbGxlZS5vYmplY3Q/Lm5hbWU7XG4gICAgICAgICAgICBjb25zdCBtYXBDYWxsYmFjayA9IGN1cnJlbnQuYXJndW1lbnRzPy5bMF07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChhcnJheU5hbWUgJiYgbWFwQ2FsbGJhY2s/LnR5cGUgPT09ICdBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbicpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtUGFyYW0gPSBtYXBDYWxsYmFjay5wYXJhbXM/LlswXTtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleFBhcmFtID0gbWFwQ2FsbGJhY2sucGFyYW1zPy5bMV07XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1QYXJhbT8udHlwZSA9PT0gJ0lkZW50aWZpZXInKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhckluZm8gPSB2YXJpYWJsZXMuZ2V0KGFycmF5TmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJheU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtVmFyTmFtZTogaXRlbVBhcmFtLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJheUl0ZW1zOiB2YXJJbmZvPy5hcnJheUl0ZW1zLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJyYXlMb2M6IHZhckluZm8/LmxvYyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4VmFyTmFtZTogaW5kZXhQYXJhbT8udHlwZSA9PT0gJ0lkZW50aWZpZXInID8gaW5kZXhQYXJhbS5uYW1lIDogdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnBhcmVudDtcbiAgICAgICAgZGVwdGgrKztcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIG51bGw7XG59O1xuXG5jb25zdCBnZXRTZW1hbnRpY05hbWUgPSAobm9kZSwgbWFwQ29udGV4dCwgaW1hZ2VBbGlhc2VzKSA9PiB7XG4gICAgY29uc3QgZ2V0TmFtZSA9ICgpID0+IHtcbiAgICAgICAgaWYgKG5vZGUubmFtZS50eXBlID09PSAnSlNYSWRlbnRpZmllcicpIHJldHVybiBub2RlLm5hbWUubmFtZTtcbiAgICAgICAgaWYgKG5vZGUubmFtZS50eXBlID09PSAnSlNYTWVtYmVyRXhwcmVzc2lvbicpIFxuICAgICAgICAgICAgcmV0dXJuIGAke25vZGUubmFtZS5vYmplY3QubmFtZX0uJHtub2RlLm5hbWUucHJvcGVydHkubmFtZX1gO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuICAgIFxuICAgIGNvbnN0IHRhZ05hbWUgPSBnZXROYW1lKCk7XG4gICAgaWYgKCF0YWdOYW1lKSByZXR1cm4gbnVsbDtcbiAgICBcbiAgICAvLyBGb3IgTmV4dC5qcyBJbWFnZSBjb21wb25lbnRzLCBhbHdheXMgcmV0dXJuICdpbWcnIHNvIHRoZSBuYW1lIGlzIGEgdmFsaWQgSFRNTCB0YWcuXG4gICAgaWYgKGlzTmV4dEltYWdlQWxpYXMoaW1hZ2VBbGlhc2VzLCB0YWdOYW1lKSkge1xuICAgICAgICByZXR1cm4gJ2ltZyc7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB0YWdOYW1lO1xufTtcblxuLyogXHVEODNEXHVERTgwIE1haW4gdHJhbnNmb3JtYXRpb24gZnVuY3Rpb25cblx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMCAqL1xuZnVuY3Rpb24gdHJhbnNmb3JtU291cmNlKHNyYywgZmlsZW5hbWUpIHtcbiAgICBpZiAoL25vZGVfbW9kdWxlcy8udGVzdChmaWxlbmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIHsgY29kZTogc3JjIH07XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgYXN0ID0gcGFyc2Uoc3JjLCB7XG4gICAgICAgICAgICBzb3VyY2VUeXBlOiAnbW9kdWxlJyxcbiAgICAgICAgICAgIHBsdWdpbnM6IFsnanN4JywgJ3R5cGVzY3JpcHQnXSxcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBtcyA9IG5ldyBNYWdpY1N0cmluZyhzcmMpO1xuICAgICAgICBjb25zdCByZWwgPSBwYXRoLnJlbGF0aXZlKHByb2Nlc3MuY3dkKCksIGZpbGVuYW1lKTtcbiAgICAgICAgbGV0IG11dGF0ZWQgPSBmYWxzZTtcbiAgICAgICAgXG4gICAgICAgIC8vIEFkZCBwYXJlbnQgcmVmZXJlbmNlcyB0byBBU1Qgbm9kZXMgZm9yIHVwd2FyZCB0cmF2ZXJzYWwgKG5vbi1lbnVtZXJhYmxlIHRvIGF2b2lkIGluZmluaXRlIHJlY3Vyc2lvbilcbiAgICAgICAgd2Fsayhhc3QsIHtcbiAgICAgICAgICAgIGVudGVyKG5vZGUsIHBhcmVudCkge1xuICAgICAgICAgICAgICAgIGlmIChwYXJlbnQgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChub2RlLCAncGFyZW50JykpIHtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5vZGUsICdwYXJlbnQnLCB7IHZhbHVlOiBwYXJlbnQsIGVudW1lcmFibGU6IGZhbHNlIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAvLyAwXHVGRTBGXHUyMEUzIENvbGxlY3QgdmFyaWFibGUgZGVjbGFyYXRpb25zIGZpcnN0XG4gICAgICAgIGNvbnN0IHZhcmlhYmxlcyA9IGZpbmRWYXJpYWJsZURlY2xhcmF0aW9ucyhhc3QpO1xuICAgICAgICBcbiAgICAgICAgLy8gMVx1RkUwRlx1MjBFMyBHYXRoZXIgbG9jYWwgaWRlbnRpZmllcnMgdGhhdCByZWZlcmVuY2UgYG5leHQvaW1hZ2VgLlxuICAgICAgICBjb25zdCBpbWFnZUFsaWFzZXMgPSBuZXcgU2V0KCk7XG4gICAgICAgIHdhbGsoYXN0LCB7XG4gICAgICAgICAgICBlbnRlcihub2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ0ltcG9ydERlY2xhcmF0aW9uJyAmJlxuICAgICAgICAgICAgICAgICAgICBub2RlLnNvdXJjZS52YWx1ZSA9PT0gJ25leHQvaW1hZ2UnKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgc3BlYyBvZiBub2RlLnNwZWNpZmllcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlQWxpYXNlcy5hZGQoc3BlYy5sb2NhbC5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgLy8gMlx1RkUwRlx1MjBFMyBJbmplY3QgYXR0cmlidXRlcyB3aXRoIGVuaGFuY2VkIHNlbWFudGljIGNvbnRleHQuXG4gICAgICAgIHdhbGsoYXN0LCB7XG4gICAgICAgICAgICBlbnRlcihub2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUudHlwZSAhPT0gJ0pTWE9wZW5pbmdFbGVtZW50JykgcmV0dXJuO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IG1hcENvbnRleHQgPSBmaW5kTWFwQ29udGV4dChub2RlLCB2YXJpYWJsZXMpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNlbWFudGljTmFtZSA9IGdldFNlbWFudGljTmFtZShub2RlLCBtYXBDb250ZXh0LCBpbWFnZUFsaWFzZXMpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICghc2VtYW50aWNOYW1lIHx8XG4gICAgICAgICAgICAgICAgICAgIFsnRnJhZ21lbnQnLCAnUmVhY3QuRnJhZ21lbnQnXS5pbmNsdWRlcyhzZW1hbnRpY05hbWUpIHx8XG4gICAgICAgICAgICAgICAgICAgICghaXNOZXh0SW1hZ2VBbGlhcyhpbWFnZUFsaWFzZXMsIHNlbWFudGljTmFtZS5zcGxpdCgnLScpWzBdKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgIXNob3VsZFRhZyhzZW1hbnRpY05hbWUpKSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IHsgbGluZSwgY29sdW1uIH0gPSBub2RlLmxvYy5zdGFydDtcbiAgICAgICAgICAgICAgICBsZXQgb3JjaGlkc0lkID0gYCR7cmVsfToke2xpbmV9OiR7Y29sdW1ufWA7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gRW5oYW5jZSB0aGUgSUQgd2l0aCBjb250ZXh0IGlmIHdlIGhhdmUgbWFwIGluZm9ybWF0aW9uXG4gICAgICAgICAgICAgICAgaWYgKG1hcENvbnRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgb3JjaGlkc0lkICs9IGBAJHttYXBDb250ZXh0LmFycmF5TmFtZX1gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBcdUQ4M0RcdUREMEQgQXBwZW5kIHJlZmVyZW5jZWQgdmFyaWFibGUgbG9jYXRpb25zIGZvciBzaW1wbGUgaWRlbnRpZmllciByZWZlcmVuY2VzIGluIHByb3BzXG4gICAgICAgICAgICAgICAgbm9kZS5hdHRyaWJ1dGVzPy5mb3JFYWNoKChhdHRyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhdHRyLnR5cGUgPT09ICdKU1hBdHRyaWJ1dGUnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyLnZhbHVlPy50eXBlID09PSAnSlNYRXhwcmVzc2lvbkNvbnRhaW5lcicgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIudmFsdWUuZXhwcmVzc2lvbj8udHlwZSA9PT0gJ0lkZW50aWZpZXInKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZWZOYW1lID0gYXR0ci52YWx1ZS5leHByZXNzaW9uLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2YXJJbmZvID0gdmFyaWFibGVzLmdldChyZWZOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhckluZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmNoaWRzSWQgKz0gYEAke3JlZk5hbWV9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIFx1RDgzRFx1RENDRCBJZiBpbnNpZGUgYSBtYXAgY29udGV4dCBhbmQgd2UgaGF2ZSBhbiBpbmRleCB2YXJpYWJsZSwgaW5qZWN0IGRhdGEtbWFwLWluZGV4XG4gICAgICAgICAgICAgICAgaWYgKG1hcENvbnRleHQ/LmluZGV4VmFyTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBtcy5hcHBlbmRMZWZ0KG5vZGUubmFtZS5lbmQsIGAgZGF0YS1tYXAtaW5kZXg9eyR7bWFwQ29udGV4dC5pbmRleFZhck5hbWV9fWApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBtcy5hcHBlbmRMZWZ0KG5vZGUubmFtZS5lbmQsIGAgZGF0YS1vcmNoaWRzLWlkPVwiJHtvcmNoaWRzSWR9XCIgZGF0YS1vcmNoaWRzLW5hbWU9XCIke3NlbWFudGljTmFtZX1cImApO1xuICAgICAgICAgICAgICAgIG11dGF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBpZiAobXV0YXRlZCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjb2RlOiBtcy50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgIG1hcDogbXMuZ2VuZXJhdGVNYXAoeyBoaXJlczogdHJ1ZSB9KVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHsgY29kZTogc3JjIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tjb21wb25lbnRUYWdnZXJdIFBhcnNlIGVycm9yOicsIGVycik7XG4gICAgICAgIHJldHVybiB7IGNvZGU6IHNyYyB9O1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBvbmVudFRhZ2dlclBsdWdpbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiAnY29tcG9uZW50LXRhZ2dlcicsXG4gICAgICAgIGVuZm9yY2U6ICdwcmUnLFxuICAgICAgICB0cmFuc2Zvcm0oc3JjLCBpZCkge1xuICAgICAgICAgICAgaWYgKGlkLmVuZHNXaXRoKCcuanN4JykgfHwgaWQuZW5kc1dpdGgoJy50c3gnKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cmFuc2Zvcm1Tb3VyY2Uoc3JjLCBpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixTQUFTLG9CQUFvQjtBQUN0UCxPQUFPLFdBQVc7OztBQ0RrUixTQUFTLGFBQWE7QUFDMVQsT0FBTyxpQkFBaUI7QUFDeEIsU0FBUyxZQUFZO0FBQ3JCLE9BQU8sVUFBVTtBQUdqQixJQUFNLGtCQUFrQjtBQUFBLEVBQ3BCO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQ0o7QUFFQSxJQUFNLFlBQVk7QUFBQSxFQUNkO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVB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
